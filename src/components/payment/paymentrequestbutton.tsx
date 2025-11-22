import { useState, useEffect } from 'react';

interface PaymentRequestButtonProps {
  amount: number;
  currency: string;
  label: string;
  onSuccess: (paymentMethod: any) => void;
  onError: (error: any) => void;
}

const PaymentRequestButton = ({ 
  amount, 
  currency, 
  label, 
  onSuccess, 
  onError 
}: PaymentRequestButtonProps) => {
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Stripe) {
      const stripe = (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: currency.toLowerCase(),
        total: {
          label: label,
          amount: amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result: any) => {
        if (result) {
          setCanMakePayment(true);
          setPaymentRequest(pr);
        }
      });

      pr.on('paymentmethod', async (ev: any) => {
        try {
          onSuccess(ev.paymentMethod);
          ev.complete('success');
        } catch (error) {
          onError(error);
          ev.complete('fail');
        }
      });
    }
  }, [amount, currency, label, onSuccess, onError]);

  if (!canMakePayment || !paymentRequest) {
    return null;
  }

  return (
    <div className="mb-4">
      <div 
        id="payment-request-button"
        className="bg-black text-white rounded-lg p-3 text-center cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={() => paymentRequest.show()}
      >
        <i className="fab fa-apple-pay mr-2"></i>
        <i className="fab fa-google-pay mr-2"></i>
        Pay with Apple Pay or Google Pay
      </div>
      
      <div className="text-center text-gray-500 text-sm my-3">
        or
      </div>
    </div>
  );
};

export default PaymentRequestButton;