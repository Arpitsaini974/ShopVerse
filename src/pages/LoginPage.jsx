import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, Mail, Phone, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { user, isLoggedIn, login } = useAuthStore();
  const addToast = useUIStore((state) => state.addToast);

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loginEmail, setLoginEmail] = useState('rahul@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(redirect, { replace: true });
    }
  }, [isLoggedIn, user, redirect, navigate]);

  const isCheckoutRedirect = redirect.includes('/checkout');

  const handleDemoLogin = () => {
    login({
      id: 'usr_' + Date.now(),
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '9876543210'
    });
    addToast('Logged in successfully as Rahul Sharma', 'success');
    navigate(redirect, { replace: true });
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      addToast('Please enter your email or mobile number', 'error');
      return;
    }
    const name = loginEmail.includes('@') ? loginEmail.split('@')[0] : 'Valued Customer';
    login({
      id: 'usr_' + Date.now(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: loginEmail,
      phone: '9876543210'
    });
    addToast('Welcome to ShopVerse!', 'success');
    navigate(redirect, { replace: true });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }
    if (!regEmail.trim() && !regPhone.trim()) {
      addToast('Please enter an email or phone number', 'error');
      return;
    }
    login({
      id: 'usr_' + Date.now(),
      name: regName.trim(),
      email: regEmail.trim() || 'customer@shopverse.in',
      phone: regPhone.trim() || '9876543210'
    });
    addToast(`Account created! Welcome, ${regName.trim()}`, 'success');
    navigate(redirect, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Banner if redirected from checkout */}
        {isCheckoutRedirect && (
          <div className="bg-indigo-50 border-b border-indigo-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-900">Please login to continue with your purchase.</h4>
              <p className="text-[11px] text-indigo-700 mt-0.5">Your item and cart selections are safely preserved.</p>
            </div>
          </div>
        )}

        {/* Brand Header */}
        <div className="p-6 text-center border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 text-primary-600 rounded-xl mb-3">
            <Lock size={22} />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900">
            {activeTab === 'login' ? 'Sign In to ShopVerse' : 'Create an Account'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Access your orders, saved addresses, and secure checkout
          </p>

          {/* Tab Switcher */}
          <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50 mt-5">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'login' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'register' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              New Customer? Register
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {activeTab === 'login' ? (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email or Mobile Number</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                Sign In & Continue <ArrowRight size={14} />
              </button>

              {/* 1-Click Demo Login */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[11px] text-gray-400 text-center mb-2.5">Or sign in with 1 click for instant testing</p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Sign In as Rahul Sharma (1-Click Demo)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Priya Patel"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength="10"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                Create Account & Proceed <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* Security guarantee */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>256-Bit SSL Encrypted & Private</span>
          </div>
        </div>

      </div>
    </div>
  );
}
