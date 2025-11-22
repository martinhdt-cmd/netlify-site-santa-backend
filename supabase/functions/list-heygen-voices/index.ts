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
    const heygenApiKey = Deno.env.get('HEYGEN_API_KEY');

    if (!heygenApiKey) {
      throw new Error('HEYGEN_API_KEY not configured');
    }

    console.log('🎤 Fetching available voices from HeyGen...');

    const response = await fetch('https://api.heygen.com/v2/voices', {
      method: 'GET',
      headers: {
        'X-Api-Key': heygenApiKey,
        'Accept': 'application/json',
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`HeyGen API error (${response.status}): ${responseText}`);
    }

    const data = JSON.parse(responseText);
    const voices = data.data?.voices || [];

    console.log(`✅ Found ${voices.length} voices`);

    // Filter for male English voices
    const maleEnglishVoices = voices.filter((voice: any) => 
      voice.gender?.toLowerCase() === 'male' && 
      voice.language?.toLowerCase().includes('english')
    );

    console.log(`🎅 Found ${maleEnglishVoices.length} male English voices`);

    // Sort by name for easier browsing
    maleEnglishVoices.sort((a: any, b: any) => 
      (a.display_name || a.name || '').localeCompare(b.display_name || b.name || '')
    );

    return new Response(
      JSON.stringify({
        success: true,
        totalVoices: voices.length,
        maleEnglishVoices: maleEnglishVoices.length,
        voices: maleEnglishVoices.map((voice: any) => ({
          voice_id: voice.voice_id,
          name: voice.display_name || voice.name,
          language: voice.language,
          gender: voice.gender,
          age: voice.age,
          accent: voice.accent,
          preview_audio: voice.preview_audio_url,
        })),
        allVoices: voices.map((voice: any) => ({
          voice_id: voice.voice_id,
          name: voice.display_name || voice.name,
          language: voice.language,
          gender: voice.gender,
          age: voice.age,
          accent: voice.accent,
        })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error fetching voices:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});