import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();
    const heygenApiKey = Deno.env.get('HEYGEN_API_KEY');

    if (!heygenApiKey) {
      throw new Error('HeyGen API key not configured');
    }

    if (!videoId) {
      throw new Error('Video ID is required');
    }

    console.log('🔍 Fetching video details for:', videoId);

    // Get video details from HeyGen
    const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': heygenApiKey,
        'Accept': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('📥 HeyGen response:', responseText);

    if (!response.ok) {
      throw new Error(`HeyGen API error (${response.status}): ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    console.log('✅ Video details retrieved successfully');
    console.log('📊 Full data:', JSON.stringify(data, null, 2));

    // Extract voice information
    let voiceId = null;
    let voiceType = null;
    
    if (data.data) {
      // Check in video_inputs array
      if (data.data.video_inputs && data.data.video_inputs.length > 0) {
        const firstInput = data.data.video_inputs[0];
        if (firstInput.voice) {
          voiceId = firstInput.voice.voice_id;
          voiceType = firstInput.voice.type;
        }
      }
      
      // Also check top-level voice field
      if (!voiceId && data.data.voice) {
        voiceId = data.data.voice.voice_id;
        voiceType = data.data.voice.type;
      }
    }

    console.log('🎤 Voice ID found:', voiceId);
    console.log('🎭 Voice type:', voiceType);

    return new Response(
      JSON.stringify({
        success: true,
        videoId: videoId,
        voiceId: voiceId,
        voiceType: voiceType,
        fullData: data,
        message: voiceId 
          ? `✅ Voice ID found: ${voiceId}` 
          : '⚠️ No voice ID found in video data',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error fetching video details:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});