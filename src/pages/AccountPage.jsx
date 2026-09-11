import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Package, Heart, MapPin, HelpCircle, LogOut, ChevronRight, CheckCircle2, Clock, Truck, X, Loader2, ShieldCheck } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../store/cartStore';
import { formatPrice } from '../utils/helpers';
import { cn } from '../utils/helpers';
import { api } from '../api/client';

const AccountPage = () => {
  const { user, login, logout, orders: localOrders = [], addresses = [] } = useAuthStore();
  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [dbOrders, setDbOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function fetchOrders() {
      try {
        setLoadingOrders(true);
        const data = await api.getMyOrders();
        if (isMounted && Array.isArray(data)) {
          setDbOrders(data);
        }
      } catch (err) {
        console.warn('Failed to load orders from database:', err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    }
    fetchOrders();
    return () => { isMounted = false; };
  }, [activeTab]);

  const demoLogin = () => {
    login({ name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210' });
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ShopVerse</h2>
        <p className="text-gray-500 mb-8">Please log in to view your account details, track orders, and more.</p>
        <button
          onClick={demoLogin}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Login (Demo Account)
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-gray-500">Hello,</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                      activeTab === tab.id
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-error-600 hover:bg-error-50 transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <button className="text-primary-600 font-medium hover:text-primary-700">Edit</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 font-semibold">
                  <ShieldCheck size={14} /> Verified Confirmed Orders
                </span>
              </div>

              {loadingOrders ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Loading your verified orders...</p>
                </div>
              ) : (() => {
                // Merge database orders and local orders (database takes priority)
                const allOrdersMap = new Map();
                for (const o of localOrders) {
                  allOrdersMap.set(o.id, o);
                }
                for (const o of dbOrders) {
                  allOrdersMap.set(o.id, o);
                }
                const ordersList = Array.from(allOrdersMap.values());

                if (ordersList.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-6">Looks like you haven't placed an order yet.</p>
                      <Link to="/products" className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                        Start Shopping
                      </Link>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {ordersList.map((order) => {
                      const orderItems = Array.isArray(order.items) 
                        ? order.items 
                        : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);
                      const orderDate = new Date(order.created_at || order.date || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      });

                      return (
                        <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-2xs">
                          <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                            <div>
                              <p className="text-xs text-gray-400 uppercase font-semibold">Order Placed</p>
                              <p className="font-medium text-xs text-gray-900">{orderDate}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase font-semibold">Total Amount</p>
                              <p className="font-bold text-sm text-gray-900">{formatPrice(order.total_amount || order.total)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase font-semibold">Order ID</p>
                              <p className="font-bold text-xs font-mono text-gray-800">#{order.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 size={12} /> {order.payment_status || 'PAID'}
                              </span>
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                                (order.order_status || order.status) === 'Delivered' ? "bg-emerald-100 text-emerald-800" :
                                (order.order_status || order.status) === 'CONFIRMED' ? "bg-blue-100 text-blue-800" :
                                "bg-indigo-100 text-indigo-800"
                              )}>
                                {order.order_status || order.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-6 divide-y divide-gray-50">
                            {orderItems.map((item, index) => (
                              <div key={index} className="flex items-center py-3 first:pt-0 last:pb-0">
                                <div className="w-14 h-14 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-100 overflow-hidden shrink-0">
                                  <img 
                                    src={item.image_url || item.image} 
                                    alt={item.product_name || item.name} 
                                    className="max-h-full max-w-full object-contain mix-blend-multiply" 
                                  />
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-gray-900 truncate">{item.product_name || item.name}</h4>
                                  <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                </div>
                                <div className="ml-4 flex gap-2">
                                  <Link 
                                    to={`/order-confirmation/${order.id}`}
                                    className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                  >
                                    View Receipt
                                  </Link>
                                  <Link 
                                    to={`/order-tracking/${order.id}`}
                                    className="text-gray-700 hover:text-gray-900 text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    Track
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                {wishlistItems.length > 0 && (
                  <Link to="/wishlist" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center">
                    View Full Page <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                )}
              </div>
              
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {wishlistItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="border border-gray-100 rounded-lg p-4 flex flex-col h-full relative group">
                      <button 
                        onClick={() => removeWishlistItem(item.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-gray-500 hover:text-error-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img src={item.image} alt={item.name} className="w-full h-40 object-contain mb-4" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                        <p className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                      </div>
                      <button 
                        onClick={() => {
                          addToCart(item);
                          removeWishlistItem(item.id);
                        }}
                        className="mt-4 w-full py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                  + Add New Address
                </button>
              </div>
              
              {addresses.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No saved addresses yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div key={address.id} className={cn(
                      "border rounded-xl p-5 relative",
                      address.isDefault ? "border-primary-600 bg-primary-50/10" : "border-gray-200"
                    )}>
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 text-xs font-medium bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-1">{address.name}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-3">{address.type}</span>
                      <p className="text-sm text-gray-600 mb-1">{address.street}</p>
                      <p className="text-sm text-gray-600 mb-1">{address.city}, {address.state} {address.zipCode}</p>
                      <p className="text-sm text-gray-600 mb-4">Phone: {address.phone}</p>
                      
                      <div className="flex items-center space-x-4 border-t border-gray-100 pt-4 mt-auto">
                        <button className="text-sm text-primary-600 font-medium hover:text-primary-700">Edit</button>
                        <button className="text-sm text-error-600 font-medium hover:text-error-700">Delete</button>
                        {!address.isDefault && (
                          <button className="text-sm text-gray-500 font-medium hover:text-gray-900 ml-auto">
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-start space-x-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                    <p className="text-sm text-gray-500 mt-1">Call us at 1-800-123-4567</p>
                    <p className="text-sm text-gray-500">support@shopverse.com</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-start space-x-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Truck className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Shipping Queries</h3>
                    <p className="text-sm text-gray-500 mt-1">Track your orders online</p>
                    <Link to="/account" className="text-sm text-primary-600 font-medium mt-1 inline-block">Go to My Orders</Link>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {[
                  { q: 'How do I return an item?', a: 'You can initiate a return from the "My Orders" section within 30 days of delivery.' },
                  { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive the returned item.' },
                  { q: 'Do you ship internationally?', a: 'Currently, we only ship within India. International shipping will be available soon.' },
                  { q: 'Can I change my delivery address?', a: 'Yes, you can change it before the order is dispatched. Contact support immediately.' },
                  { q: 'What payment methods do you accept?', a: 'We accept Credit/Debit cards, UPI, Net Banking, and Cash on Delivery.' }
                ].map((faq, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{faq.q}</h4>
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AccountPage;
