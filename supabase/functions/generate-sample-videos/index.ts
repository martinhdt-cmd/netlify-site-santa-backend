import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎅 Starting sample video generation for O\'Reilly family (Daniel, Trevor, Isabella)...');

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    const SANTA_AVATAR_ID = Deno.env.get('SANTA_AVATAR_ID');
    const HEYGEN_VOICE_ID = Deno.env.get('HEYGEN_VOICE_ID');

    // Log what we have
    console.log('🔧 Environment check:');
    console.log('  HEYGEN_API_KEY:', HEYGEN_API_KEY ? '✅ Set (' + HEYGEN_API_KEY.substring(0, 8) + '...)' : '❌ Missing');
    console.log('  SANTA_AVATAR_ID:', SANTA_AVATAR_ID ? '✅ Set (' + SANTA_AVATAR_ID + ')' : '❌ Missing');
    console.log('  HEYGEN_VOICE_ID:', HEYGEN_VOICE_ID ? '✅ Set (' + HEYGEN_VOICE_ID + ')' : '❌ Missing');

    if (!HEYGEN_API_KEY || !SANTA_AVATAR_ID || !HEYGEN_VOICE_ID) {
      const missing = [];
      if (!HEYGEN_API_KEY) missing.push('HEYGEN_API_KEY');
      if (!SANTA_AVATAR_ID) missing.push('SANTA_AVATAR_ID');
      if (!HEYGEN_VOICE_ID) missing.push('HEYGEN_VOICE_ID');
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required secrets: ${missing.join(', ')}. Please set these in Supabase Dashboard > Edge Functions > Secrets.`,
          missing_secrets: missing,
          help: 'Go to Supabase Dashboard > Project Settings > Edge Functions > Secrets and add the missing values.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // 🔍 DETECT AVATAR TYPE - COPIED FROM WORKING PRODUCTION FUNCTION
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
    console.log('🔧 Locked Configuration:');
    console.log('  Avatar ID:', SANTA_AVATAR_ID);
    console.log('  Avatar Type:', avatarType);
    console.log('  Voice ID:', HEYGEN_VOICE_ID);
    console.log('  Resolution: 1280x720 (HD)');
    console.log('  Voice Style: Warm, slower, calm, reassuring, old-fashioned Santa');

    // O'Reilly Family from Dublin - 4 Sample Videos
    const sampleVideos = [];

    // ========================================
    // VIDEO 1: DANIEL (Age 4) - Standard Single Child Video
    // ========================================
    const danielScript = `Ho… ho… ho…
Well… well… well…
Let me see now… who do I have right at the top of my list this year…

Ahh… yes…
Daniel from Dublin…

Ho ho ho… what a wonderful boy you are.

Daniel… four years old already… oh my!
Time flies faster than my reindeer on a windy night…

Daniel… I've been hearing all about how well you've been doing…
Working hard in football, showing great effort in swimming,
and doing your very best in school too.

And what makes Santa especially proud…
Is how kind you've been to your brother and sister…
Sharing… helping… and being a good little lad.

That makes my heart very warm, Daniel.

Now… I did see that lovely wish list of yours…
A bike, something Paw Patrol, and a little surprise…

Ho ho ho…
Very good choices indeed.

And I hear you're very clever with your computer games,
and always making everyone laugh with your funny ways…

Keep being smart, kind, and brave, Daniel…
Santa is very proud of you.

Now…
My magic bell is ringing…
That means I must return to the workshop…

The elves are working day and night now,
getting all the special gifts ready for the big night…

And I must get my sleigh ready…
and make sure the reindeer are well fed…

Because very soon…
I'll be flying across the sky
to check in on you…

To make sure you're behaving…
listening well…
and tucked up in bed on time…

So I can keep you right at the top of my Nice List…

Ho ho ho…

And don't forget…
to leave me a small treat on Christmas night…
To help me on my long journey…

Now remember, Daniel…
Always be kind…
Be grateful…
And be good to others…

And always remember what this special time of year is truly about…

Ho… ho… ho…

Merry Christmas to you…
And to all… a good night.`;

    console.log('\n📹 VIDEO 1: Daniel (Standard Single Child)');
    console.log('Script length:', danielScript.length, 'characters');

    const danielResponse = await fetch('https://api.heygen.com/v2/video/generate', {
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
              input_text: danielScript,
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

    if (!danielResponse.ok) {
      const errorText = await danielResponse.text();
      console.error('❌ HeyGen API error for Daniel:', errorText);
      throw new Error(`HeyGen API error for Daniel: ${errorText}`);
    }

    const danielData = await danielResponse.json();
    console.log('✅ Daniel video queued:', danielData.data.video_id);

    sampleVideos.push({
      child_name: 'Daniel',
      age: 4,
      product_type: 'santa_standard_video',
      video_id: danielData.data.video_id,
      status: 'processing',
    });

    // ========================================
    // VIDEO 2: ISABELLA (Age 9) - Standard Single Child Video
    // ========================================
    const isabellaScript = `Ho… ho… ho…
Well… well… well…
Let me see now… who do I have right at the top of my list this year…

Ahh… yes…
Isabella from Dublin…

Ho ho ho… what a wonderful girl you are.

Now… now…
My very clever girl… Isabella, age nine…

Oh my… you've been very busy this year…

I hear you've been doing wonderfully in boxing,
playing great in football,
and doing beautifully with your horse riding too.

And not only that…
You've been helping your brothers,
working hard in school,
and listening very well to Mam and Dad…

I'm very proud of you, Isabella…

Santa truly is.

And I saw your wish this year…
Some horse riding equipment…
and a little surprise…

Ho ho ho…
A fine choice for such a hardworking young lady.

Keep being strong… kind… and thoughtful…
Just like you are.

Now…
My magic bell is ringing…
That means I must return to the workshop…

The elves are working day and night now,
getting all the special gifts ready for the big night…

And I must get my sleigh ready…
and make sure the reindeer are well fed…

Because very soon…
I'll be flying across the sky
to check in on you…

To make sure you're behaving…
listening well…
and tucked up in bed on time…

So I can keep you right at the top of my Nice List…

Ho ho ho…

And don't forget…
to leave me a small treat on Christmas night…
To help me on my long journey…

Now remember, Isabella…
Always be kind…
Be grateful…
And be good to others…

And always remember what this special time of year is truly about…

Ho… ho… ho…

Merry Christmas to you…
And to all… a good night.`;

    console.log('\n📹 VIDEO 2: Isabella (Standard Single Child)');
    console.log('Script length:', isabellaScript.length, 'characters');

    const isabellaResponse = await fetch('https://api.heygen.com/v2/video/generate', {
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
              input_text: isabellaScript,
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

    if (!isabellaResponse.ok) {
      const errorText = await isabellaResponse.text();
      console.error('❌ HeyGen API error for Isabella:', errorText);
      throw new Error(`HeyGen API error for Isabella: ${errorText}`);
    }

    const isabellaData = await isabellaResponse.json();
    console.log('✅ Isabella video queued:', isabellaData.data.video_id);

    sampleVideos.push({
      child_name: 'Isabella',
      age: 9,
      product_type: 'santa_standard_video',
      video_id: isabellaData.data.video_id,
      status: 'processing',
    });

    // ========================================
    // VIDEO 3: TREVOR (Age 3) - Two-Part Video (Part 1)
    // ========================================
    const trevorPart1Script = `Ho… ho… ho…
Well… well… well…
Let me see now… who do I have right at the top of my list this year…

Ahh… yes…
Trevor from Dublin…

Ho ho ho… what a wonderful boy you are.

Now let's see…
Little Trevor, nearly as quick as my elves!

Three years old… and already doing so well…

Trevor… I've heard you've been doing great in school,
lovely job with your colouring on paper…
and being such a good boy when listening to Mammy and Daddy.

I also see you've been very good at sharing with your brother and sister…
That makes Santa very happy indeed.

And I see here on my list…
You'd love a bike, a Lightning McQueen truck and car,
and… another special surprise…

Ho ho ho…
What a fine wish list you've made!

And I know you love playing with your cars
and having fun with your brother…

Trevor… keep being good, keep listening, and keep smiling…
Santa sees everything.

Now…
My magic bell is ringing…
That means I must return to the workshop…

The elves are working day and night now,
getting all the special gifts ready for the big night…

And I must get my sleigh ready…
and make sure the reindeer are well fed…

Because very soon…
I'll be flying across the sky
to check in on you…

To make sure you're behaving…
listening well…
and tucked up in bed on time…

So I can keep you right at the top of my Nice List…

Ho ho ho…

And don't forget…
to leave me a small treat on Christmas night…
To help me on my long journey…

Now remember, Trevor…
Always be kind…
Be grateful…
And be good to others…

And always remember what this special time of year is truly about…

Ho… ho… ho…

Merry Christmas to you…
And to all… a good night.`;

    console.log('\n📹 VIDEO 3: Trevor Part 1 (Two-Part Video)');
    console.log('Script length:', trevorPart1Script.length, 'characters');

    const trevorPart1Response = await fetch('https://api.heygen.com/v2/video/generate', {
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
              input_text: trevorPart1Script,
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

    if (!trevorPart1Response.ok) {
      const errorText = await trevorPart1Response.text();
      console.error('❌ HeyGen API error for Trevor Part 1:', errorText);
      throw new Error(`HeyGen API error for Trevor Part 1: ${errorText}`);
    }

    const trevorPart1Data = await trevorPart1Response.json();
    console.log('✅ Trevor Part 1 video queued:', trevorPart1Data.data.video_id);

    sampleVideos.push({
      child_name: 'Trevor',
      age: 3,
      product_type: 'two_part_santa_video',
      part: 1,
      video_id: trevorPart1Data.data.video_id,
      status: 'processing',
    });

    // ========================================
    // VIDEO 4: TREVOR (Age 3) - Two-Part Video (Part 2)
    // ========================================
    const trevorPart2Script = `Ho… ho… ho…
Trevor… it's Santa again!

I'm back from checking on the workshop…
and I have some wonderful news for you…

The elves have been working extra hard on your special gifts…
Your bike is looking magnificent…
and your Lightning McQueen truck and car are ready to go…

And that special surprise I mentioned?
Well… let's just say…
you're going to love it on Christmas morning!

Now Trevor…
I need you to promise me something…

Be extra good for Mammy and Daddy…
Keep sharing with your brother and sister…
and make sure you're fast asleep on Christmas Eve…

Because I'll be coming to visit your house in Dublin…
very… very… soon…

And I can only leave presents for children who are tucked up in bed…
sleeping soundly…

So close your eyes tight…
dream of sugar plums and candy canes…
and when you wake up on Christmas morning…

There will be something very special waiting for you…

Ho… ho… ho…

I'm so proud of you, Trevor…
You're such a good boy…

Keep being kind…
Keep being brave…
And keep making everyone smile…

Merry Christmas, Trevor…
From Santa Claus…
here at the North Pole…

And to all… a good night.`;

    console.log('\n📹 VIDEO 4: Trevor Part 2 (Two-Part Video)');
    console.log('Script length:', trevorPart2Script.length, 'characters');

    const trevorPart2Response = await fetch('https://api.heygen.com/v2/video/generate', {
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
              input_text: trevorPart2Script,
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

    if (!trevorPart2Response.ok) {
      const errorText = await trevorPart2Response.text();
      console.error('❌ HeyGen API error for Trevor Part 2:', errorText);
      throw new Error(`HeyGen API error for Trevor Part 2: ${errorText}`);
    }

    const trevorPart2Data = await trevorPart2Response.json();
    console.log('✅ Trevor Part 2 video queued:', trevorPart2Data.data.video_id);

    sampleVideos.push({
      child_name: 'Trevor',
      age: 3,
      product_type: 'two_part_santa_video',
      part: 2,
      video_id: trevorPart2Data.data.video_id,
      status: 'processing',
    });

    console.log('\n✅ ALL SAMPLE VIDEOS QUEUED SUCCESSFULLY');
    console.log('Total videos:', sampleVideos.length);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully started generation of 4 sample videos for O\'Reilly family',
        family: 'O\'Reilly Family from Dublin',
        children: [
          { name: 'Daniel', age: 4, videos: 1 },
          { name: 'Isabella', age: 9, videos: 1 },
          { name: 'Trevor', age: 3, videos: 2 }
        ],
        videos: sampleVideos,
        configuration: {
          avatar_id: SANTA_AVATAR_ID,
          avatar_type: avatarType,
          voice_id: HEYGEN_VOICE_ID,
          resolution: '1280x720',
          voice_style: 'Warm, slower, calm, reassuring, old-fashioned Santa',
          locked: true
        },
        note: 'Videos will be ready in 5-10 minutes. Check status in the Video Dashboard.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error generating sample videos:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});