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
    const { 
      productType, 
      email, 
      children,
      child_name, 
      child_age, 
      child_gender,
      child_pronouns, 
      parent_name, 
      town_city, 
      video_details, 
      pronunciation_notes, 
      special_requests,
      wish_list_option,
      video_1_details,
      video_2_details,
      video_2_scheduled_date,
      recipient_name,
      recipient_age,
      recipient_gender,
      sender_name,
      occasion,
      relationship,
      message_details,
      special_message,
      delivery_date,
      delivery_email,
      gift_card_recipient_name,
      gift_card_message,
      priceId,
      quantity,
      successUrl,
      cancelUrl,
      customerEmail,
      customerId,
      metadata
    } = await req.json()

    // Ensure we have required fields
    const finalProductType = productType || metadata?.product_type || 'santa_standard_video';
    const finalEmail = email || customerEmail || 'customer@example.com';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not configured')
    }

    // Create order in database first
    const orderId = crypto.randomUUID()
    
    // Handle children array or single child
    const childrenData = children || (child_name ? [{
      name: child_name,
      age: child_age,
      gender: child_gender || 'boy'
    }] : []);

    const numberOfChildren = childrenData.length || 1;
    const firstChild = childrenData[0] || {};
    
    const orderData = {
      id: orderId,
      product_type: finalProductType,
      child_name: firstChild.name || child_name || recipient_name || 'Quick Order Customer',
      child_age: firstChild.age || child_age || recipient_age || '5',
      child_gender: firstChild.gender || child_gender || 'boy',
      child_pronouns: child_pronouns || 'they/them',
      children: childrenData,
      number_of_children: numberOfChildren,
      parent_name: parent_name || sender_name || 'Quick Order Parent',
      parent_email: finalEmail,
      town_city: town_city || 'Quick Order Location',
      video_details: video_details || 'Quick checkout order - customer will provide details later',
      pronunciation_notes: pronunciation_notes || '',
      special_requests: special_requests || special_message || 'Quick checkout - minimal personalization',
      wish_list_option: wish_list_option || '',
      video_1_details: video_1_details || '',
      video_2_details: video_2_details || '',
      video_2_scheduled_date: video_2_scheduled_date || null,
      recipient_name: recipient_name || child_name || 'Quick Order Customer',
      recipient_age: recipient_age || child_age || '5',
      recipient_gender: recipient_gender || child_gender || 'boy',
      sender_name: sender_name || parent_name || 'Quick Order Parent',
      sender_email: finalEmail,
      occasion: occasion || '',
      relationship: relationship || '',
      message_details: message_details || '',
      delivery_date: delivery_date || null,
      delivery_email: delivery_email || finalEmail,
      gift_card_recipient_name: gift_card_recipient_name || '',
      gift_card_message: gift_card_message || '',
      payment_status: 'pending',
      video_status: 'pending',
      created_at: new Date().toISOString()
    }

    const { error: orderError } = await supabase
      .from('santa_video_orders')
      .insert(orderData)

    if (orderError) {
      console.error('Error creating order:', orderError)
      throw orderError
    }

    // Get product pricing
    const productPrices = {
      'santa_standard': 'price_santa_standard_27',
      'santa_standard_video': 'price_santa_standard_27',
      'santa_two_part': 'price_santa_two_part_41',
      'two_part_santa_video': 'price_santa_two_part_41', 
      'greeting_video': 'price_greeting_video_20',
      'family_bundle': 'price_family_bundle_90',
      'gift_card': 'price_gift_card_5',
      'monthly_membership': 'price_monthly_membership_10',
      'yearly_membership': 'price_yearly_membership_104'
    }

    const finalPriceId = priceId || productPrices[finalProductType as keyof typeof productPrices]
    if (!finalPriceId) {
      throw new Error(`Unknown product type: ${finalProductType}`)
    }

    // Calculate additional children cost
    const additionalChildren = Math.max(0, numberOfChildren - 1);
    const additionalChildCost = additionalChildren * 275; // €2.75 in cents per additional child

    // Build line items
    let lineItemsParams: Record<string, string> = {
      'line_items[0][price]': finalPriceId,
      'line_items[0][quantity]': String(quantity || 1),
    };

    // Add additional children as a separate line item if needed
    if (additionalChildren > 0) {
      lineItemsParams['line_items[1][price_data][currency]'] = 'eur';
      lineItemsParams['line_items[1][price_data][product_data][name]'] = `Additional Child${additionalChildren > 1 ? 'ren' : ''} (${additionalChildren})`;
      lineItemsParams['line_items[1][price_data][product_data][description]'] = `€2.75 per additional child for extended video`;
      lineItemsParams['line_items[1][price_data][unit_amount]'] = '275';
      lineItemsParams['line_items[1][quantity]'] = String(additionalChildren);
    }

    // Create Stripe checkout session
    const sessionData = {
      mode: finalProductType.includes('membership') ? 'subscription' : 'payment',
      success_url: successUrl || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/cancel`,
    }

    const requestBody = new URLSearchParams({
      'payment_method_types[0]': 'card',
      ...lineItemsParams,
      'mode': sessionData.mode,
      'success_url': sessionData.success_url,
      'cancel_url': sessionData.cancel_url,
      'customer_email': finalEmail,
      'metadata[order_id]': orderId,
      'metadata[product_type]': finalProductType,
      'metadata[number_of_children]': String(numberOfChildren),
      'metadata[video_generation_data]': JSON.stringify({
        order_id: orderId,
        product_type: finalProductType,
        customer_email: finalEmail,
        number_of_children: numberOfChildren,
        children: childrenData,
        order_data: orderData
      })
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Stripe API error:', errorText)
      throw new Error(`Stripe API error: ${response.status}`)
    }

    const session = await response.json()

    // Update order with Stripe session ID
    const { error: updateError } = await supabase
      .from('santa_video_orders')
      .update({ 
        stripe_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order with session ID:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})