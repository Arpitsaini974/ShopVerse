import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Check, ChevronRight, MapPin, Truck, CreditCard, FileText, 
  AlertCircle, Loader2, ShieldCheck, Lock, RefreshCw, XCircle, 
  ShoppingBag, ArrowLeft, Package, CheckCircle, ArrowRight, Clock, 
  Wallet, Smartphone, Building2, HelpCircle, BadgeCheck, Sparkles, 
  Tag, ChevronDown, ChevronUp, Plus, Minus, Trash2
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';
import { formatPrice } from '../utils/helpers';
import { AddressForm } from '../components/checkout/AddressForm';
import { RazorpayModal } from '../components/checkout/RazorpayModal';
import { api } from '../api/client';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Route parameters for direct Buy Now flow
  const isBuyNowParam = searchParams.get('buyNow') === 'true' || !!searchParams.get('productId');
  const queryProductId = searchParams.get('productId');
  const queryQty = Math.max(1, parseInt(searchParams.get('qty'), 10) || 1);

  // Zustand Store Selectors
  const cartItems = useCartStore((state) => state.items || []);
  const buyNowItem = useCartStore((state) => state.buyNowItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearBuyNowItem = useCartStore((state) => state.clearBuyNowItem);
  const updateCartQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeItem);

  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const rawAddresses = useAuthStore((state) => state.addresses);
  const addOrder = useAuthStore((state) => state.addOrder);
  const logout = useAuthStore((state) => state.logout);
  const addToast = useUIStore((state) => state.addToast);

  // STEP 1 CHECKOUT RULE: Mandate authentication before checkout
  useEffect(() => {
    if (!isLoggedIn || !user) {
      const currentUrl = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`, { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  // Normalize addresses array defensively
  const addresses = useMemo(() => {
    if (!Array.isArray(rawAddresses)) return [];
    return rawAddresses.map(a => ({
      id: String(a.id),
      fullName: a.fullName || a.name || 'Customer',
      phone: a.phone || '',
      addressLine1: a.addressLine1 || a.address || a.street || '',
      addressLine2: a.addressLine2 || '',
      city: a.city || '',
      state: a.state || '',
      pincode: a.pincode || a.zipCode || '',
      type: a.type || 'Home',
      isDefault: !!a.isDefault
    }));
  }, [rawAddresses]);

  // Checkout Items State (Unified between Buy Now and Cart)
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(true);
  const [checkoutError, setCheckoutError] = useState(null);

  // Progressive Accordion Active Step (1: Login, 2: Address, 3: Order Summary, 4: Payment)
  const [activeStep, setActiveStep] = useState(2); // Step 1 is auto-completed when logged in

  // Step 2 (Address) states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Step 3 (Order Summary) states
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Step 4 (Payment Options) states
  const [selectedPaymentTab, setSelectedPaymentTab] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'emi' | 'cod' | 'paylater'
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedEmiTenure, setSelectedEmiTenure] = useState(6); // 3, 6, 9, 12 months

  // Card form state
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // COD Captcha state
  const [codCaptchaCode, setCodCaptchaCode] = useState('');
  const [codCaptchaInput, setCodCaptchaInput] = useState('');
  const [codCaptchaError, setCodCaptchaError] = useState('');
  const [isSubmittingCOD, setIsSubmittingCOD] = useState(false);

  // Payment Execution & Gateway modal states
  const [isInitiating, setIsInitiating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'initiating' | 'verifying' | 'verified_success' | 'failed' | 'cancelled' | 'pending'
  const [verifiedPayment, setVerifiedPayment] = useState(null);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

  // Generate a random 3-digit captcha for COD
  const generateCaptcha = () => {
    const randomCode = Math.floor(100 + Math.random() * 900).toString();
    setCodCaptchaCode(randomCode);
    setCodCaptchaInput('');
    setCodCaptchaError('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Default address initialization
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  // Load items for checkout (Buy Now or standard Cart)
  useEffect(() => {
    let isMounted = true;

    async function initializeCheckout() {
      setIsLoadingCheckout(true);
      setCheckoutError(null);

      // Scenario A: Buy Now flow via URL parameter or store
      if (isBuyNowParam && queryProductId) {
        setIsBuyNowMode(true);
        try {
          const availability = await api.checkProductAvailability(queryProductId);
          if (!availability || !availability.exists) {
            if (isMounted) {
              setCheckoutError({
                type: 'NOT_FOUND',
                title: 'Product unavailable',
                message: `We could not find the requested product (ID #${queryProductId}) in our store catalog.`
              });
              setIsLoadingCheckout(false);
            }
            return;
          }

          if (!availability.inStock || availability.stock < queryQty) {
            if (isMounted) {
              setCheckoutError({
                type: 'OUT_OF_STOCK',
                title: 'This product is currently out of stock.',
                message: `Only ${availability.stock} unit(s) are available. Please adjust your quantity or browse other products.`,
                productId: queryProductId
              });
              setIsLoadingCheckout(false);
            }
            return;
          }

          if (isMounted) {
            setCheckoutItems([{
              id: availability.id,
              productId: availability.id,
              name: availability.name,
              price: Number(availability.price),
              originalPrice: Number(availability.originalPrice || availability.price),
              image: availability.image,
              quantity: queryQty,
              stock: availability.stock
            }]);
            setIsLoadingCheckout(false);
          }
        } catch (err) {
          console.error('Failed to validate Buy Now product with database:', err);
          if (isMounted) {
            if (buyNowItem && String(buyNowItem.id) === String(queryProductId)) {
              setCheckoutItems([buyNowItem]);
              setIsLoadingCheckout(false);
            } else {
              setCheckoutError({
                type: 'SERVER_ERROR',
                title: 'Failed to load order',
                message: err.message || 'Unable to connect to product catalog database.'
              });
              setIsLoadingCheckout(false);
            }
          }
        }
        return;
      }

      // Scenario B: Buy Now flow via stored buyNowItem
      if (isBuyNowParam && buyNowItem) {
        setIsBuyNowMode(true);
        if (buyNowItem.stock <= 0) {
          setCheckoutError({
            type: 'OUT_OF_STOCK',
            title: 'This product is currently out of stock.',
            message: 'Please browse other available items.',
            productId: buyNowItem.id
          });
          setIsLoadingCheckout(false);
          return;
        }
        setCheckoutItems([buyNowItem]);
        setIsLoadingCheckout(false);
        return;
      }

      // Scenario C: Regular Cart checkout
      setIsBuyNowMode(false);
      if (cartItems.length > 0) {
        const validItems = cartItems
          .map(it => {
            const resolvedId = it.productId ?? it.product_id ?? it.id ?? it.product?.id ?? it.product?.productId;
            const resolvedVariantId = it.variantId ?? it.variant_id ?? it.product?.variantId ?? it.product?.variant_id ?? null;
            return {
              id: resolvedId,
              productId: resolvedId,
              variantId: resolvedVariantId,
              variant: it.variant || it.selectedSize || it.selectedColor || null,
              name: it.name || it.product?.name || 'Cart Item',
              price: Number(it.price || it.product?.price) || 0,
              originalPrice: Number(it.originalPrice || it.mrp || it.price || it.product?.price) || 0,
              image: it.image || it.thumbnail || it.product?.image || it.product?.thumbnail || 'https://via.placeholder.com/300',
              quantity: Math.max(1, Number(it.quantity) || 1),
              stock: Number(it.stock || it.product?.stock) || 10
            };
          })
          .filter(it => it.id !== undefined && it.id !== null);

        if (validItems.length > 0) {
          setCheckoutItems(validItems);
          setIsLoadingCheckout(false);
        } else {
          setCheckoutError({
            type: 'EMPTY',
            title: 'Your checkout is empty',
            message: 'Looks like you do not have any valid items ready for checkout.'
          });
          setIsLoadingCheckout(false);
        }
      } else {
        setCheckoutError({
          type: 'EMPTY',
          title: 'Your checkout is empty',
          message: 'Looks like you do not have any items ready for checkout.'
        });
        setIsLoadingCheckout(false);
      }
    }

    initializeCheckout();
    return () => { isMounted = false; };
  }, [isBuyNowParam, queryProductId, queryQty, buyNowItem, cartItems]);

  // Derived Financial Calculations
  const totalMrp = useMemo(() => {
    return checkoutItems.reduce((acc, item) => {
      const orig = Number(item.originalPrice) > Number(item.price) ? Number(item.originalPrice) : Number(item.price);
      return acc + orig * (Number(item.quantity) || 1);
    }, 0);
  }, [checkoutItems]);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  }, [checkoutItems]);

  const productDiscount = useMemo(() => {
    return Math.max(0, totalMrp - subtotal);
  }, [totalMrp, subtotal]);

  const deliveryCharge = useMemo(() => {
    if (checkoutItems.length === 0) return 0;
    return deliveryMethod === 'express' ? 99 : (subtotal >= 499 ? 0 : 40);
  }, [deliveryMethod, subtotal, checkoutItems.length]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + deliveryCharge - couponDiscount);
  }, [subtotal, deliveryCharge, couponDiscount]);

  const totalSavings = useMemo(() => {
    return productDiscount + couponDiscount + (deliveryMethod === 'standard' && subtotal >= 499 ? 40 : 0);
  }, [productDiscount, couponDiscount, deliveryMethod, subtotal]);

  // Item quantity handlers inside Order Summary
  const handleItemQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    setCheckoutItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
    if (!isBuyNowMode) {
      updateCartQuantity(itemId, newQty);
    }
  };

  const handleRemoveItem = (itemId) => {
    const updated = checkoutItems.filter(item => item.id !== itemId);
    setCheckoutItems(updated);
    if (!isBuyNowMode) {
      removeFromCart(itemId);
    }
    if (updated.length === 0) {
      setCheckoutError({
        type: 'EMPTY',
        title: 'Your cart is now empty',
        message: 'You have removed all items from checkout.'
      });
    }
  };

  // Coupon handling
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      const discount = Math.round(subtotal * 0.10);
      setCouponDiscount(discount);
      setAppliedCoupon('SAVE10 (10% Off)');
      addToast('Coupon SAVE10 applied successfully!', 'success');
    } else if (code === 'SHOP500') {
      const discount = Math.min(500, subtotal);
      setCouponDiscount(discount);
      setAppliedCoupon('SHOP500 (₹500 Off)');
      addToast('Coupon SHOP500 applied successfully!', 'success');
    } else {
      addToast('Invalid coupon code. Try SAVE10 or SHOP500', 'error');
    }
  };

  // Card input formatting
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData(prev => ({ ...prev, number: val }));
  };

  const handleCardExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardData(prev => ({ ...prev, expiry: val }));
  };

  // Step Navigation Handlers
  const handleDeliverHere = () => {
    if (!selectedAddressId) {
      addToast('Please select a delivery address', 'error');
      return;
    }
    setActiveStep(3); // Move to Order Summary
  };

  const handleContinueToPayment = () => {
    if (checkoutItems.length === 0) {
      addToast('Your checkout has no items', 'error');
      return;
    }
    setActiveStep(4); // Move to Payment Options
  };

  // Selected address object helper
  const selectedAddress = addresses.find(a => String(a.id) === String(selectedAddressId)) || addresses[0];

  // ==========================================
  // ONLINE PAYMENT INITIATION & VERIFICATION
  // ==========================================
  const handleInitiateOnlinePayment = async () => {
    if (!selectedAddress) {
      addToast('Please select a valid delivery address', 'error');
      setActiveStep(2);
      return;
    }

    if (checkoutItems.length === 0) {
      addToast('No items available for checkout', 'error');
      return;
    }

    setPaymentError(null);
    setIsInitiating(true);
    setPaymentState('initiating');

    try {
      const initResult = await api.initiateCheckout({
        items: checkoutItems.map(it => {
          const pId = it.productId ?? it.id ?? it.product_id;
          const vId = it.variantId ?? it.variant_id ?? null;
          return {
            productId: pId,
            id: pId,
            product_id: pId,
            variantId: vId,
            variant_id: vId,
            name: it.name,
            quantity: Math.max(1, Number(it.quantity) || 1)
          };
        }),
        customerDetails: {
          id: user?.id || 'guest',
          fullName: user?.name || selectedAddress.fullName || selectedAddress.name || 'Customer',
          phone: selectedAddress.phone || user?.phone || '',
          email: user?.email || 'customer@shopverse.in'
        },
        shippingAddress: {
          fullName: selectedAddress.fullName || selectedAddress.name || 'Customer',
          phone: selectedAddress.phone || user?.phone || '',
          addressLine1: selectedAddress.addressLine1 || selectedAddress.address || selectedAddress.street || 'Address',
          addressLine2: selectedAddress.addressLine2 || '',
          city: selectedAddress.city || '',
          state: selectedAddress.state || '',
          pincode: selectedAddress.pincode || selectedAddress.zipCode || ''
        },
        deliveryMethod,
        discountAmount: couponDiscount
      });

      setPendingOrder(initResult);
      setIsInitiating(false);

      // Official Razorpay SDK integration if live/test credentials exist
      if (window.Razorpay && initResult.key && initResult.key !== 'rzp_test_DEMO_MODE') {
        try {
          const options = {
            key: initResult.key,
            amount: Math.round(initResult.amount * 100),
            currency: initResult.currency || 'INR',
            name: 'ShopVerse Marketplace',
            description: `Order #${initResult.orderId}`,
            order_id: initResult.paymentOrderId,
            prefill: {
              name: user?.name || selectedAddress?.fullName || 'Customer',
              email: user?.email || 'customer@shopverse.in',
              contact: selectedAddress?.phone || '9876543210'
            },
            theme: { color: '#0c2340' },
            handler: function(response) {
              handlePaymentSuccess({
                ...response,
                paymentMethod: selectedPaymentTab || 'upi'
              });
            },
            modal: {
              ondismiss: function() {
                handlePaymentCancelled();
              }
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function(response) {
            handlePaymentFailure(response.error?.description || 'Payment failed at gateway');
          });
          rzp.open();
          return;
        } catch (gatewayErr) {
          console.warn('Razorpay SDK modal error, using secure fallback modal:', gatewayErr);
        }
      }

      setIsRazorpayModalOpen(true);
    } catch (err) {
      console.error('[CHECKOUT INITIATION FAILED]', err);
      setIsInitiating(false);
      setPaymentState('failed');
      const errMsg = err.message || "We couldn't start the payment. Please try again.";
      setPaymentError(errMsg);
      addToast(errMsg, 'error');
    }
  };

  // Cryptographic Backend Verification
  const handlePaymentSuccess = async (gatewayResponse) => {
    setIsRazorpayModalOpen(false);
    setIsVerifying(true);
    setPaymentState('verifying');

    try {
      const verificationResult = await api.verifyPayment({
        orderId: pendingOrder.orderId,
        razorpay_order_id: gatewayResponse.razorpay_order_id,
        razorpay_payment_id: gatewayResponse.razorpay_payment_id,
        razorpay_signature: gatewayResponse.razorpay_signature
      });

      if (verificationResult.success && verificationResult.orderStatus === 'CONFIRMED') {
        setIsVerifying(false);
        setVerifiedPayment({
          orderId: verificationResult.orderId,
          totalAmount: verificationResult.totalAmount || pendingOrder.amount || total,
          paymentId: verificationResult.paymentId || gatewayResponse.razorpay_payment_id,
          paymentMethod: gatewayResponse.paymentMethod || selectedPaymentTab || 'upi',
          methodLabel: gatewayResponse.methodLabel || 'Online Payment',
          metadata: gatewayResponse.metadata || {}
        });
        setPaymentState('verified_success');
        addToast('Payment verified successfully!', 'success');
      } else {
        throw new Error('Verification did not return confirmed status.');
      }
    } catch (err) {
      setIsVerifying(false);
      setPaymentState('failed');
      const errMsg = err.message || 'Payment verification failed. No confirmed order was placed.';
      setPaymentError(errMsg);
      addToast(errMsg, 'error');
    }
  };

  // Customer clicks CONTINUE on the verified payment screen
  const handleContinueToConfirmation = () => {
    if (isConfirmingOrder || !verifiedPayment) return;
    setIsConfirmingOrder(true);

    if (addOrder) {
      addOrder({
        id: verifiedPayment.orderId,
        date: new Date().toISOString(),
        items: [...checkoutItems],
        shippingAddress: selectedAddress,
        deliveryMethod,
        paymentMethod: verifiedPayment.paymentMethod,
        subtotal,
        deliveryCharge,
        total: verifiedPayment.totalAmount,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        transactionId: verifiedPayment.paymentId
      });
    }

    if (isBuyNowMode) {
      clearBuyNowItem();
    } else {
      clearCart();
    }

    navigate(`/order-confirmation/${verifiedPayment.orderId}`);
  };

  // Payment Failure Handler
  const handlePaymentFailure = async (errorReason) => {
    setIsRazorpayModalOpen(false);
    setPaymentState('failed');
    if (pendingOrder?.orderId) {
      try {
        await api.reportPaymentFailed(pendingOrder.orderId, errorReason);
      } catch (e) {
        console.warn('Failed to report failure to server:', e);
      }
    }
    setPaymentError(`Payment Failed: ${errorReason || 'Transaction declined by bank'}. No order was placed. Your items are preserved.`);
    addToast('Payment was not completed. Order not placed.', 'error');
  };

  // Payment Cancelled Handler
  const handlePaymentCancelled = async () => {
    setIsRazorpayModalOpen(false);
    setPaymentState('cancelled');
    if (pendingOrder?.orderId) {
      try {
        await api.reportPaymentCancelled(pendingOrder.orderId);
      } catch (e) {
        console.warn('Failed to report cancellation to server:', e);
      }
    }
    setPaymentError('Payment window was closed or cancelled. Order was NOT confirmed. Your items are safely preserved.');
    addToast('Payment cancelled. You can retry whenever you are ready.', 'info');
  };

  // Payment Pending Handler
  const handlePaymentPending = (reason) => {
    setIsRazorpayModalOpen(false);
    setPaymentState('pending');
    setPaymentError(reason || "We're waiting for confirmation from your payment provider. Your order has NOT been confirmed yet.");
    addToast('Payment is pending confirmation.', 'warning');
  };

  // ==========================================
  // CASH ON DELIVERY (COD) HANDLER
  // ==========================================
  const handleConfirmCOD = async () => {
    if (!selectedAddress) {
      addToast('Please select a delivery address', 'error');
      setActiveStep(2);
      return;
    }

    // Verify Captcha
    if (!codCaptchaInput.trim()) {
      setCodCaptchaError('Please enter the 3-digit verification code.');
      return;
    }
    if (codCaptchaInput.trim() !== codCaptchaCode) {
      setCodCaptchaError('Incorrect verification code. Please try again.');
      generateCaptcha();
      return;
    }

    if (total > 10000) {
      addToast('Cash on Delivery is only available for orders up to ₹10,000.', 'error');
      return;
    }

    setIsSubmittingCOD(true);
    setCodCaptchaError('');

    try {
      const result = await api.confirmCODOrder({
        items: checkoutItems.map(it => {
          const pId = it.productId ?? it.id ?? it.product_id;
          const vId = it.variantId ?? it.variant_id ?? null;
          return {
            productId: pId,
            id: pId,
            product_id: pId,
            variantId: vId,
            variant_id: vId,
            name: it.name,
            quantity: Math.max(1, Number(it.quantity) || 1)
          };
        }),
        customerDetails: {
          id: user?.id || 'guest',
          fullName: user?.name || selectedAddress.fullName || 'Customer',
          phone: selectedAddress.phone || user?.phone || '',
          email: user?.email || 'customer@shopverse.in'
        },
        shippingAddress: {
          fullName: selectedAddress.fullName || selectedAddress.name || 'Customer',
          phone: selectedAddress.phone || user?.phone || '',
          addressLine1: selectedAddress.addressLine1 || selectedAddress.address || selectedAddress.street || 'Address',
          addressLine2: selectedAddress.addressLine2 || '',
          city: selectedAddress.city || '',
          state: selectedAddress.state || '',
          pincode: selectedAddress.pincode || selectedAddress.zipCode || ''
        },
        deliveryMethod,
        discountAmount: couponDiscount
      });

      if (result.success && result.orderId) {
        if (addOrder) {
          addOrder({
            id: result.orderId,
            date: new Date().toISOString(),
            items: [...checkoutItems],
            shippingAddress: selectedAddress,
            deliveryMethod,
            paymentMethod: 'cod',
            subtotal,
            deliveryCharge,
            total: result.totalAmount || total,
            status: 'CONFIRMED',
            paymentStatus: 'COD'
          });
        }

        if (isBuyNowMode) {
          clearBuyNowItem();
        } else {
          clearCart();
        }

        addToast('Order confirmed with Cash on Delivery!', 'success');
        navigate(`/order-confirmation/${result.orderId}`);
      } else {
        throw new Error(result.error?.message || 'Failed to place COD order.');
      }
    } catch (err) {
      console.error('[COD CONFIRMATION ERROR]', err);
      setIsSubmittingCOD(false);
      const errMsg = err.message || 'Failed to confirm Cash on Delivery order.';
      setCodCaptchaError(errMsg);
      addToast(errMsg, 'error');
      generateCaptcha();
    }
  };

  // ==========================================
  // RENDER: LOADING STATE
  // ==========================================
  if (isLoadingCheckout) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gray-50 text-center animate-in fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-sm w-full">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-1">Loading your order...</h2>
          <p className="text-xs text-gray-500">Validating item pricing and inventory availability</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: ERROR OR EMPTY STATE
  // ==========================================
  if (checkoutError || checkoutItems.length === 0) {
    const errorType = checkoutError?.type || 'EMPTY';
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gray-50 text-center animate-in fade-in">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full flex flex-col items-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            errorType === 'OUT_OF_STOCK' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
            errorType === 'NOT_FOUND' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
            'bg-blue-50 text-blue-600'
          }`}>
            {errorType === 'OUT_OF_STOCK' ? <AlertCircle className="w-8 h-8" /> :
             errorType === 'NOT_FOUND' ? <XCircle className="w-8 h-8" /> :
             <ShoppingBag className="w-8 h-8" />}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {checkoutError?.title || 'Your checkout is empty'}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {checkoutError?.message || 'Please add products to your cart before proceeding to checkout.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {checkoutError?.productId && (
              <Link 
                to={`/product/${checkoutError.productId}`}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back to Product
              </Link>
            )}
            <Link 
              to="/products"
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShoppingBag size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: PAYMENT SUCCESSFUL SCREEN
  // ==========================================
  if (paymentState === 'verified_success' && verifiedPayment) {
    const method = (verifiedPayment.paymentMethod || '').toLowerCase();
    const isUpi = method.includes('upi');
    const isCard = method.includes('card');
    const isNetBanking = method.includes('netbanking') || method.includes('bank');

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gray-50 py-12 animate-in fade-in">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full p-8 text-center">
          <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            {isUpi ? '✓ UPI Payment Successful' : '✓ Payment Successful!'}
          </h1>

          <div className="text-sm text-gray-600 mb-6 space-y-1">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(verifiedPayment.totalAmount)} has been paid successfully.
            </p>
            <p className="text-xs text-gray-500">
              Your payment has been cryptographically authenticated and confirmed with the bank.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left text-xs text-gray-700 mb-8 space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Payment Mode:</span>
              <span className="font-bold text-gray-900 uppercase tracking-wide">
                {isUpi ? 'UPI' : isCard ? 'Credit / Debit Card' : isNetBanking ? 'Net Banking' : 'Online Gateway'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Transaction ID:</span>
              <span className="font-mono text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{verifiedPayment.paymentId}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Total Amount Paid:</span>
              <span className="text-base font-black text-emerald-600">{formatPrice(verifiedPayment.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Verification Status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck size={14} /> Cryptographically Verified
              </span>
            </div>
          </div>

          <button
            onClick={handleContinueToConfirmation}
            disabled={isConfirmingOrder}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-lg py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:bg-emerald-400 disabled:cursor-not-allowed"
          >
            {isConfirmingOrder ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Order Confirmation...</span>
              </>
            ) : (
              <>
                <span>CONTINUE</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: PAYMENT FAILED SCREEN
  // ==========================================
  if (paymentState === 'failed') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gray-50 py-12 animate-in fade-in">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-rose-50 border-2 border-rose-200 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-rose-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">✕ Payment Failed</h2>
          <p className="text-sm text-gray-600 mb-1">We couldn't complete your payment.</p>
          <p className="text-xs text-rose-600 font-semibold mb-6">Your order has NOT been confirmed.</p>
          
          {paymentError && (
            <p className="text-xs bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl mb-6 text-left font-mono">
              {paymentError}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setPaymentError(null);
                setPaymentState('idle');
                handleInitiateOnlinePayment();
              }}
              className="flex-1 py-3.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              TRY AGAIN
            </button>
            <button
              onClick={() => {
                setPaymentError(null);
                setPaymentState('idle');
              }}
              className="flex-1 py-3.5 px-6 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              BACK TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: PAYMENT CANCELLED SCREEN
  // ==========================================
  if (paymentState === 'cancelled') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gray-50 py-12 animate-in fade-in">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-amber-50 border-2 border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-sm text-gray-600 mb-1">The payment window was closed or cancelled.</p>
          <p className="text-xs text-amber-700 font-semibold mb-6">Your order has NOT been confirmed.</p>
          <p className="text-xs text-gray-500 mb-6">Your items and address details are safely preserved.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setPaymentError(null);
                setPaymentState('idle');
                handleInitiateOnlinePayment();
              }}
              className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              RETRY PAYMENT
            </button>
            <button
              onClick={() => {
                setPaymentError(null);
                setPaymentState('idle');
              }}
              className="flex-1 py-3.5 px-6 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              BACK TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PROGRESSIVE ACCORDION CHECKOUT LAYOUT
  // ==========================================
  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6 font-sans">
      {/* Fullscreen Verifying Overlay */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center max-w-sm text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Verifying Payment...</h3>
            <p className="text-xs text-gray-500 mb-3">Authenticating cryptographic signature and committing your order to the database.</p>
            <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              Please do not close or refresh this tab.
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Payment Error Toast Alert */}
        {paymentError && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 animate-in fade-in">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-900">Payment Not Completed — Order Not Confirmed</h4>
              <p className="text-xs text-rose-700 mt-0.5">{paymentError}</p>
            </div>
            <button onClick={() => setPaymentError(null)} className="text-xs text-rose-700 font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ==========================================
              LEFT ACCORDION COLUMN (Steps 1 to 4)
              ========================================== */}
          <div className="flex-1 w-full space-y-4">
            
            {/* STEP 1: LOGIN (Shows user profile & phone, Change button) */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-sm bg-gray-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase">LOGIN</h3>
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (window.confirm('Do you want to log out and switch accounts?')) {
                      logout();
                      navigate('/login');
                    }
                  }}
                  className="text-xs font-bold text-blue-600 uppercase border border-gray-200 px-4 py-1.5 rounded hover:bg-gray-50 transition cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="px-14 py-3 bg-white text-xs text-gray-700 flex flex-wrap items-center gap-2">
                <span className="font-bold text-gray-900">{user?.name || 'Customer'}</span>
                <span className="text-gray-400">|</span>
                <span className="font-medium text-gray-600">{user?.email || user?.phone || '+91 9876543210'}</span>
              </div>
            </div>

            {/* STEP 2: DELIVERY ADDRESS */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
              <div className={`flex items-center justify-between p-4 ${activeStep === 2 ? 'bg-blue-600 text-white' : 'bg-white border-b border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <span className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 2 ? 'bg-white text-blue-600' : 'bg-gray-100 text-blue-600'}`}>
                    2
                  </span>
                  <div className="flex items-center gap-3">
                    <h3 className={`text-sm font-bold tracking-wider uppercase ${activeStep === 2 ? 'text-white' : 'text-gray-500'}`}>
                      DELIVERY ADDRESS
                    </h3>
                    {activeStep > 2 && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                </div>

                {activeStep > 2 && (
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-bold text-blue-600 uppercase border border-gray-200 px-4 py-1.5 rounded hover:bg-gray-50 transition cursor-pointer"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* Collapsed view when step 2 is complete */}
              {activeStep > 2 && selectedAddress && (
                <div className="px-14 py-3 bg-white text-xs text-gray-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{selectedAddress.fullName}</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{selectedAddress.type}</span>
                    <span className="font-medium text-gray-600">{selectedAddress.phone}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-1">
                    {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                </div>
              )}

              {/* Expanded active view for step 2 */}
              {activeStep === 2 && (
                <div className="p-6 bg-white space-y-4">
                  {!showAddressForm ? (
                    <>
                      <div className="space-y-3">
                        {addresses.map(addr => {
                          const isSelected = String(selectedAddressId) === String(addr.id);
                          return (
                            <div 
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`p-4 border rounded-md cursor-pointer transition-all ${
                                isSelected ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-400' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input 
                                  type="radio" 
                                  name="address_select" 
                                  checked={isSelected}
                                  onChange={() => setSelectedAddressId(addr.id)}
                                  className="mt-1 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-gray-900">{addr.fullName}</span>
                                    <span className="text-[10px] uppercase font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                      {addr.type}
                                    </span>
                                    <span className="text-xs font-bold text-gray-900 ml-2">{addr.phone}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                                  </p>
                                  <p className="text-xs font-medium text-gray-700">
                                    {addr.city}, {addr.state} - <span className="font-bold text-gray-900">{addr.pincode}</span>
                                  </p>

                                  {isSelected && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeliverHere();
                                        }}
                                        className="bg-[#fb641b] hover:bg-[#e25712] text-white text-xs font-black uppercase tracking-wider py-3 px-8 rounded shadow-sm transition-colors cursor-pointer"
                                      >
                                        DELIVER HERE
                                      </button>
                                      <span className="text-xs text-gray-500">
                                        Estimated Delivery in 2 - 4 business days
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button 
                        onClick={() => setShowAddressForm(true)}
                        className="w-full py-3 border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-md flex items-center justify-center gap-2 cursor-pointer transition"
                      >
                        <Plus size={16} /> Add a new address
                      </button>
                    </>
                  ) : (
                    <AddressForm 
                      onCancel={() => setShowAddressForm(false)}
                      onSaveSuccess={(newAddress) => {
                        setShowAddressForm(false);
                        setSelectedAddressId(String(newAddress.id));
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* STEP 3: ORDER SUMMARY */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
              <div className={`flex items-center justify-between p-4 ${activeStep === 3 ? 'bg-blue-600 text-white' : 'bg-white border-b border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <span className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 3 ? 'bg-white text-blue-600' : 'bg-gray-100 text-blue-600'}`}>
                    3
                  </span>
                  <div className="flex items-center gap-3">
                    <h3 className={`text-sm font-bold tracking-wider uppercase ${activeStep === 3 ? 'text-white' : 'text-gray-500'}`}>
                      ORDER SUMMARY
                    </h3>
                    {activeStep > 3 && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                </div>

                {activeStep > 3 && (
                  <button 
                    onClick={() => setActiveStep(3)}
                    className="text-xs font-bold text-blue-600 uppercase border border-gray-200 px-4 py-1.5 rounded hover:bg-gray-50 transition cursor-pointer"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* Collapsed view when step 3 is complete */}
              {activeStep > 3 && (
                <div className="px-14 py-3 bg-white text-xs text-gray-700 flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {checkoutItems.length} {checkoutItems.length === 1 ? 'Item' : 'Items'}
                  </span>
                  <span className="text-gray-500">
                    Standard Delivery ({deliveryMethod === 'express' ? 'Express Priority' : 'Free Standard'})
                  </span>
                </div>
              )}

              {/* Expanded active view for step 3 */}
              {activeStep === 3 && (
                <div className="p-6 bg-white space-y-6">
                  {/* Items List */}
                  <div className="divide-y divide-gray-200">
                    {checkoutItems.map((item) => {
                      const mrp = Number(item.originalPrice) > Number(item.price) ? Number(item.originalPrice) : Number(item.price);
                      const discountPct = mrp > item.price ? Math.round(((mrp - item.price) / mrp) * 100) : 0;
                      return (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start gap-4">
                          <div className="w-24 h-24 shrink-0 bg-white border border-gray-100 rounded-md p-2 flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Brand: {item.brand || 'ShopVerse Assured'}</p>
                            
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-base font-black text-gray-900">{formatPrice(item.price)}</span>
                              {mrp > item.price && (
                                <>
                                  <span className="text-xs text-gray-400 line-through">{formatPrice(mrp)}</span>
                                  <span className="text-xs font-bold text-emerald-600">{discountPct}% Off</span>
                                </>
                              )}
                            </div>

                            {/* Quantity buttons & Remove */}
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center border border-gray-300 rounded">
                                <button 
                                  onClick={() => handleItemQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                                <button 
                                  onClick={() => handleItemQuantityChange(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-xs font-bold text-gray-600 hover:text-rose-600 uppercase tracking-wide cursor-pointer"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>

                          {/* Delivery estimate */}
                          <div className="text-right text-xs shrink-0 sm:block hidden">
                            <p className="text-gray-900 font-semibold">Delivery in 2 - 4 Days</p>
                            <p className="text-emerald-600 font-bold">FREE Delivery</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery Speed Selection */}
                  <div className="pt-4 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Delivery Option</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`p-3 border rounded-md flex items-center gap-3 cursor-pointer ${deliveryMethod === 'standard' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="deliverySpeed" 
                          checked={deliveryMethod === 'standard'}
                          onChange={() => setDeliveryMethod('standard')}
                          className="text-blue-600"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">Standard Delivery</span>
                          <span className="text-gray-500">Delivery in 3 - 5 business days ({subtotal >= 499 ? 'FREE' : '₹40'})</span>
                        </div>
                      </label>

                      <label className={`p-3 border rounded-md flex items-center gap-3 cursor-pointer ${deliveryMethod === 'express' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="deliverySpeed" 
                          checked={deliveryMethod === 'express'}
                          onChange={() => setDeliveryMethod('express')}
                          className="text-blue-600"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">Express Priority (₹99)</span>
                          <span className="text-gray-500">Guaranteed 1 - 2 business days delivery</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Promo Code Box */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter Promo Code (e.g. SAVE10 / SHOP500)"
                        className="flex-1 text-xs uppercase px-3 py-2.5 border border-gray-300 rounded outline-none focus:border-blue-500"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase rounded cursor-pointer transition"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <span className="text-xs font-bold text-emerald-600 shrink-0">
                        ✓ {appliedCoupon}
                      </span>
                    )}
                  </div>

                  {/* Confirmation notice & CONTINUE button */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                      Order confirmation email will be sent to <span className="font-bold text-gray-800">{user?.email || 'customer@shopverse.in'}</span>
                    </p>

                    <button 
                      onClick={handleContinueToPayment}
                      className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e25712] active:scale-[0.99] text-white text-sm font-black uppercase tracking-wider py-3.5 px-10 rounded shadow-md transition-all cursor-pointer"
                    >
                      CONTINUE
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 4: PAYMENT OPTIONS */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
              <div className={`flex items-center justify-between p-4 ${activeStep === 4 ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                <div className="flex items-center gap-4">
                  <span className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 4 ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    4
                  </span>
                  <h3 className={`text-sm font-bold tracking-wider uppercase ${activeStep === 4 ? 'text-white' : 'text-gray-400'}`}>
                    PAYMENT OPTIONS
                  </h3>
                </div>
              </div>

              {/* Payment Section when Active */}
              {activeStep === 4 && (
                <div className="p-0 bg-white divide-y divide-gray-200">
                  
                  {/* OPTION 1: UPI */}
                  <div className={`p-5 transition-colors ${selectedPaymentTab === 'upi' ? 'bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment_accordion"
                        checked={selectedPaymentTab === 'upi'}
                        onChange={() => setSelectedPaymentTab('upi')}
                        className="mt-1 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Smartphone size={16} className="text-blue-600" />
                          <span className="font-bold text-sm text-gray-900">UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Pay seamlessly with UPI Apps or dynamic QR code</p>

                        {selectedPaymentTab === 'upi' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM / Any UPI'].map(app => (
                                <button
                                  key={app}
                                  type="button"
                                  onClick={() => setSelectedUpiApp(app)}
                                  className={`py-2 px-3 text-xs font-bold rounded border transition ${
                                    selectedUpiApp === app ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'
                                  }`}
                                >
                                  {app}
                                </button>
                              ))}
                            </div>

                            <div className="p-4 bg-white border border-gray-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider block">Total Payable</span>
                                <span className="text-2xl font-black text-gray-900">{formatPrice(total)}</span>
                                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                                  <ShieldCheck size={14} /> Instant Bank Verification
                                </span>
                              </div>

                              <button
                                onClick={handleInitiateOnlinePayment}
                                disabled={isInitiating || isVerifying}
                                className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e25712] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider py-3.5 px-8 rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 cursor-pointer"
                              >
                                {isInitiating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock size={15} />}
                                <span>PAY {formatPrice(total)}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* OPTION 2: CREDIT / DEBIT / ATM CARD */}
                  <div className={`p-5 transition-colors ${selectedPaymentTab === 'card' ? 'bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment_accordion"
                        checked={selectedPaymentTab === 'card'}
                        onChange={() => setSelectedPaymentTab('card')}
                        className="mt-1 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-blue-600" />
                          <span className="font-bold text-sm text-gray-900">Credit / Debit / ATM Card</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Visa, MasterCard, RuPay, Maestro & American Express</p>

                        {selectedPaymentTab === 'card' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 max-w-lg space-y-3">
                            <div>
                              <label className="text-[11px] font-bold text-gray-700 block mb-1">Card Number</label>
                              <input 
                                type="text" 
                                value={cardData.number}
                                onChange={handleCardNumberChange}
                                placeholder="XXXX XXXX XXXX XXXX"
                                maxLength="19"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono tracking-wider focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">Valid Thru (MM/YY)</label>
                                <input 
                                  type="text" 
                                  value={cardData.expiry}
                                  onChange={handleCardExpiryChange}
                                  placeholder="MM/YY"
                                  maxLength="5"
                                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">CVV</label>
                                <input 
                                  type="password" 
                                  value={cardData.cvv}
                                  onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.substring(0, 4) }))}
                                  placeholder="•••"
                                  maxLength="4"
                                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                                />
                              </div>
                            </div>

                            <div className="pt-2">
                              <button
                                onClick={handleInitiateOnlinePayment}
                                disabled={isInitiating || isVerifying}
                                className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e25712] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider py-3.5 px-8 rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 cursor-pointer"
                              >
                                {isInitiating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock size={15} />}
                                <span>PAY {formatPrice(total)}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* OPTION 3: NET BANKING */}
                  <div className={`p-5 transition-colors ${selectedPaymentTab === 'netbanking' ? 'bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment_accordion"
                        checked={selectedPaymentTab === 'netbanking'}
                        onChange={() => setSelectedPaymentTab('netbanking')}
                        className="mt-1 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-blue-600" />
                          <span className="font-bold text-sm text-gray-900">Net Banking</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">All major Indian public & private sector banks supported</p>

                        {selectedPaymentTab === 'netbanking' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                            <label className="text-[11px] font-bold text-gray-700 block">Popular Banks</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map(bank => (
                                <button
                                  key={bank}
                                  type="button"
                                  onClick={() => setSelectedBank(bank)}
                                  className={`py-2 px-3 text-xs font-semibold rounded border text-left transition ${
                                    selectedBank === bank ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 bg-white text-gray-700'
                                  }`}
                                >
                                  {bank}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={handleInitiateOnlinePayment}
                              disabled={isInitiating || isVerifying}
                              className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e25712] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider py-3.5 px-8 rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 cursor-pointer"
                            >
                              {isInitiating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock size={15} />}
                              <span>PAY {formatPrice(total)}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* OPTION 4: EMI (EASY INSTALLMENTS) */}
                  <div className={`p-5 transition-colors ${selectedPaymentTab === 'emi' ? 'bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment_accordion"
                        checked={selectedPaymentTab === 'emi'}
                        onChange={() => setSelectedPaymentTab('emi')}
                        className="mt-1 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-600" />
                          <span className="font-bold text-sm text-gray-900">EMI (Easy Installments)</span>
                          {total >= 3000 ? (
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Eligible</span>
                          ) : (
                            <span className="text-[10px] bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded">Min ₹3,000</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Flexible monthly payments with credit cards and debit cards</p>

                        {selectedPaymentTab === 'emi' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                            {total >= 3000 ? (
                              <>
                                <div className="space-y-2">
                                  <label className="text-[11px] font-bold text-gray-700 block">Select Tenure</label>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                      { months: 3, rate: 14 },
                                      { months: 6, rate: 14.5 },
                                      { months: 9, rate: 15 },
                                      { months: 12, rate: 15.5 }
                                    ].map(plan => {
                                      const monthly = Math.round((total * (1 + (plan.rate / 100) * (plan.months / 12))) / plan.months);
                                      const isSelected = selectedEmiTenure === plan.months;
                                      return (
                                        <button
                                          key={plan.months}
                                          type="button"
                                          onClick={() => setSelectedEmiTenure(plan.months)}
                                          className={`p-2.5 rounded border text-left transition ${
                                            isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'
                                          }`}
                                        >
                                          <span className="text-xs font-bold block">{plan.months} Months</span>
                                          <span className="text-xs font-black text-gray-900 block mt-0.5">{formatPrice(monthly)}/mo</span>
                                          <span className="text-[10px] text-gray-500">{plan.rate}% p.a.</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                <button
                                  onClick={handleInitiateOnlinePayment}
                                  disabled={isInitiating || isVerifying}
                                  className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e25712] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider py-3.5 px-8 rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 cursor-pointer"
                                >
                                  {isInitiating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock size={15} />}
                                  <span>PAY {formatPrice(total)} VIA EMI</span>
                                </button>
                              </>
                            ) : (
                              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                                EMI is available on orders starting at ₹3,000. Your current order total is {formatPrice(total)}.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* OPTION 5: CASH ON DELIVERY (COD) */}
                  <div className={`p-5 transition-colors ${selectedPaymentTab === 'cod' ? 'bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment_accordion"
                        checked={selectedPaymentTab === 'cod'}
                        onChange={() => setSelectedPaymentTab('cod')}
                        className="mt-1 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-blue-600" />
                          <span className="font-bold text-sm text-gray-900">Cash on Delivery (COD)</span>
                          {total <= 10000 ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Eligible</span>
                          ) : (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">Order &gt; ₹10,000</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Pay with cash or UPI upon delivery at your doorstep</p>

                        {selectedPaymentTab === 'cod' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 max-w-md space-y-4">
                            {total <= 10000 ? (
                              <>
                                <p className="text-xs text-gray-600">
                                  Enter the 3-digit verification characters shown below to confirm your Cash on Delivery order:
                                </p>

                                <div className="flex items-center gap-3">
                                  {/* Captcha Display */}
                                  <div className="bg-gray-900 text-white font-mono font-black text-xl tracking-[0.3em] px-4 py-2 rounded select-none shadow-inner border border-gray-700">
                                    {codCaptchaCode}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={generateCaptcha}
                                    title="Reload Captcha"
                                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                                  >
                                    <RefreshCw size={16} />
                                  </button>

                                  <input 
                                    type="text" 
                                    value={codCaptchaInput}
                                    onChange={(e) => {
                                      setCodCaptchaInput(e.target.value.trim());
                                      setCodCaptchaError('');
                                    }}
                                    placeholder="Enter code"
                                    maxLength="4"
                                    className="w-32 border border-gray-300 rounded px-3 py-2 text-sm font-bold text-center uppercase tracking-widest outline-none focus:border-blue-500"
                                  />
                                </div>

                                {codCaptchaError && (
                                  <p className="text-xs font-bold text-rose-600">{codCaptchaError}</p>
                                )}

                                <button
                                  type="button"
                                  onClick={handleConfirmCOD}
                                  disabled={isSubmittingCOD}
                                  className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e25712] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider py-3.5 px-8 rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 cursor-pointer"
                                >
                                  {isSubmittingCOD ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      <span>CONFIRMING ORDER...</span>
                                    </>
                                  ) : (
                                    <span>CONFIRM ORDER (COD)</span>
                                  )}
                                </button>
                              </>
                            ) : (
                              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
                                Cash on Delivery is not available for orders above ₹10,000. Please select UPI, Card, or Net Banking.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* OPTION 6: PAY LATER & WALLETS */}
                  <div className={`p-5 transition-colors ${selectedPaymentTab === 'paylater' ? 'bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment_accordion"
                        checked={selectedPaymentTab === 'paylater'}
                        onChange={() => setSelectedPaymentTab('paylater')}
                        className="mt-1 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Wallet size={16} className="text-blue-600" />
                          <span className="font-bold text-sm text-gray-900">ShopVerse Pay Later & Wallets</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Pre-approved credit line up to ₹25,000 with 0% interest for 30 days</p>

                        {selectedPaymentTab === 'paylater' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-md text-xs text-blue-900 flex items-center gap-2">
                              <Sparkles size={16} className="text-blue-600 shrink-0" />
                              <span>You have ₹25,000 pre-approved instant credit with 0% interest.</span>
                            </div>

                            <button
                              onClick={handleInitiateOnlinePayment}
                              disabled={isInitiating || isVerifying}
                              className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e25712] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider py-3.5 px-8 rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 cursor-pointer"
                            >
                              {isInitiating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock size={15} />}
                              <span>PAY {formatPrice(total)} WITH PAY LATER</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* ==========================================
              RIGHT COLUMN: STICKY PRICE DETAILS SIDEBAR
              ========================================== */}
          <div className="w-full lg:w-[380px] shrink-0 sticky top-20">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  PRICE DETAILS
                </h3>
              </div>

              <div className="p-4 space-y-4 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Price ({checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium text-gray-900">{formatPrice(totalMrp)}</span>
                </div>

                {productDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">- {formatPrice(productDiscount)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">- {formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? 'text-emerald-600 font-semibold' : 'font-medium text-gray-900'}>
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Secured Packaging Fee</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>

                <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                  <span className="text-base font-black text-gray-900">Total Payable</span>
                  <span className="text-xl font-black text-gray-900">{formatPrice(total)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded text-center flex items-center justify-center gap-1.5">
                      <Tag size={14} /> You will save {formatPrice(totalSavings)} on this order
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
                <ShieldCheck size={28} className="text-gray-400 shrink-0" />
                <p className="leading-tight">
                  Safe and Secure Payments. Easy returns. 100% Authentic products.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Razorpay Interactive Gateway Modal */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        onClose={handlePaymentCancelled}
        onCancel={handlePaymentCancelled}
        amount={pendingOrder?.amount || total}
        orderDetails={pendingOrder}
        initialMethod={selectedPaymentTab}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        onPending={handlePaymentPending}
      />
    </div>
  );
}
