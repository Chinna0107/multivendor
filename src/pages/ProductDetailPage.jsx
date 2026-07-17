import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Heart, ShoppingCart, Star, Plus, Minus, Settings, HandMetal, Clock, Sun } from 'lucide-react';
import { Header } from '../components/Header';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useStoreData } from '../store/useStoreData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useStoreData();
  const product = products.find(p => p.id.toString() === id);
  const { addToCart } = useCartStore();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = product ? wishlistItems.includes(product.id) : false;
  
  const container = useRef(null);

  const productImages = product ? ((product.images && product.images.length > 0) 
    ? product.images 
    : (product.image_url ? [product.image_url] : [])) : [];
    
  const [mainImg, setMainImg] = useState(null);

  useEffect(() => {
    if (productImages.length > 0 && !mainImg) {
      setMainImg(productImages[0]);
    }
  }, [productImages, mainImg]);
  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  useGSAP(() => {
    if (product) {
      gsap.from('.animate-image', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'all'
      });
      
      gsap.from('.animate-info', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }
  }, { scope: container, dependencies: [product] });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#C16E4F]/20 border-t-[#C16E4F] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <p className="mb-4 text-lg">Product not found.</p>
        <button onClick={() => navigate('/')} className="bg-[#C16E4F] text-white px-6 py-2 rounded-lg font-bold">
          Go Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize || { size: 'Standard', price: 0 }, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize || { size: 'Standard', price: 0 }, quantity);
    navigate('/cart');
  };

  const highlightIcons = [
    { label: 'Authentic', icon: Settings },
    { label: 'Quality', icon: HandMetal },
    { label: 'Fresh', icon: Clock },
    { label: 'Traditional', icon: Sun },
  ];


  return (
    <div ref={container} className="min-h-screen bg-gray-50 pb-28">
      <Header showShare={true} />
      
      <div className="md:max-w-full max-w-7xl mx-auto md:flex md:gap-8 md:p-8">
        {/* Product Image Section */}
        <div className="animate-image md:w-1/2 w-full bg-white md:rounded-3xl rounded-b-3xl shadow-sm overflow-hidden p-4 mb-4 md:mb-0 border border-[#C16E4F]/10">
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative bg-gray-50 border border-gray-100 p-2">
            <img src={mainImg || productImages[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {productImages.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setMainImg(img)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-white p-1 cursor-pointer transition-all ${mainImg === img ? 'border-[#C16E4F]' : 'border-gray-100'}`}
              >
                <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="md:w-1/2 px-4 md:px-0 space-y-4">
          {/* Info Card */}
          <div className="animate-info bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
            
            {product.color && (
              <div className="inline-block bg-[#C16E4F]/10 text-[#C16E4F] text-xs font-bold px-2 py-1 rounded mb-3">
                Color: {product.color}
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
                <Star className="w-3 h-3 fill-current" />
                4.5
              </div>
              <span className="text-xs text-gray-500">(12 reviews)</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl md:text-4xl font-bold text-[#C16E4F]">₹{selectedSize?.price || 0}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="animate-info bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Highlights</h3>
            <div className="flex justify-between md:justify-start md:gap-8">
              {highlightIcons.map((hl, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-1/4 md:w-auto">
                  <div className="w-10 h-10 rounded-full border border-[#C16E4F]/20 bg-[#C16E4F]/5 flex items-center justify-center text-[#C16E4F]">
                    <hl.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] md:text-xs font-medium text-gray-600 text-center leading-tight">{hl.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="animate-info bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(sizeObj => (
                  <button 
                    key={sizeObj.size}
                    onClick={() => setSelectedSize(sizeObj)}
                    className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold border transition-colors ${
                      selectedSize?.size === sizeObj.size 
                        ? 'border-[#C16E4F] bg-[#C16E4F]/10 text-[#C16E4F]' 
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="animate-info bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center w-32 border border-gray-200 rounded-lg p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center text-sm font-bold text-gray-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe flex gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] max-w-5xl mx-auto w-full">
        <button 
          onClick={handleAddToCart}
          className="flex-1 border border-[#C16E4F] text-[#C16E4F] font-bold text-sm rounded-xl py-3.5 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-[#C16E4F] text-white font-bold text-sm rounded-xl py-3.5"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
