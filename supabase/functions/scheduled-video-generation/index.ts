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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🎅 Starting scheduled video generation check...');

    const now = new Date();
    const checkTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours ahead

    // Find orders that need video generation (scheduled within next 24 hours)
    const { data: ordersToGenerate, error: fetchError } = await supabase
      .from('santa_video_orders')
      .select('*')
      .eq('video_status', 'pending')
      .lte('scheduled_delivery_date', checkTime.toISOString())
      .order('scheduled_delivery_date', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching orders:', fetchError);
      throw fetchError;
    }

    console.log(`📊 Found ${ordersToGenerate?.length || 0} orders to generate`);

    const results = {
      triggered: 0,
      errors: 0,
    };

    for (const order of ordersToGenerate || []) {
      try {
        console.log(`🎬 Triggering video generation for order ${order.id}`);

        // Call video generation trigger
        const triggerResponse = await fetch(
          `${supabaseUrl}/functions/v1/video-generation-trigger`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ orderId: order.id }),
          }
        );

        if (triggerResponse.ok) {
          results.triggered++;
          console.log(`✅ Video generation triggered for order ${order.id}`);
        } else {
          results.errors++;
          console.error(`❌ Failed to trigger video for order ${order.id}`);
        }

      } catch (error) {
        results.errors++;
        console.error(`❌ Error processing order ${order.id}:`, error);
      }
    }

    // Also run the processor to check existing videos
    console.log('🔄 Running video processor...');
    
    const processorResponse = await fetch(
      `${supabaseUrl}/functions/v1/video-generation-processor`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    const processorResult = processorResponse.ok 
      ? await processorResponse.json() 
      : { error: 'Processor failed' };

    console.log('✅ Scheduled generation complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        processorResult,
        message: `Triggered ${results.triggered} videos, ${results.errors} errors`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Scheduled generation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});