const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_DEMO_MODE';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const isPaymentConfigured = () => {
  return RAZORPAY_KEY_ID && RAZORPAY_KEY_ID !== 'rzp_test_DEMO_MODE';
};

export const createOrder = async (amount, currency = 'INR') => {
  try {
    const response = await fetch(`${API_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: `receipt_${Date.now()}`,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_URL}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify payment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    throw error;
  }
};

export const initiateRazorpayPayment = (options) => {
  return new Promise((resolve, reject) => {
    if (typeof window.Razorpay === 'undefined') {
      return reject(new Error('Razorpay SDK not loaded. Make sure script is included in index.html.'));
    }

    const defaultOptions = {
      key: RAZORPAY_KEY_ID,
      currency: 'INR',
      name: 'ShopVerse',
      description: 'Test Transaction',
      image: '/logo.png', // Fallback or customize
      handler: async function (response) {
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          
          const result = await verifyPayment(verifyData);
          if (result.success) {
            resolve({ ...response, verified: true });
          } else {
            reject(new Error('Payment verification failed'));
          }
        } catch (error) {
          reject(error);
        }
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#4F46E5', // indigo-600
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled by user'));
        }
      }
    };

    const finalOptions = { ...defaultOptions, ...options };
    
    // Add handler if provided in options (which overrides the default verifying one above, 
    // but typically we want the default verifying handler unless options overrides everything)
    if (options.handler) {
      finalOptions.handler = options.handler;
    }

    const rzp = new window.Razorpay(finalOptions);
    rzp.on('payment.failed', function (response) {
      reject(response.error);
    });
    rzp.open();
  });
};
