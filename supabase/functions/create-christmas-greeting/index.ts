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
    const { childName, age, gift, achievement, petName, customMessage } = await req.json();

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    const SANTA_AVATAR_ID = Deno.env.get('SANTA_AVATAR_ID') || 'adcfa9ac3d814ad287ba195d0bce59ad';
    const HEYGEN_VOICE_ID = Deno.env.get('HEYGEN_VOICE_ID');

    console.log('🔧 Environment check:');
    console.log('  HEYGEN_API_KEY:', HEYGEN_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('  SANTA_AVATAR_ID:', SANTA_AVATAR_ID);
    console.log('  HEYGEN_VOICE_ID:', HEYGEN_VOICE_ID ? `✅ Set (${HEYGEN_VOICE_ID})` : '❌ Missing');
    console.log('  VOICE: Natural Conversational');

    if (!HEYGEN_API_KEY) {
      throw new Error('HEYGEN_API_KEY not configured');
    }

    if (!HEYGEN_VOICE_ID) {
      throw new Error('HEYGEN_VOICE_ID not configured');
    }

    if (!childName) {
      throw new Error('Child name is required');
    }

    // Generate personalized script with NATURAL CONVERSATIONAL VOICE
    let script = `Ho, ho, ho!! Merry Christmas.. ${childName}!!\n`;
    
    script += `This is Santa Claus.. calling all the way from the North Pole..\n`;

    if (achievement) {
      script += `My elves told me that you've been absolutely wonderful this year.. I heard about ${achievement}.. That made me so very proud..\n`;
    } else {
      script += `My elves told me that you've been absolutely wonderful this year..\n`;
    }

    if (petName) {
      script += `And please.. give ${petName} a gentle pat from me and Mrs. Claus..\n`;
    }

    if (gift) {
      script += `Now.. I've been checking my list twice! And I have something very special planned for you this Christmas.. The elves have been working extra hard on ${gift}.. just for you..\n`;
    }

    if (customMessage) {
      script += `${customMessage}\n`;
    }

    script += `Remember now.. to keep being good.. Eat your vegetables.. And get plenty of sleep on Christmas Eve..\n`;
    
    script += `I will be visiting your house very soon..\n`;
    
    script += `Ho, ho, ho!! Merry Christmas.. ${childName}!! See you soon..`;

    console.log(`🎅 Generating video for ${childName}...`);
    console.log(`📝 Script: ${script}`);

    const response = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: SANTA_AVATAR_ID,
              avatar_style: 'normal',
            },
            voice: {
              type: 'text',
              input_text: script,
              voice_id: HEYGEN_VOICE_ID,
            },
          },
        ],
        dimension: {
          width: 1280,
          height: 720,
        },
        aspect_ratio: '16:9',
        test: false,
      }),
    });

    const data = await response.json();
    console.log('📦 HeyGen response:', JSON.stringify(data));

    if (data.data?.video_id) {
      return new Response(
        JSON.stringify({
          success: true,
          videoId: data.data.video_id,
          childName: childName,
          script: script,
          avatarId: SANTA_AVATAR_ID,
          voiceId: HEYGEN_VOICE_ID,
          voiceStyle: 'natural_conversational',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error(data.error?.message || data.message || 'Failed to generate video');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});