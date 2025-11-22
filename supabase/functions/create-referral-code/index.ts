import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { customerEmail, customerId } = await req.json();

    if (!customerEmail && !customerId) {
      throw new Error('Customer email or ID is required');
    }

    // Generate unique referral code
    const referralCode = `KIM${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Store referral code in Supabase (you'll need to create this table)
    // For now, we'll return the code and URL
    const referralUrl = `${new URL(req.url).origin}?ref=${referralCode}`;

    return new Response(
      JSON.stringify({ 
        referralCode,
        referralUrl,
        rewards: {
          firstReferral: '20% store credit',
          additionalReferrals: '5% store credit per purchase',
          maxDiscount: '30% per order'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Referral code error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});