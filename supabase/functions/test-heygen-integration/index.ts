import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const heygenApiKey = Deno.env.get('HEYGEN_API_KEY');
    const santaAvatarId = Deno.env.get('SANTA_AVATAR_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!heygenApiKey || !santaAvatarId) {
      throw new Error('Missing HeyGen configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🎅 Creating test order...');

    // Create a test order using 'paid' status to comply with database constraints
    const testOrderId = crypto.randomUUID();
    const { data: testOrder, error: orderError } = await supabase
      .from('santa_video_orders')
      .insert({
        id: testOrderId,
        stripe_payment_intent_id: `pi_test_${Date.now()}`,
        stripe_customer_id: `cus_test_${Date.now()}`,
        product_type: 'santa_standard_video',
        parent_name: 'Test Parent',
        parent_email: 'test@example.com',
        child_name: 'Test Child',
        child_age: '5',
        child_pronouns: 'they/them',
        town_city: 'Test City',
        video_details: 'This is a test video to verify HeyGen integration is working correctly.',
        wish_list_option: 'received',
        video_status: 'pending',
        order_amount: 0,
        currency: 'gbp',
        payment_status: 'paid',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create test order: ${orderError.message}`);
    }

    console.log('✅ Test order created:', testOrder.id);

    // 🔍 Detect avatar type
    console.log('🔍 Detecting avatar type...');
    let avatarType = 'avatar';
    let characterConfig: any = {
      type: 'avatar',
      avatar_id: santaAvatarId,
      avatar_style: 'normal',
    };

    try {
      const v2Response = await fetch('https://api.heygen.com/v2/avatars', {
        headers: { 
          'X-Api-Key': heygenApiKey,
          'Accept': 'application/json'
        }
      });
      
      if (v2Response.ok) {
        const v2Data = await v2Response.json();
        const talkingPhotos = v2Data.data?.talking_photos || [];
        
        const isTalkingPhoto = talkingPhotos.some((photo: any) => 
          (photo.talking_photo_id === santaAvatarId || photo.id === santaAvatarId)
        );
        
        if (isTalkingPhoto) {
          console.log('✅ Detected TALKING_PHOTO type');
          avatarType = 'talking_photo';
          characterConfig = {
            type: 'talking_photo',
            talking_photo_id: santaAvatarId,
          };
        } else {
          console.log('✅ Detected AVATAR type');
        }
      }
    } catch (detectionError) {
      console.warn('⚠️ Avatar type detection failed:', detectionError.message);
    }

    const script = 'Ho ho ho! This is a test message from Santa Claus to verify that the HeyGen integration is working correctly. Merry Christmas!';

    console.log('🎭 Using character config:', JSON.stringify(characterConfig, null, 2));

    // Create video with 720p resolution
    const videoRequest = {
      video_inputs: [
        {
          character: characterConfig,
          voice: {
            type: 'text',
            input_text: script,
            voice_id: '1bd001e7e50f421d891986aad5158bc8',
          },
        },
      ],
      dimension: {
        width: 1280,
        height: 720,
      },
      aspect_ratio: '16:9',
      test: false,
    };

    console.log('🎬 Sending request to HeyGen API...');

    const heygenResponse = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': heygenApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoRequest),
    });

    const responseText = await heygenResponse.text();
    console.log('📥 HeyGen response:', responseText);

    if (!heygenResponse.ok) {
      throw new Error(`HeyGen API error (${heygenResponse.status}): ${responseText}`);
    }

    const heygenData = JSON.parse(responseText);
    const videoId = heygenData.data?.video_id;

    if (!videoId) {
      throw new Error('No video_id returned from HeyGen');
    }

    console.log('✅ Video generation started:', videoId);

    // Update test order
    await supabase
      .from('santa_video_orders')
      .update({
        heygen_job_id: videoId,
        video_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', testOrder.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        testOrderId: testOrder.id,
        heygenJobId: videoId,
        avatarType: avatarType,
        testScript: script,
        resolution: '720p HD',
        message: `✅ Test successful! Video generation started with ${avatarType} at 720p HD. Check your HeyGen dashboard in a few minutes.`,
        nextSteps: [
          '1. Wait 5-15 minutes for HeyGen to process the video',
          '2. Check your HeyGen dashboard for the completed video',
          '3. Set up the webhook to receive automatic notifications'
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Test failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: String(error)
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});