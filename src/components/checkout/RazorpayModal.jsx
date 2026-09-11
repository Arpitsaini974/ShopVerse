import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, X, CheckCircle, AlertCircle, Loader2, CreditCard, 
  Smartphone, Building2, Wallet, Lock, QrCode, Clock
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatPrice } from '../../utils/helpers';

export const RazorpayModal = ({
  isOpen,
  onClose,
  amount,
  orderDetails,
  initialMethod = 'upi',
  onSuccess,
  onFailure,
  onPending,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('upi');
  const [upiMode, setUpiMode] = useState('qr'); // 'qr' (desktop) | 'intent' (mobile)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Processing Payment...');
  const [status, setStatus] = useState(null); // 'success' | 'failure' | 'pending' | null
  const [errorMessage, setErrorMessage] = useState('');

  // Detection for mobile vs desktop
  const isMobileDevice = typeof window !== 'undefined' && 
    (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

  // Form states
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardName, setCardName] = useState('Rahul Sharma');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('PhonePe Wallet');

  useEffect(() => {
    if (initialMethod) {
      const m = initialMethod.toLowerCase();
      if (m.includes('upi')) setActiveTab('upi');
      else if (m.includes('card')) setActiveTab('card');
      else if (m.includes('netbanking') || m.includes('bank')) setActiveTab('netbanking');
      else if (m.includes('wallet')) setActiveTab('wallet');
      else setActiveTab('upi');
    }
    setUpiMode(isMobileDevice ? 'intent' : 'qr');
  }, [initialMethod, isOpen, isMobileDevice]);

  // Generate authentic dynamic UPI QR code from order transaction details
  useEffect(() => {
    if (!isOpen) return;

    const paymentOrderId = orderDetails?.paymentOrderId || 'order_sv_' + Date.now();
    const orderId = orderDetails?.orderId || 'ORD-PENDING';
    const upiUri = `upi://pay?pa=shopverse.razorpay@icici&pn=ShopVerse%20Marketplace&tr=${encodeURIComponent(paymentOrderId)}&am=${amount}&cu=INR&tn=ShopVerse%20Order%20${encodeURIComponent(orderId)}`;

    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0c2340',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('Failed to generate UPI QR code:', err));
  }, [isOpen, orderDetails, amount]);

  if (!isOpen) return null;

  const handleSimulatePayment = (outcome = 'success') => {
    setIsProcessing(true);
    setStatus(null);
    setErrorMessage('');

    if (activeTab === 'upi') {
      if (upiMode === 'qr') {
        setProcessingMessage('Awaiting scan confirmation from your UPI app...');
      } else {
        setProcessingMessage(`Launching ${selectedUpiApp} & requesting authorization...`);
        if (isMobileDevice) {
          const paymentOrderId = orderDetails?.paymentOrderId || 'order_sv_test';
          const upiUri = `upi://pay?pa=shopverse.razorpay@icici&pn=ShopVerse&tr=${encodeURIComponent(paymentOrderId)}&am=${amount}&cu=INR`;
          try {
            window.location.href = upiUri;
          } catch (_) {}
        }
      }
    } else if (activeTab === 'card') {
      setProcessingMessage('Encrypting card details & verifying 3D Secure OTP...');
    } else if (activeTab === 'netbanking') {
      setProcessingMessage(`Connecting to ${selectedBank} secure gateway...`);
    } else if (activeTab === 'wallet') {
      setProcessingMessage(`Authenticating with ${selectedWallet}...`);
    } else {
      setProcessingMessage('Processing Payment...');
    }

    setTimeout(() => {
      setIsProcessing(false);
      if (outcome === 'success') {
        setStatus('success');
        const paymentId = `pay_${activeTab}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const orderId = orderDetails?.paymentOrderId || `order_sv_${Date.now()}`;
        
        setTimeout(() => {
          onSuccess({
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            razorpay_signature: 'simulated_signature_verified',
            paymentMethod: activeTab,
            methodLabel: activeTab === 'upi' ? (upiMode === 'qr' ? 'UPI QR' : selectedUpiApp) : activeTab === 'card' ? 'Credit / Debit Card' : activeTab === 'netbanking' ? 'Net Banking' : 'Wallet',
            metadata: {
              upiMode: activeTab === 'upi' ? upiMode : undefined,
              upiApp: activeTab === 'upi' ? (upiMode === 'intent' ? selectedUpiApp : 'UPI QR') : undefined,
              cardLast4: activeTab === 'card' ? '1111' : undefined,
              bankName: activeTab === 'netbanking' ? selectedBank : undefined,
              walletName: activeTab === 'wallet' ? selectedWallet : undefined
            }
          });
        }, 600);
      } else if (outcome === 'pending') {
        setStatus('pending');
        setErrorMessage("We're waiting for confirmation from your payment provider. Your order has NOT been confirmed yet.");
        if (onPending) {
          onPending("We're waiting for confirmation from your payment provider. Your order has NOT been confirmed yet.");
        }
      } else {
        const error = `Payment declined by issuing bank (Test mode: failure@razorpay)`;
        setStatus('failure');
        setErrorMessage(error);
        if (onFailure) {
          onFailure(error);
        }
      }
    }, 1200);
  };

  const handleClose = () => {
    if (isProcessing) return;
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Gateway Brand Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#3395ff] flex items-center justify-center font-bold text-white text-lg shadow-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wide">Razorpay</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded font-medium border border-blue-400/20">
                  SECURE CHECKOUT
                </span>
              </div>
              <p className="text-xs text-blue-200">ShopVerse Marketplace</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            disabled={isProcessing}
            title="Cancel payment"
            className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Amount & Order details bar */}
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 font-medium block">Total Payable</span>
            <span className="text-xs text-gray-600 font-mono">Ref: {orderDetails?.orderId || 'PENDING'}</span>
          </div>
          <span className="text-xl font-black text-gray-900">{formatPrice(amount)}</span>
        </div>

        {/* Body content */}
        <div className="p-5 flex-1 min-h-[320px] flex flex-col justify-between">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-12 h-12 text-[#3395ff] animate-spin" />
              <div className="text-center">
                <h4 className="font-bold text-gray-900 text-sm">Processing Payment...</h4>
                <p className="text-xs text-gray-500 mt-1">{processingMessage}</p>
                <p className="text-[11px] text-amber-700 mt-2 bg-amber-50 px-2 py-0.5 rounded inline-block border border-amber-200">
                  Please do not refresh or close this window.
                </p>
              </div>
            </div>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <CheckCircle className="w-14 h-14 text-emerald-500 animate-bounce" />
              <h4 className="font-bold text-gray-900 text-base">Payment Authorized!</h4>
              <p className="text-xs text-gray-500 text-center">Transferring to backend cryptographic verification...</p>
            </div>
          ) : status === 'failure' ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-3 text-center">
              <AlertCircle className="w-14 h-14 text-rose-500" />
              <h4 className="font-bold text-gray-900 text-base">Payment Declined</h4>
              <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100 max-w-xs">
                {errorMessage}
              </p>
              <p className="text-xs text-gray-500 mt-1">No money was deducted. Your cart items are still saved.</p>
              <div className="flex gap-2 pt-4 w-full">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2 px-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Back to Checkout
                </button>
                <button
                  onClick={() => handleSimulatePayment('success')}
                  className="flex-1 py-2 px-3 bg-[#3395ff] text-white rounded-lg text-xs font-semibold hover:bg-blue-600 shadow-sm cursor-pointer"
                >
                  Retry Payment
                </button>
              </div>
            </div>
          ) : status === 'pending' ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-3 text-center">
              <Clock className="w-14 h-14 text-amber-500" />
              <h4 className="font-bold text-gray-900 text-base">Payment Pending</h4>
              <p className="text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 max-w-xs">
                {errorMessage}
              </p>
              <div className="flex gap-2 pt-4 w-full">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2 px-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Back to Checkout
                </button>
                <button
                  onClick={() => handleSimulatePayment('success')}
                  className="flex-1 py-2 px-3 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 shadow-sm cursor-pointer"
                >
                  Check Payment Status
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment Tabs: UPI | Cards | Net Banking | Wallets */}
              <div className="grid grid-cols-4 gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
                <button
                  onClick={() => setActiveTab('upi')}
                  className={`py-1.5 text-[11px] font-bold rounded-md flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors ${activeTab === 'upi' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Smartphone size={13} /> UPI
                </button>
                <button
                  onClick={() => setActiveTab('card')}
                  className={`py-1.5 text-[11px] font-bold rounded-md flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors ${activeTab === 'card' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <CreditCard size={13} /> Cards
                </button>
                <button
                  onClick={() => setActiveTab('netbanking')}
                  className={`py-1.5 text-[11px] font-bold rounded-md flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors ${activeTab === 'netbanking' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Building2 size={13} /> Banking
                </button>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className={`py-1.5 text-[11px] font-bold rounded-md flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors ${activeTab === 'wallet' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Wallet size={13} /> Wallets
                </button>
              </div>

              {/* 1. UPI TAB: SUPPORTED FLOWS (UPI QR & UPI INTENT — NO DEPRECATED VPA ENTRY) */}
              {activeTab === 'upi' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  {/* Mode switcher: QR Code vs UPI Intent App */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs font-bold text-gray-800">Pay using UPI</span>
                    <div className="flex gap-1 text-[11px] bg-gray-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setUpiMode('qr')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          upiMode === 'qr' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <QrCode size={12} /> Scan QR
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('intent')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          upiMode === 'intent' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <Smartphone size={12} /> UPI Apps
                      </button>
                    </div>
                  </div>

                  {/* Flow A: UPI QR Code (Desktop Preferred / Camera Scan) */}
                  {upiMode === 'qr' && (
                    <div className="flex flex-col items-center text-center space-y-2 py-1">
                      <p className="text-[11px] text-gray-500 max-w-xs">
                        Scan this QR code with any supported UPI app (Google Pay, PhonePe, Paytm, BHIM, CRED).
                      </p>

                      {/* Authentic Dynamic QR Code Canvas/Image */}
                      <div className="p-2.5 bg-white border-2 border-gray-200 rounded-2xl shadow-sm relative group">
                        {qrCodeDataUrl ? (
                          <img 
                            src={qrCodeDataUrl} 
                            alt="Scan UPI QR Code" 
                            className="w-44 h-44 object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-44 h-44 bg-gray-50 rounded-lg flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-3 text-center">
                          <span className="text-[10px] font-bold bg-[#0c2340] text-white px-2 py-0.5 rounded-full shadow-xs">
                            {formatPrice(amount)}
                          </span>
                        </div>
                      </div>

                      {/* Live Transaction Status Indicator */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 pt-1">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span>Waiting for payment...</span>
                      </div>

                      {/* Test Mode Simulation Triggers */}
                      <div className="w-full pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSimulatePayment('success')}
                          className="flex-1 py-2.5 px-3 bg-[#3395ff] hover:bg-blue-600 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle size={14} />
                          Simulate Payment (success@razorpay)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Flow B: UPI Intent (Mobile App Selection) */}
                  {upiMode === 'intent' && (
                    <div className="space-y-3 py-1">
                      <p className="text-[11px] text-gray-500">
                        Choose your preferred UPI app to authorize payment:
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Google Pay', icon: 'GPay', color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/40 text-emerald-800' },
                          { name: 'PhonePe', icon: 'PhonePe', color: 'border-purple-200 hover:border-purple-400 bg-purple-50/40 text-purple-800' },
                          { name: 'Paytm', icon: 'Paytm', color: 'border-sky-200 hover:border-sky-400 bg-sky-50/40 text-sky-800' },
                          { name: 'Other UPI App', icon: 'UPI', color: 'border-gray-200 hover:border-blue-400 bg-gray-50 text-gray-800' }
                        ].map((app) => (
                          <button
                            type="button"
                            key={app.name}
                            onClick={() => setSelectedUpiApp(app.name)}
                            className={`p-3 border-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                              selectedUpiApp === app.name 
                                ? 'border-blue-600 bg-blue-50/80 shadow-xs' 
                                : app.color
                            }`}
                          >
                            <span className="text-xs font-bold">{app.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-gray-200 font-bold">
                              {app.icon}
                            </span>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleSimulatePayment('success')}
                        className="w-full py-3 px-4 bg-[#3395ff] hover:bg-blue-600 active:scale-[0.99] text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
                      >
                        <Lock size={15} />
                        PAY {formatPrice(amount)} VIA {selectedUpiApp.toUpperCase()}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 2. CARD TAB */}
              {activeTab === 'card' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white font-mono text-gray-800 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">Expiry (MM / YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white font-mono text-gray-800 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white font-mono text-gray-800 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Full Name as on Card"
                      className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleSimulatePayment('success')}
                    className="w-full py-3 px-4 bg-[#3395ff] hover:bg-blue-600 active:scale-[0.99] text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Lock size={15} />
                    PAY {formatPrice(amount)}
                  </button>
                </div>
              )}

              {/* 3. NET BANKING TAB */}
              {activeTab === 'netbanking' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <p className="text-xs font-semibold text-gray-700">Select Your Bank</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                      <button
                        type="button"
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 border rounded-lg text-left text-xs font-medium transition-colors cursor-pointer ${
                          selectedBank === bank ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' : 'border-gray-200 text-gray-700 bg-white hover:border-blue-300'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-500">Selected: <strong>{selectedBank}</strong></p>

                  <button
                    onClick={() => handleSimulatePayment('success')}
                    className="w-full py-3 px-4 bg-[#3395ff] hover:bg-blue-600 active:scale-[0.99] text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Lock size={15} />
                    PAY {formatPrice(amount)}
                  </button>
                </div>
              )}

              {/* 4. WALLETS TAB */}
              {activeTab === 'wallet' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Wallet Payment</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Continue with your selected wallet.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['PhonePe Wallet', 'Paytm Wallet', 'Amazon Pay', 'Mobikwik'].map((wallet) => (
                      <button
                        type="button"
                        key={wallet}
                        onClick={() => setSelectedWallet(wallet)}
                        className={`p-2.5 border rounded-lg text-left text-xs font-medium transition-colors cursor-pointer ${
                          selectedWallet === wallet ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' : 'border-gray-200 text-gray-700 bg-white hover:border-blue-300'
                        }`}
                      >
                        {wallet}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-500">Selected: <strong>{selectedWallet}</strong></p>

                  <button
                    onClick={() => handleSimulatePayment('success')}
                    className="w-full py-3 px-4 bg-[#3395ff] hover:bg-blue-600 active:scale-[0.99] text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Lock size={15} />
                    PAY {formatPrice(amount)}
                  </button>
                </div>
              )}

              {/* Test Mode Controls (Decline / Pending / Abort) */}
              <div className="pt-2 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulatePayment('failure')}
                  className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-semibold transition-colors text-center cursor-pointer"
                >
                  Simulate Fail
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatePayment('pending')}
                  className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-semibold transition-colors text-center cursor-pointer"
                >
                  Simulate Pending
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-medium transition-colors text-center cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-500" />
            256-bit SSL Encrypted
          </span>
          <span>PCI-DSS Level 1 Compliant</span>
        </div>
      </div>
    </div>
  );
};
