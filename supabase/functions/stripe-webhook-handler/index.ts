import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    // Verify webhook signature (in production, add proper verification)
    console.log('Received Stripe webhook:', { signature })

    const event = JSON.parse(body)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Processing webhook event:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      // Check if this is a video product order
      if (session.metadata?.video_generation_data) {
        const videoData = JSON.parse(session.metadata.video_generation_data)
        
        console.log('Triggering video generation for order:', videoData.order_id)
        console.log('Number of children:', videoData.number_of_children)
        console.log('Children data:', videoData.children)

        // Trigger video generation
        const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/video-generation-trigger`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: videoData.order_id,
            productType: videoData.product_type,
            orderData: videoData.order_data,
            numberOfChildren: videoData.number_of_children,
            children: videoData.children
          })
        })

        const result = await response.json()
        console.log('Video generation trigger result:', result)

        if (!result.success) {
          console.error('Failed to trigger video generation:', result.error)
        }
      }

      // Update order status to paid
      if (session.metadata?.order_id) {
        const { error: updateError } = await supabase
          .from('santa_video_orders')
          .update({
            payment_status: 'paid',
            stripe_session_id: session.id,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', session.metadata.order_id)

        if (updateError) {
          console.error('Error updating order payment status:', updateError)
        }
      }
    }

    // Handle subscription events
    if (event.type === 'customer.subscription.created' || 
        event.type === 'customer.subscription.updated' ||
        event.type === 'customer.subscription.deleted') {
      
      const subscription = event.data.object
      console.log('Processing subscription event:', event.type, subscription.id)

      // Update subscription status in database
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })

      if (subError) {
        console.error('Error updating subscription:', subError)
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})