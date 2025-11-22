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
    const { avatarId } = await req.json();
    
    if (!avatarId) {
      throw new Error('Avatar ID is required');
    }

    const projectRef = Deno.env.get('SUPABASE_PROJECT_REF');
    const accessToken = Deno.env.get('SUPABASE_ACCESS_TOKEN');

    if (!projectRef || !accessToken) {
      throw new Error('SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN must be configured in Edge Function secrets');
    }

    console.log('🔄 Updating SANTA_AVATAR_ID to:', avatarId);

    // Update the secret using Supabase Management API
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/secrets`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            name: 'SANTA_AVATAR_ID',
            value: avatarId,
          },
        ]),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update secret: ${errorText}`);
    }

    console.log('✅ SANTA_AVATAR_ID updated successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Avatar ID updated successfully! Please wait 10-20 seconds for changes to take effect.',
        newAvatarId: avatarId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error updating avatar:', error);
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