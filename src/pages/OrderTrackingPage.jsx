import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PackageCheck, Package, Truck, Home, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { formatPrice } from '../utils/helpers';
import { api } from '../api/client';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const localOrders = useAuthStore((state) => state.orders || []);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadOrder() {
      // Check local store first
      const found = localOrders.find(o => o.id === orderId);
      if (found) {
        setOrder(found);
        setLoading(false);
        return;
      }

      // Fetch from database API
      try {
        const dbOrder = await api.getOrderById(orderId);
        if (isMounted && dbOrder) {
          const parsedItems = Array.isArray(dbOrder.items) 
            ? dbOrder.items 
            : (typeof dbOrder.items === 'string' ? JSON.parse(dbOrder.items || '[]') : []);

          setOrder({
            id: dbOrder.id,
            date: dbOrder.created_at,
            total: dbOrder.total_amount,
            status: dbOrder.order_status,
            paymentStatus: dbOrder.payment_status,
            shippingAddress: {
              fullName: dbOrder.customer_name,
              addressLine1: dbOrder.shipping_address,
              city: dbOrder.city,
              state: dbOrder.state,
              pincode: dbOrder.pincode,
              phone: dbOrder.phone
            },
            items: parsedItems.map(it => ({
              id: it.id || it.product_id,
              name: it.product_name || it.name,
              price: it.price,
              quantity: it.quantity,
              image: it.image_url || it.image
            }))
          });
        }
      } catch (err) {
        console.warn('Could not fetch tracking order:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
    return () => { isMounted = false; };
  }, [orderId, localOrders]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm text-gray-500">Retrieving tracking details from database...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the order you're looking for in our system.</p>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700">
          Go to Homepage
        </Link>
      </div>
    );
  }

  // Map order status to timeline steps
  const getStepStatus = (stepIndex) => {
    const statuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentStatus = (order.status || 'CONFIRMED').toUpperCase();
    const currentStatusIndex = statuses.indexOf(currentStatus) !== -1 ? statuses.indexOf(currentStatus) : 0;
    
    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'current';
    return 'future';
  };

  const orderDate = new Date(order.date || Date.now());
  const formattedDate = orderDate.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const timeline = [
    { title: 'Payment Verified & Order Confirmed', desc: 'Cryptographic payment confirmed by gateway', icon: PackageCheck, time: formattedDate },
    { title: 'Processing & Packed', desc: 'Your item is being inspected and packed', icon: Package, time: 'In Progress' },
    { title: 'Dispatched / Shipped', desc: 'Handed over to delivery courier partner', icon: Truck, time: 'Pending' },
    { title: 'Out for Delivery', desc: 'Courier agent is on the way to your address', icon: Truck, time: 'Pending' },
    { title: 'Delivered', desc: 'Package delivered to recipient', icon: Home, time: 'Pending' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>&gt;</span>
          <Link to="/account?tab=orders" className="hover:text-indigo-600">My Orders</Link>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Track Order</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900">Order ID: #{order.id}</h1>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                  {order.paymentStatus || 'PAID'}
                </span>
              </div>
              <p className="text-xs text-gray-500">Placed on {new Date(order.date || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">{formatPrice(order.total)}</p>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-base font-bold text-gray-900 mb-8">Tracking Timeline</h2>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-8 relative">
                {timeline.map((step, index) => {
                  const status = getStepStatus(index);
                  const StepIcon = step.icon;
                  
                  return (
                    <div key={index} className="flex gap-6">
                      <div className="relative z-10 flex-shrink-0">
                        {status === 'completed' && (
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-emerald-600">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                        )}
                        {status === 'current' && (
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-indigo-600 relative">
                            <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
                            <StepIcon className="w-6 h-6" />
                          </div>
                        )}
                        {status === 'future' && (
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-gray-400">
                            <StepIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className={`pt-2 flex-1 ${status === 'future' ? 'opacity-50' : ''}`}>
                        <h3 className={`text-sm font-bold ${status === 'current' ? 'text-indigo-600' : 'text-gray-900'}`}>{step.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{step.desc}</p>
                        <p className="text-[11px] text-gray-400 mt-1 font-medium">{status === 'completed' || status === 'current' ? step.time : ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">Delivery Address</h3>
            <p className="font-bold text-sm text-gray-900">{order.shippingAddress?.fullName}</p>
            <p className="text-xs text-gray-600 mt-1">{order.shippingAddress?.addressLine1}</p>
            {order.shippingAddress?.addressLine2 && <p className="text-xs text-gray-600">{order.shippingAddress.addressLine2}</p>}
            <p className="text-xs text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            {order.shippingAddress?.phone && <p className="text-xs text-gray-500 mt-2">Phone: {order.shippingAddress.phone}</p>}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">Items Ordered ({order.items?.length || 0})</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {(order.items || []).map((item, idx) => (
                <div key={item.id || idx} className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg shrink-0 p-1 border border-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
