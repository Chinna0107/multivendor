import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Truck, CheckCircle, MapPin, CreditCard, ChevronLeft, UserCircle2 } from 'lucide-react';
import { Header } from '../components/Header';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotal, clearCart } = useCartStore();
  const { token, user } = useAuthStore();
  
  const [step, setStep] = useState(token ? 2 : 1); // 1: Auth, 2: Address, 3: Payment
  const [address, setAddress] = useState({
    name: user?.name || 'Guest User',
    line1: '123 Main Street',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    mobile: user?.phone || '9876543210'
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const overlayRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);

  const grandTotal = getTotal();
  const couponCode = location.state?.couponCode || '';

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !isPlacingOrder) {
      navigate('/cart');
    }
  }, [items, navigate, isPlacingOrder]);

  // If user logs in mid-way
  useEffect(() => {
    if (token && step === 1) {
      setStep(2);
      if (user) {
        setAddress(prev => ({ ...prev, name: user.name, mobile: user.phone }));
      }
    }
  }, [token, step, user]);

  useGSAP(() => {
    if (isPlacingOrder) {
      const tl = gsap.timeline();
      
      tl.from(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' })
        .from(iconRef.current, { scale: 0, rotation: -180, duration: 0.6, ease: 'back.out(1.7)' })
        .from(textRef.current, { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' }, "-=0.2")
        .to(iconRef.current, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut', delay: 0.2 });
    }
  }, { dependencies: [isPlacingOrder] });

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsPlacingOrder(false);
        return;
      }

      // Create Razorpay Order
      const orderRes = await fetch(`${BACKEND_URL}/general/razorpay/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal })
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        alert("Failed to initialize payment");
        setIsPlacingOrder(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Tradition Store",
        description: "Order Payment",
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await fetch(`${BACKEND_URL}/general/razorpay/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Proceed to actual order creation
              const payload = {
                items,
                address,
                total: grandTotal,
                coupon_code: couponCode
              };

              const endpoint = token ? `${BACKEND_URL}/auth/orders` : `${BACKEND_URL}/general/orders`;
              const headers = { "Content-Type": "application/json" };
              if (token) {
                headers["Authorization"] = `Bearer ${token}`;
              }

              const createOrderRes = await fetch(endpoint, {
                method: "POST",
                headers,
                body: JSON.stringify(payload)
              });
              const createOrderData = await createOrderRes.json();
              
              if (createOrderData.success) {
                setTimeout(() => {
                  clearCart();
                  navigate(`/order-tracking/${createOrderData.order.order_number}`);
                }, 2000);
              } else {
                alert("Failed to place order after payment.");
                setIsPlacingOrder(false);
              }
            } else {
              alert("Payment verification failed");
              setIsPlacingOrder(false);
            }
          } catch(err) {
            console.error(err);
            setIsPlacingOrder(false);
          }
        },
        prefill: {
          name: address.name,
          contact: address.mobile
        },
        theme: {
          color: "#C16E4F"
        },
        modal: {
          ondismiss: function() {
            setIsPlacingOrder(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (err) {
      console.error(err);
      setIsPlacingOrder(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-6 px-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/cart')}>
        <div className="w-6 h-6 rounded-full bg-[#C16E4F] text-white flex items-center justify-center text-xs font-bold">✓</div>
        <span className="text-[10px] text-[#C16E4F] font-bold mt-1">Cart</span>
      </div>
      <div className={`h-px flex-1 mx-2 ${step >= 2 ? 'bg-[#C16E4F]' : 'bg-gray-300'}`}></div>
      
      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#C16E4F] text-white' : 'bg-gray-300 text-white'}`}>
          {step > 2 ? '✓' : (token ? '✓' : '1')}
        </div>
        <span className={`text-[10px] font-bold mt-1 ${step >= 2 ? 'text-[#C16E4F]' : 'text-gray-500'}`}>{token ? 'Auth' : 'Login'}</span>
      </div>
      <div className={`h-px flex-1 mx-2 ${step >= 2 ? 'bg-[#C16E4F]' : 'bg-gray-300'}`}></div>

      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#C16E4F] text-white' : 'bg-gray-300 text-white'}`}>
          {step > 2 ? '✓' : '2'}
        </div>
        <span className={`text-[10px] font-bold mt-1 ${step >= 2 ? 'text-[#C16E4F]' : 'text-gray-500'}`}>Address</span>
      </div>
      <div className={`h-px flex-1 mx-2 ${step >= 3 ? 'bg-[#C16E4F]' : 'bg-gray-300'}`}></div>
      <div className={`flex flex-col items-center ${step < 3 ? 'opacity-50' : ''}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-[#C16E4F] text-white' : 'bg-gray-300 text-white'}`}>3</div>
        <span className={`text-[10px] font-bold mt-1 ${step >= 3 ? 'text-[#C16E4F]' : 'text-gray-500'}`}>Payment</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-36 font-sans">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-4 h-16 flex items-center justify-center relative shadow-sm">
        <button onClick={() => step === 3 ? setStep(2) : navigate('/cart')} className="absolute left-4 p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-serif text-xl font-bold text-gray-900 tracking-wide">Checkout</h1>
      </div>
      
      <div className="p-4 md:p-8 space-y-4 md:space-y-8 md:max-w-7xl mx-auto">
        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-6">
            {step === 1 && (
              <div className="space-y-4 max-w-3xl mx-auto">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    <UserCircle2 className="w-4 h-4 text-brand-orange" />
                  </div>
                  Authentication
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Login Option */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-orange/20 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Login / Sign Up</h3>
                      <p className="text-sm text-gray-500 mb-6">Access your saved addresses, track orders easily, and get exclusive offers.</p>
                    </div>
                    <button 
                      onClick={() => navigate('/login?redirect=/checkout')}
                      className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl hover:bg-brand-maroon transition-colors"
                    >
                      Login to Continue
                    </button>
                  </div>
                  
                  {/* Guest Checkout Option */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Guest Checkout</h3>
                      <p className="text-sm text-gray-500 mb-6">Proceed without an account. You can track your order using the order ID.</p>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      className="w-full bg-gray-50 text-gray-900 border border-gray-200 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      Checkout as Guest
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-brand-orange" />
              </div>
              Delivery Address
            </h2>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-orange/5 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Full Name</label>
                  <input value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="w-full text-lg font-bold text-gray-900 border-b-2 border-gray-100 py-1 focus:outline-none focus:border-brand-orange transition-colors bg-transparent" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Address Line 1</label>
                  <input value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} className="w-full text-base text-gray-700 border-b border-gray-200 py-1 focus:outline-none focus:border-brand-orange transition-colors bg-transparent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">City</label>
                    <input value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full text-base text-gray-700 border-b border-gray-200 py-1 focus:outline-none focus:border-brand-orange transition-colors bg-transparent" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">State</label>
                    <input value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full text-base text-gray-700 border-b border-gray-200 py-1 focus:outline-none focus:border-brand-orange transition-colors bg-transparent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Pincode</label>
                    <input value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full text-base text-gray-700 border-b border-gray-200 py-1 focus:outline-none focus:border-brand-orange transition-colors bg-transparent" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Mobile</label>
                    <input value={address.mobile} onChange={e => setAddress({...address, mobile: e.target.value})} className="w-full text-base text-gray-700 border-b border-gray-200 py-1 focus:outline-none focus:border-brand-orange transition-colors bg-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-brand-orange" />
              </div>
              Payment Method
            </h2>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="space-y-4">
                {[
                  { id: 'razorpay', label: 'Online Payment', desc: 'Credit/Debit Card, UPI, NetBanking' }
                ].map((method) => (
                  <label key={method.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-brand-orange bg-orange-50/50 shadow-sm' : 'border-gray-50 hover:border-gray-200 bg-gray-50/50'}`}>
                    <div className="flex-1">
                      <span className="text-base font-bold text-gray-900 block">{method.label}</span>
                      <span className="text-xs text-gray-500">{method.desc}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === method.id ? 'border-brand-orange' : 'border-gray-300'}`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-brand-orange rounded-full" />}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>          {/* Right Column: Order Summary (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="font-serif font-bold text-gray-900 mb-6 text-xl">Order Summary</h3>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto hide-scrollbar pr-2 mb-6">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.variant?.size}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 p-1 shrink-0">
                      <img src={item.product.images?.[0] || item.product.image_url} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.qty} | {item.variant?.size || 'Std'}</p>
                      <p className="text-sm font-bold text-brand-orange mt-1">₹{(item.variant?.price || item.product.price) * item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-bold text-gray-900 text-xl">
                  <span>Grand Total</span>
                  <span className="text-brand-orange">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {step === 1 ? (
                <button 
                  disabled
                  className="w-full bg-gray-100 text-gray-400 font-bold text-base rounded-xl py-4 flex items-center justify-center cursor-not-allowed"
                >
                  Select Checkout Method
                </button>
              ) : step === 2 ? (
                <button 
                  onClick={() => setStep(3)}
                  className="w-full bg-gradient-to-r from-brand-orange to-brand-maroon text-white font-bold text-base rounded-xl py-4 shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Payment
                </button>
              ) : (
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className={`w-full bg-gradient-to-r from-brand-orange to-brand-maroon text-white font-bold text-base rounded-xl py-4 shadow-lg flex items-center justify-center transition-all ${isPlacingOrder ? 'opacity-70 cursor-not-allowed shadow-none' : 'shadow-brand-orange/20 hover:shadow-xl hover:-translate-y-0.5'}`}
                >
                  {isPlacingOrder ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </div>
                  ) : 'Confirm & Pay'}
                </button>
              )}
              
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium">100% Secure Transaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 pb-safe z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] mx-auto w-full">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payable Amount</p>
              <p className="text-2xl font-bold text-gray-900 leading-none">₹{grandTotal.toFixed(2)}</p>
            </div>
          </div>
          
          {step === 1 ? (
            <button 
              disabled
              className="w-full bg-gray-100 text-gray-400 font-bold text-base rounded-xl py-4 flex items-center justify-center cursor-not-allowed"
            >
              Select Checkout Method
            </button>
          ) : step === 2 ? (
            <button 
              onClick={() => setStep(3)}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-maroon text-white font-bold text-base rounded-xl py-4 shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Payment
              <span className="w-1 h-1 bg-white rounded-full mx-1 opacity-50" />
              Step 3
            </button>
          ) : (
            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className={`w-full bg-gradient-to-r from-brand-orange to-brand-maroon text-white font-bold text-base rounded-xl py-4 shadow-lg flex items-center justify-center transition-all ${isPlacingOrder ? 'opacity-70 cursor-not-allowed shadow-none' : 'shadow-brand-orange/20 hover:shadow-xl hover:-translate-y-0.5'}`}
            >
              {isPlacingOrder ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </div>
              ) : 'Confirm Order'}
            </button>
          )}
        
        <div className="flex items-center justify-center gap-1 mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[9px] text-gray-400 font-medium">Your order is safe and secure</span>
        </div>
        </div>
      </div>

      {/* Order Placed Success Overlay */}
      {isPlacingOrder && (
        <div ref={overlayRef} className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center w-full h-full">
          <div className="flex flex-col items-center gap-4">
            <div ref={iconRef} className="w-24 h-24 bg-[#C16E4F] rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            <h2 ref={textRef} className="text-2xl font-serif font-bold text-[#5C4033]">Order Confirmed!</h2>
            <p className="text-sm text-gray-500">Redirecting to tracking...</p>
          </div>
        </div>
      )}
    </div>
  );
}
