import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key not found');
    }

    const products = [
      {
        name: 'Santa Standard Video',
        description: '2-3 minute warm fireside message from Santa with personal details',
        amount: 2700, // €27.00
        currency: 'eur',
        type: 'one_time'
      },
      {
        name: 'Santa Two-Part Video Experience', 
        description: 'Two magical personalised videos: wish list acknowledgement + Christmas Eve follow-up message',
        amount: 4100, // €41.00
        currency: 'eur',
        type: 'one_time'
      },
      {
        name: 'Personalised Greeting Video',
        description: '2-3 minute heartfelt message for birthdays, anniversaries, and any special occasion',
        amount: 2000, // €20.00
        currency: 'eur', 
        type: 'one_time'
      },
      {
        name: 'Family Video Bundle',
        description: 'Any mix of 5 personalised video messages (Santa + greeting videos)',
        amount: 9000, // €90.00
        currency: 'eur',
        type: 'one_time'
      },
      {
        name: 'Printable Gift Card Add-On',
        description: 'High-resolution printable gift card PDF with recipient name and message',
        amount: 500, // €5.00
        currency: 'eur',
        type: 'one_time'
      },
      {
        name: 'Monthly Membership',
        description: 'Access to membership reminder service and member pricing perks',
        amount: 1000, // €10.00
        currency: 'eur',
        type: 'subscription',
        interval: 'month'
      },
      {
        name: 'Yearly Membership',
        description: '6 free video credits per year, 20% off additional videos, Never-Forget Reminder Service',
        amount: 10400, // €104.00
        currency: 'eur',
        type: 'subscription', 
        interval: 'year'
      }
    ];

    const results = [];

    for (const product of products) {
      // Create product
      const productResponse = await fetch('https://api.stripe.com/v1/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'name': product.name,
          'description': product.description,
        }),
      });

      const stripeProduct = await productResponse.json();
      
      // Create price
      const priceParams: Record<string, string> = {
        'product': stripeProduct.id,
        'unit_amount': product.amount.toString(),
        'currency': product.currency,
      };

      if (product.type === 'subscription') {
        priceParams['recurring[interval]'] = product.interval!;
      }

      const priceResponse = await fetch('https://api.stripe.com/v1/prices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(priceParams),
      });

      const stripePrice = await priceResponse.json();

      results.push({
        product: product.name,
        productId: stripeProduct.id,
        priceId: stripePrice.id,
        amount: product.amount,
        type: product.type
      });
    }

    return new Response(
      JSON.stringify({ success: true, products: results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Create products error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});