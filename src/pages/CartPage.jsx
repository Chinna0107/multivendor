import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, MessageCircle, ShoppingCart } from 'lucide-react';
import { Header } from '../components/Header';
import { useCartStore } from '../store/useCartStore';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getSubtotal, getTotal, deliveryCharge } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  
  const container = React.useRef(null);
  
  useGSAP(() => {
    if (items.length > 0) {
      gsap.from('.animate-cart-item', {
        x: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      });
      gsap.from('.animate-cart-summary', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }
  }, { scope: container });

  const handleCheckout = () => {
    navigate('/checkout', { state: { couponCode } });
  };

  const subtotal = getSubtotal();
  const grandTotal = getTotal();

  return (
    <div ref={container} className="min-h-screen bg-gray-50 pb-36">
      <Header title={`My Cart (${items.length})`} />
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-20 max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-orange/10 to-brand-maroon/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <ShoppingCart className="w-12 h-12 text-brand-orange/40" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 text-center text-sm">Looks like you haven't added anything to your cart yet. Discover our latest collections.</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-gradient-to-r from-brand-orange to-brand-maroon text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 md:max-w-7xl mx-auto">
          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#036e26] text-white flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-[10px] text-[#036e26] font-bold mt-1">Cart</span>
            </div>
            <div className="h-px bg-gray-300 flex-1 mx-2"></div>
            <div className="flex flex-col items-center opacity-50">
              <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-[10px] text-gray-500 font-bold mt-1">Address</span>
            </div>
            <div className="h-px bg-gray-300 flex-1 mx-2"></div>
            <div className="flex flex-col items-center opacity-50">
              <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-[10px] text-gray-500 font-bold mt-1">Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start">
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {items.map(item => (
              <div key={`${item.product.id}-${item.variant?.size || 'default'}`} className="animate-cart-item bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex gap-3 relative">
                <button 
                  onClick={() => removeFromCart(item.product.id, item.variant)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="w-20 h-20 bg-gray-50 rounded-lg shrink-0 p-1 border border-gray-100">
                  <img src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : item.product.image_url} alt={item.product.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex flex-col justify-between py-1 flex-grow pr-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">{item.product.name}</h3>
                    <div className="flex gap-1 flex-wrap">
                      <p className="text-[10px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded inline-block">
                        {item.variant?.size || 'Standard'}
                      </p>
                      {item.product.color && (
                        <p className="text-[10px] text-[#036e26] font-medium bg-[#036e26]/10 px-1.5 py-0.5 rounded inline-block">
                          {item.product.color}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-[#036e26] mb-2">₹{item.variant?.price || item.product.price}</div>
                  
                  <div className="flex items-center w-24 border border-gray-200 rounded-lg p-0.5">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.variant, Math.max(1, item.qty - 1))}
                      className="w-6 h-6 flex items-center justify-center text-gray-500 active:bg-gray-50 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="flex-1 text-center text-[10px] font-bold text-gray-900">{item.qty}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.variant, item.qty + 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-500 active:bg-gray-50 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>            {/* Right Column: Summary & Checkout */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Coupon */}
              <div className="animate-cart-summary flex gap-3 p-5 bg-gradient-to-br from-orange-50/80 to-white rounded-3xl border border-brand-orange/20 shadow-sm">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Coupon Code" 
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
              />
            </div>
            <button className="bg-white text-brand-orange font-bold text-sm px-6 py-3 border border-brand-orange rounded-xl hover:bg-orange-50 transition-colors shadow-sm">
              APPLY
            </button>
          </div>

          {/* Bill Details */}
          <div className="animate-cart-summary bg-white p-5 rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
            <h3 className="font-serif font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100 text-lg">Price Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Item Total ({items.length} items)</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charges</span>
                <span className="font-medium text-green-600">
                  {deliveryCharge > 0 ? `₹${deliveryCharge.toFixed(2)}` : 'FREE'}
                </span>
              </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg md:text-xl pt-5 mt-3 border-t border-dashed border-gray-200">
                  <span>Grand Total</span>
                  <span className="text-brand-orange">₹{grandTotal.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="hidden lg:flex w-full mt-6 bg-gradient-to-r from-brand-orange to-brand-maroon text-white font-bold text-base rounded-xl py-4 shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:-translate-y-0.5 transition-all items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Checkout Bar - Mobile Only */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 mx-auto w-full bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 pb-safe z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Total Amount</p>
              <p className="text-xl font-bold text-gray-900 leading-none">₹{grandTotal.toFixed(2)}</p>
            </div>
            <button 
              onClick={handleCheckout}
              className="flex-1 sm:max-w-md bg-gradient-to-r from-brand-orange to-brand-maroon text-white font-bold text-base rounded-xl py-4 shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <span className="w-1 h-1 bg-white rounded-full mx-1 opacity-50" />
              Step 2
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
