import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateSantaScript(orderData: any): string {
  const children = orderData.children || [];
  const townCity = orderData.town_city || '';
  const parentName = orderData.parent_name || '';

  // NATURAL CONVERSATIONAL PACING: Shorter pauses (..) for warm, flowing delivery
  let script = 'Ho, ho, ho..\nWell, well, well..\nLet me see now.. who do I have on the very top of my nice list this year..\n';

  // Greet children by name - Warm, natural delivery
  if (children.length > 1) {
    const names = children.map((child: any) => child.name).filter(Boolean);
    if (names.length > 0) {
      if (names.length === 2) {
        script += `${names[0]} and ${names[1]}..\n`;
      } else {
        const lastChild = names.pop();
        script += `${names.join(', ')} and ${lastChild}..\n`;
      }
      script += 'Oh yes.. I can see you all right here on my list..\n';
    }
  } else if (children.length === 1 && children[0].name) {
    script += `${children[0].name}..\nOh yes.. there you are.. right here on my list..\n`;
  }

  // Add location context - Natural and warm
  if (townCity) {
    script += `All the way from ${townCity}..\nMy, my.. that is just wonderful..\n`;
  }

  // BODY - Address each child with natural, conversational pacing
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const name = child.name || 'there';
    const age = child.age || '';
    const gender = child.gender || '';
    const achievements = child.achievements || '';
    const wishes = child.wishes || '';
    const specialDetails = child.special_details || '';

    // Start addressing this child - Natural transition
    if (children.length > 1) {
      script += `Now then.. ${name}..\n`;
    } else {
      script += `Now then.. let me see here..\n`;
    }

    // Mention age - Warm and natural
    if (age) {
      script += `${age} years old now.. is that right?\nMy, my.. how you have grown..\n`;
    }

    // Mention achievements - Proud, conversational tone
    if (achievements) {
      script += `You know.. I have been watching you all year long from way up here at the North Pole.. and I must say.. I am so very proud of you..\n${achievements}..\nThat is just wonderful.. truly wonderful..\n`;
    }

    // Mention hobbies and special details - Kind and natural
    if (specialDetails) {
      script += `I also know that ${specialDetails}..\nHow lovely that is..\n`;
    }

    // Mention wishes - Reassuring and warm
    if (wishes) {
      script += `And I know what you are wishing for this Christmas..\n${wishes}..\nWell now.. I will see what I can do..\nThe elves and I.. we will do our very best for you..\n`;
    }
  }

  // OUTRO - Warm, natural closing
  script += `Well now.. it is time for me to check back with Santa's workshop.. and see how my busy little elves are getting along..\n`;
  
  script += `They are working so hard.. day and night.. preparing all the special gifts for the big night..\n`;
  
  script += `And I still have my sleigh to prepare.. and the reindeer to feed.. before my long Christmas Eve journey..\n`;
  
  script += `I will be checking in on you.. to make sure you are behaving.. and tucked into bed nice and early.. so you stay on my nice list..\n`;
  
  script += `Now.. do not forget to leave me a little treat on Christmas Eve.. to help me along my travels..\n`;
  
  script += `And always remember.. what this special time of year is really all about.. Being kind.. being grateful.. and bringing joy to others..\n`;
  
  script += `From Santa Claus here at the North Pole.. to you..\nA very Merry Christmas..\nAnd to all.. a good night..`;

  return script;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    const SANTA_AVATAR_ID = Deno.env.get('SANTA_AVATAR_ID') || '0702145e7197427a9162f3707615e459';
    const HEYGEN_VOICE_ID = Deno.env.get('HEYGEN_VOICE_ID');

    console.log('🔧 Environment check:');
    console.log('  HEYGEN_API_KEY:', HEYGEN_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('  SANTA_AVATAR_ID:', SANTA_AVATAR_ID);
    console.log('  HEYGEN_VOICE_ID:', HEYGEN_VOICE_ID ? `✅ Set (${HEYGEN_VOICE_ID})` : '❌ Missing');
    console.log('  VOICE STYLE: NATURAL CONVERSATIONAL - Warm, flowing delivery');

    if (!HEYGEN_API_KEY) {
      throw new Error('HEYGEN_API_KEY not configured');
    }

    if (!HEYGEN_VOICE_ID) {
      throw new Error('HEYGEN_VOICE_ID not configured');
    }

    const { orderData } = await req.json();

    if (!orderData) {
      throw new Error('orderData is required');
    }

    console.log('📦 Order data received:', JSON.stringify(orderData, null, 2));

    // Generate the script with NATURAL CONVERSATIONAL pacing
    const script = generateSantaScript(orderData);
    console.log('📝 Generated script:', script);
    console.log('📝 Script length:', script.length, 'characters');

    // 🔍 DETECT AVATAR TYPE
    console.log('🔍 Detecting avatar type for ID:', SANTA_AVATAR_ID);
    let characterConfig: any = null;
    let avatarType = 'unknown';

    try {
      const v2Response = await fetch('https://api.heygen.com/v2/avatars', {
        headers: { 
          'X-Api-Key': HEYGEN_API_KEY,
          'Accept': 'application/json'
        }
      });
      
      if (v2Response.ok) {
        const v2Data = await v2Response.json();
        
        const talkingPhotos = v2Data.data?.talking_photos || [];
        const isTalkingPhoto = talkingPhotos.some((photo: any) => 
          (photo.talking_photo_id === SANTA_AVATAR_ID || photo.id === SANTA_AVATAR_ID)
        );
        
        if (isTalkingPhoto) {
          console.log('✅ Detected: TALKING_PHOTO');
          avatarType = 'talking_photo';
          characterConfig = {
            type: 'talking_photo',
            talking_photo_id: SANTA_AVATAR_ID,
          };
        } else {
          const customAvatars = v2Data.data?.custom_avatars || [];
          const isCustomAvatar = customAvatars.some((avatar: any) => 
            (avatar.avatar_id === SANTA_AVATAR_ID || avatar.id === SANTA_AVATAR_ID)
          );
          
          if (isCustomAvatar) {
            console.log('✅ Detected: CUSTOM_AVATAR');
            avatarType = 'avatar';
            characterConfig = {
              type: 'avatar',
              avatar_id: SANTA_AVATAR_ID,
              avatar_style: 'normal',
            };
          }
        }
      }
    } catch (e) {
      console.warn('⚠️ V2 avatar detection failed:', e.message);
    }

    if (!characterConfig) {
      console.log('⚠️ Avatar type unknown, using default avatar config');
      avatarType = 'avatar_fallback';
      characterConfig = {
        type: 'avatar',
        avatar_id: SANTA_AVATAR_ID,
        avatar_style: 'normal',
      };
    }

    console.log('🎭 Final character config:', JSON.stringify(characterConfig, null, 2));

    // Generate video with HeyGen
    const response = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: characterConfig,
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
          script: script,
          avatarType: avatarType,
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