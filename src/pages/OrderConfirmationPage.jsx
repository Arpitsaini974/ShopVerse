import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  CheckCircle, MapPin, ArrowRight, Package, AlertTriangle, 
  ShieldCheck, Loader2, CreditCard, ShoppingBag, Calendar, FileText,
  Lock, RefreshCw, XCircle
} from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { api } from '../api/client';
import useUIStore from '../store/uiStore';
import { RazorpayModal } from '../components/checkout/RazorpayModal';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Payment states for completing payment directly on unconfirmed orders
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'initiating' | 'verifying' | 'verified_success' | 'failed' | 'cancelled'
  const [verifiedPayment, setVerifiedPayment] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const addToast = useUIStore((state) => state.addToast);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = await api.getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      setError(err.message || 'Order could not be loaded');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId, loadOrder]);

  const handlePayNow = () => {
    setPaymentError(null);
    setPaymentState('initiating');
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = async (gatewayResponse) => {
    setIsRazorpayOpen(false);
    setIsVerifying(true);
    setPaymentState('verifying');

    try {
      const verificationResult = await api.verifyPayment({
        orderId: order.id,
        razorpay_order_id: gatewayResponse.razorpay_order_id,
        razorpay_payment_id: gatewayResponse.razorpay_payment_id,
        razorpay_signature: gatewayResponse.razorpay_signature
      });

      if (verificationResult.success && verificationResult.orderStatus === 'CONFIRMED') {
        setIsVerifying(false);
        setVerifiedPayment({
          orderId: order.id,
          totalAmount: order.total_amount,
          paymentId: verificationResult.paymentId || gatewayResponse.razorpay_payment_id,
          paymentMethod: gatewayResponse.paymentMethod || 'upi'
        });
        setPaymentState('verified_success');
        addToast('Payment verified successfully!', 'success');
      } else {
        throw new Error('Payment verification could not be confirmed.');
      }
    } catch (err) {
      setIsVerifying(false);
      setPaymentState('failed');
      const msg = err.message || 'Payment verification failed.';
      setPaymentError(msg);
      addToast(msg, 'error');
    }
  };

  const handleContinue = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    await loadOrder();
    setPaymentState('idle');
    setVerifiedPayment(null);
    setIsConfirming(false);
  };

  const handlePaymentFailure = async (errorReason) => {
    setIsRazorpayOpen(false);
    setPaymentState('failed');
    try {
      await api.reportPaymentFailed(order.id, errorReason);
    } catch (e) {
      console.warn(e);
    }
    setPaymentError(`Payment Declined: ${errorReason || 'Transaction could not be completed'}.`);
    addToast('Payment was not completed. Order remains unconfirmed.', 'error');
  };

  const handlePaymentCancelled = async () => {
    setIsRazorpayOpen(false);
    setPaymentState('cancelled');
    try {
      await api.reportPaymentCancelled(order.id);
    } catch (e) {
      console.warn(e);
    }
    setPaymentError('Payment window was closed or cancelled.');
    addToast('Payment cancelled. Click below to try again.', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Verifying Order Status...</h3>
        <p className="text-xs text-gray-500">Checking verified payment records from database</p>
      </div>
    );
  }

  // Gate 1: Order not found in database
  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">
          {error || `We could not locate any order with ID "${orderId}" in our database.`}
        </p>
        <Link 
          to="/products" 
          className="bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          <ShoppingBag size={16} /> Browse Products
        </Link>
      </div>
    );
  }

  // Gate 2: Mandatory payment check - Order is NOT confirmed or NOT paid!
  const isPaid = order.payment_status === 'PAID';
  const isConfirmed = order.order_status === 'CONFIRMED' || order.order_status === 'PROCESSING' || order.order_status === 'SHIPPED' || order.order_status === 'DELIVERED';

  // Intermediate State: Payment was just completed & verified on this page (before continuing to confirmed view)
  if (paymentState === 'verified_success' && verifiedPayment) {
    const method = (verifiedPayment.paymentMethod || '').toLowerCase();
    const isUpi = method.includes('upi');
    const isCard = method.includes('card');
    const isNetBanking = method.includes('netbanking') || method.includes('bank');
    const isWallet = method.includes('wallet');

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gray-50 py-12 animate-in fade-in">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full p-8 text-center">
          {/* Checkmark icon with emerald ring */}
          <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>

          {/* Dynamic Headline based on Payment Method */}
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            {isUpi ? '✓ UPI Payment Successful' : '✓ Payment Successful!'}
          </h1>

          {/* Dynamic Supporting Text */}
          <div className="text-sm text-gray-600 mb-6 space-y-1">
            {isUpi ? (
              <>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(verifiedPayment.totalAmount)} has been paid successfully.
                </p>
                <p className="text-xs text-gray-500">Your payment has been verified.</p>
              </>
            ) : isCard ? (
              <>
                <p className="text-base text-gray-700">
                  Your card payment of <strong className="text-gray-900 font-bold">{formatPrice(verifiedPayment.totalAmount)}</strong> has been successfully completed.
                </p>
                <p className="text-xs text-gray-500">Your payment has been verified.</p>
              </>
            ) : isNetBanking ? (
              <>
                <p className="text-base text-gray-700">
                  Your Net Banking payment has been successfully completed.
                </p>
                <p className="text-xs text-gray-500">Amount: <strong className="text-gray-900 font-bold">{formatPrice(verifiedPayment.totalAmount)}</strong> • Verified with bank</p>
              </>
            ) : isWallet ? (
              <>
                <p className="text-base text-gray-700">
                  Your wallet payment has been successfully completed.
                </p>
                <p className="text-xs text-gray-500">Amount: <strong className="text-gray-900 font-bold">{formatPrice(verifiedPayment.totalAmount)}</strong> • Verified</p>
              </>
            ) : (
              <>
                <p className="text-base text-gray-700">
                  Your payment of <strong className="text-gray-900 font-bold">{formatPrice(verifiedPayment.totalAmount)}</strong> has been successfully completed.
                </p>
                <p className="text-xs text-gray-500">You can now continue to complete your order.</p>
              </>
            )}
          </div>

          {/* Transaction Summary Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left text-xs text-gray-700 mb-8 space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Payment Mode:</span>
              <span className="font-bold text-gray-900 uppercase tracking-wide">
                {isUpi ? 'UPI' : isCard ? 'Credit / Debit Card' : isNetBanking ? 'Net Banking' : isWallet ? 'Digital Wallet' : 'Payment Gateway'}
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

          {/* Prominent CONTINUE Button */}
          <button
            onClick={handleContinue}
            disabled={isConfirming}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-lg py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:bg-emerald-400 disabled:cursor-not-allowed"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Confirming Your Order...</span>
              </>
            ) : (
              <>
                <span>CONTINUE</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (!isPaid || !isConfirmed) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 max-w-xl mx-auto">
        {/* Fullscreen Verifying Overlay */}
        {isVerifying && (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center max-w-sm text-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Verifying Payment...</h3>
              <p className="text-xs text-gray-500 mb-3">Authenticating cryptographic signature and committing your order to the database.</p>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                Please do not close or refresh this tab.
              </span>
            </div>
          </div>
        )}

        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Required to Confirm Order</h2>
          <p className="text-xs text-gray-500 mb-6 max-w-md mx-auto">
            In compliance with store security policy, orders are confirmed only upon authentic payment gateway verification.
          </p>

          {/* Payment Error / Cancelled Banner */}
          {paymentError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-left animate-in fade-in">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-rose-900">Payment Not Completed</h4>
                <p className="text-xs text-rose-700 mt-0.5">{paymentError}</p>
              </div>
            </div>
          )}

          {/* Order Details Card */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-left text-xs text-gray-700 w-full mb-6 space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="font-semibold text-gray-500">Order Reference:</span>
              <span className="font-mono font-bold text-gray-900">#{order.id}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="font-semibold text-gray-500">Order Status:</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-semibold rounded text-[11px]">{order.order_status}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="font-semibold text-gray-500">Payment Status:</span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-semibold rounded text-[11px]">{order.payment_status}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-semibold text-gray-500">Recipient:</span>
              <span className="font-medium text-gray-900">{order.customer_name}</span>
            </div>
          </div>

          {/* Prominent Actionable Payment Box */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-emerald-100/40 border-2 border-emerald-400 rounded-2xl mb-6 shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Amount Due</span>
            <span className="text-3xl font-black text-gray-900 tracking-tight block mt-1 mb-4">{formatPrice(order.total_amount)}</span>

            <button
              onClick={handlePayNow}
              disabled={isVerifying}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-lg py-4 px-8 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : paymentState === 'failed' ? (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Payment Failed — Try Again</span>
                </>
              ) : paymentState === 'cancelled' ? (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Payment Cancelled — Try Again</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>PAY {formatPrice(order.total_amount)} NOW</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-emerald-800 mt-2.5 flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              Opens encrypted Razorpay payment gateway
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Link 
              to="/cart" 
              className="text-xs text-gray-600 hover:text-gray-900 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Return to Cart
            </Link>
            <Link 
              to="/" 
              className="text-xs text-gray-600 hover:text-gray-900 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Browse Catalog
            </Link>
          </div>
        </div>

        {/* Razorpay Interactive Gateway Modal */}
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={handlePaymentCancelled}
          onCancel={handlePaymentCancelled}
          amount={order.total_amount}
          orderDetails={{ orderId: order.id, paymentOrderId: order.payment_order_id }}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      </div>
    );
  }

  // Calculate delivery date range estimate (e.g., 3-5 business days: "14–17 September")
  const orderDate = new Date(order.created_at || Date.now());
  const startDelivery = new Date(orderDate);
  startDelivery.setDate(startDelivery.getDate() + 3);
  const endDelivery = new Date(orderDate);
  endDelivery.setDate(endDelivery.getDate() + 5);

  const startDay = startDelivery.getDate();
  const endDay = endDelivery.getDate();
  const monthName = endDelivery.toLocaleDateString('en-IN', { month: 'long' });
  const formattedDeliveryRange = `${startDay}–${endDay} ${monthName}`;

  const parsedItems = Array.isArray(order.items) 
    ? order.items 
    : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
          
          {/* Success Animation & Header */}
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20 w-24 h-24 mx-auto" style={{ animationDuration: '3s' }}></div>
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center relative z-10 border border-emerald-200">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} /> Verified Confirmed Order
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">🎉 Order Confirmed!</h1>
          <p className="text-base text-gray-600 mb-8 max-w-lg mx-auto">
            Thank you for your purchase. Your order has been placed and is being prepared for shipment.
          </p>
          
          {/* Order & Payment Summary Cards */}
          <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Order ID</p>
              <p className="font-bold text-gray-900 font-mono text-sm">#{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Total</p>
              <p className="font-bold text-gray-900 text-base text-emerald-600">{formatPrice(order.total_amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Payment ID</p>
              <p className="font-mono text-xs text-gray-700 bg-white px-2 py-1 rounded border border-gray-200 inline-block">
                {order.payment_id || 'pay_verified'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Payment</p>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle size={12} /> ✓ Paid
              </span>
            </div>
            <div className="sm:col-span-2 border-t border-gray-200 pt-4 mt-1 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-0.5">Estimated Delivery</p>
                <p className="font-bold text-indigo-600 flex items-center gap-1.5 text-sm">
                  <Package className="w-4 h-4" /> {formattedDeliveryRange}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-0.5">Order Status</p>
                <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold text-xs rounded-full">
                  {order.order_status}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address Summary */}
          <div className="text-left mb-8 p-4 bg-white border border-gray-200 rounded-xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-500" /> Shipping Address
            </h3>
            <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
            <p className="text-xs text-gray-600 mt-0.5">{order.shipping_address}</p>
            <p className="text-xs text-gray-600">{order.city}, {order.state} - {order.pincode}</p>
            {order.phone && <p className="text-xs text-gray-500 mt-1">Contact: {order.phone}</p>}
          </div>

          {/* Items Ordered */}
          <div className="text-left mb-8">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Items Confirmed ({parsedItems.length})</h3>
            <div className="space-y-2.5">
              {parsedItems.map((item, idx) => (
                <div key={item.id || idx} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-xl shadow-2xs">
                  <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <img src={item.image_url || item.image} alt={item.product_name || item.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{item.product_name || item.name}</p>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-xs text-gray-900">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs: VIEW ORDER and CONTINUE SHOPPING */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link 
              to={`/order-tracking/${order.id}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg uppercase tracking-wide"
            >
              VIEW ORDER <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/products"
              className="bg-white border-2 border-gray-300 text-gray-800 font-bold py-3.5 px-8 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center text-sm uppercase tracking-wide"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
