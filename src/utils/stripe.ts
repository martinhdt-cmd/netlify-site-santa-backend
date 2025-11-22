// Stripe Price IDs - Update these after running the create-stripe-products function
export const STRIPE_PRICES = {
  SANTA_STANDARD: 'price_santa_standard_27_eur',
  SANTA_DELUXE: 'price_santa_two_part_41_eur', // Updated for two-part package
  GREETING_VIDEO: 'price_greeting_video_20_eur',
  FAMILY_BUNDLE: 'price_family_bundle_90_eur',
  GIFT_CARD: 'price_gift_card_5_eur',
  MONTHLY_MEMBERSHIP: 'price_monthly_membership_10_eur',
  YEARLY_MEMBERSHIP: 'price_yearly_membership_104_eur',
};

const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;

export interface CheckoutOptions {
  priceId: string;
  quantity?: number;
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  usePaymentRequest?: boolean; // For Apple Pay / Google Pay
  // Add product-specific fields
  productType?: string;
  orderData?: Record<string, any>;
}

export const createCheckoutSession = async (options: CheckoutOptions): Promise<{ url: string; sessionId: string }> => {
  const {
    priceId,
    quantity = 1,
    successUrl = `${window.location.origin}/success`,
    cancelUrl = window.location.href,
    customerEmail,
    customerId,
    metadata = {},
    productType,
    orderData = {},
  } = options;

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        quantity,
        successUrl,
        cancelUrl,
        customerEmail,
        customerId,
        metadata,
        // Add required fields for video orders
        productType: productType || metadata.product_type,
        email: customerEmail,
        ...orderData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to create checkout session';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const { url, sessionId } = await response.json();
    return { url, sessionId };
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

// New function for Payment Request (Apple Pay / Google Pay)
export const createPaymentIntent = async (options: {
  amount: number;
  currency?: string;
  priceId: string;
  metadata?: Record<string, string>;
}): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  const { amount, currency = 'eur', priceId, metadata = {} } = options;

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        priceId,
        metadata,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    }

    const { clientSecret, paymentIntentId } = await response.json();
    return { clientSecret, paymentIntentId };
  } catch (error) {
    console.error('Payment intent error:', error);
    throw error;
  }
};

export const redirectToCheckout = async (options: CheckoutOptions): Promise<void> => {
  try {
    const { url } = await createCheckoutSession(options);
    window.location.href = url;
  } catch (error) {
    console.error('Redirect to checkout failed:', error);
    alert('Unable to process checkout. Please try again or contact support.');
  }
};

// Customer Portal for managing subscriptions
export const createCustomerPortalSession = async (customerId: string, returnUrl?: string): Promise<string> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-customer-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: returnUrl || `${window.location.origin}/bundles`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to create customer portal session';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Customer portal error:', error);
    throw error;
  }
};

export const redirectToCustomerPortal = async (customerId: string, returnUrl?: string): Promise<void> => {
  try {
    const url = await createCustomerPortalSession(customerId, returnUrl);
    window.location.href = url;
  } catch (error) {
    console.error('Redirect to customer portal failed:', error);
    alert('Unable to open customer portal. Please try again or contact support.');
  }
};

// Referral system
export const createReferralCode = async (customerEmail: string): Promise<{ referralCode: string; referralUrl: string }> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-referral-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerEmail,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to create referral code';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Referral code error:', error);
    throw error;
  }
};

// Helper function to initialize Stripe products (run once)
export const initializeStripeProducts = async (): Promise<void> => {
  const products = [
    {
      name: 'Santa Standard Video',
      description: 'A warm, personalised fireside message from Santa with your loved one\'s name and special details',
      price: 2700, // €27.00 in cents
      currency: 'eur',
      type: 'one_time' as const,
    },
    {
      name: 'Santa Wish List & Christmas Eve Check-In (2-Part Video)',
      description: 'Two magical personalised videos from Santa: an early wish list acknowledgement and a special Christmas Eve follow-up message',
      price: 4100, // €41.00 in cents
      currency: 'eur',
      type: 'one_time' as const,
    },
    {
      name: 'Personalised Greeting Video (Any Occasion)',
      description: '2–3 minute heartfelt message for birthdays, anniversaries, congratulations, thank-you, etc.',
      price: 2000, // €20.00 in cents
      currency: 'eur',
      type: 'one_time' as const,
    },
    {
      name: 'Family Video Bundle',
      description: 'Any mix of 5 personalised video messages (Santa + greeting videos)',
      price: 9000, // €90.00 in cents
      currency: 'eur',
      type: 'one_time' as const,
    },
    {
      name: 'Printable Gift Card Add-On',
      description: 'High-resolution printable gift card PDF with recipient name and short message',
      price: 500, // €5.00 in cents
      currency: 'eur',
      type: 'one_time' as const,
    },
    {
      name: 'Monthly Membership',
      description: 'Access to membership reminder service and member pricing',
      price: 1000, // €10.00 in cents
      currency: 'eur',
      type: 'recurring' as const,
      interval: 'month' as const,
    },
    {
      name: 'Yearly Membership',
      description: '6 free video credits per year, 20% off additional videos, Never-Forget Reminder Service',
      price: 10400, // €104.00 in cents
      currency: 'eur',
      type: 'recurring' as const,
      interval: 'year' as const,
    },
  ];

  console.log('Creating Stripe products and prices...');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-stripe-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Stripe products created successfully!');
      console.log('Price IDs:');
      result.prices.forEach((price: any) => {
        console.log(`${price.product_name}: ${price.price_id}`);
      });
      return result.prices;
    } else {
      console.error('❌ Error creating Stripe products:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error calling create-stripe-products function:', error);
    return null;
  }
};
