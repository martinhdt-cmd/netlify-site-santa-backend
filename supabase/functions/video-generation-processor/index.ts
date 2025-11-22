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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!heygenApiKey) {
      throw new Error('Missing HeyGen API key');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔄 Starting video generation processor...');

    // Fetch videos that need to be sent to HeyGen (queued status, no job ID yet)
    const { data: queuedVideos, error: queueError } = await supabase
      .from('video_generation_queue')
      .select('*')
      .eq('status', 'queued')
      .is('heygen_job_id', null)
      .order('created_at', { ascending: true })
      .limit(10);

    if (queueError) {
      console.error('❌ Error fetching queued videos:', queueError);
      throw queueError;
    }

    console.log(`📊 Found ${queuedVideos?.length || 0} videos to send to HeyGen`);

    // ✅ FIXED: Fetch ALL processing videos (including those just created by sample generator)
    const { data: processingVideos, error: processingError } = await supabase
      .from('video_generation_queue')
      .select('*')
      .eq('status', 'processing')
      .not('heygen_job_id', 'is', null)
      .order('created_at', { ascending: true });

    if (processingError) {
      console.error('❌ Error fetching processing videos:', processingError);
    }

    console.log(`📊 Found ${processingVideos?.length || 0} videos already processing in HeyGen`);

    const results = {
      sent: 0,
      checked: 0,
      completed: 0,
      failed: 0,
      stillProcessing: 0,
    };

    // STEP 1: Send queued videos to HeyGen
    for (const video of queuedVideos || []) {
      try {
        console.log(`\n🎬 Sending video ${video.id} to HeyGen...`);
        console.log(`📝 Order ID: ${video.order_id}, Type: ${video.video_type}`);

        // Update status to processing
        await supabase
          .from('video_generation_queue')
          .update({
            status: 'processing',
            updated_at: new Date().toISOString(),
          })
          .eq('id', video.id);

        // Get order data
        const { data: order } = await supabase
          .from('santa_video_orders')
          .select('*')
          .eq('id', video.order_id)
          .single();

        if (!order) {
          throw new Error(`Order ${video.order_id} not found`);
        }

        // Call HeyGen video generator
        const generatorResponse = await fetch(
          `${supabaseUrl}/functions/v1/heygen-video-generator`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderData: {
                ...order,
                ...video.personalization_data,
                product_type: order.product_type,
                video_type: video.video_type,
              }
            }),
          }
        );

        const generatorResult = await generatorResponse.json();

        if (generatorResponse.ok && generatorResult.video_id) {
          console.log(`✅ Video sent to HeyGen! Job ID: ${generatorResult.video_id}`);
          
          // Update queue with HeyGen job ID
          await supabase
            .from('video_generation_queue')
            .update({
              heygen_job_id: generatorResult.video_id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', video.id);

          results.sent++;
        } else {
          throw new Error(generatorResult.error || 'Failed to generate video');
        }

      } catch (error) {
        console.error(`❌ Error sending video ${video.id} to HeyGen:`, error);
        
        await supabase
          .from('video_generation_queue')
          .update({
            status: 'error',
            error_message: error.message,
            updated_at: new Date().toISOString(),
          })
          .eq('id', video.id);

        results.failed++;
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // STEP 2: Check status of ALL videos processing in HeyGen (including sample videos)
    for (const video of processingVideos || []) {
      results.checked++;
      
      console.log(`\n🔍 Checking status for HeyGen job: ${video.heygen_job_id}`);

      try {
        const statusResponse = await fetch(
          `https://api.heygen.com/v1/video_status.get?video_id=${video.heygen_job_id}`,
          {
            headers: {
              'X-Api-Key': heygenApiKey,
              'Accept': 'application/json',
            },
          }
        );

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text();
          console.error(`❌ HeyGen status check failed for ${video.heygen_job_id}: ${errorText}`);
          continue;
        }

        const statusData = await statusResponse.json();
        const heygenStatus = statusData.data?.status;
        const videoUrl = statusData.data?.video_url;

        console.log(`📹 HeyGen status for ${video.heygen_job_id}: ${heygenStatus}`);

        if (heygenStatus === 'completed' && videoUrl) {
          console.log(`✅ Video completed: ${videoUrl}`);
          
          await supabase
            .from('video_generation_queue')
            .update({
              status: 'completed',
              heygen_video_url: videoUrl,
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', video.id);

          await supabase
            .from('santa_video_orders')
            .update({
              video_status: 'preview_ready',
              preview_video_url: videoUrl,
              updated_at: new Date().toISOString(),
            })
            .eq('id', video.order_id);

          results.completed++;

        } else if (heygenStatus === 'failed' || heygenStatus === 'error') {
          console.error(`❌ Video generation failed for ${video.heygen_job_id}`);
          
          await supabase
            .from('video_generation_queue')
            .update({
              status: 'error',
              error_message: statusData.data?.error || 'Video generation failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', video.id);

          await supabase
            .from('santa_video_orders')
            .update({
              video_status: 'error',
              updated_at: new Date().toISOString(),
            })
            .eq('id', video.order_id);

          results.failed++;
          
        } else {
          console.log(`⏳ Video still processing in HeyGen: ${heygenStatus}`);
          results.stillProcessing++;
        }

      } catch (error) {
        console.error(`❌ Error checking video ${video.id}:`, error);
      }

      // Small delay between status checks
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ Processing complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: `Sent ${results.sent} new videos to HeyGen. Checked ${results.checked} videos: ${results.completed} completed, ${results.failed} failed, ${results.stillProcessing} still processing`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Processor error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});