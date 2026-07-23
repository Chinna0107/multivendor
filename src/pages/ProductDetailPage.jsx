import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Heart, ShoppingCart, Star, Tag, MapPin, Zap, X, RefreshCcw, Banknote } from 'lucide-react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useStoreData } from '../store/useStoreData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useStoreData();
  const product = products.find(p => p.id.toString() === id);
  const { addToCart } = useCartStore();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const isWishlisted = product ? wishlistItems.includes(product.id) : false;
  const relatedProducts = product ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10) : [];
  
  const container = useRef(null);

  let parsedSizes = [];
  try {
    if (typeof product?.sizes === 'string') {
      parsedSizes = JSON.parse(product.sizes);
    } else if (Array.isArray(product?.sizes)) {
      parsedSizes = product.sizes;
    }
  } catch(e) {}

  const isHierarchical = parsedSizes.length > 0 && Array.isArray(parsedSizes[0].sizes);

  const currentVariant = isHierarchical ? parsedSizes[selectedVariantIdx] : null;
  const currentSizesArray = isHierarchical ? currentVariant.sizes : parsedSizes;
  const selectedSizeObj = currentSizesArray && currentSizesArray.length > 0 ? currentSizesArray[selectedSizeIdx] : { size: 'Standard', price: product?.price || 0 };

  const productImages = (currentVariant && currentVariant.images && currentVariant.images.length > 0) 
    ? currentVariant.images 
    : (product ? ((product.images && product.images.length > 0) ? product.images : (product.image_url ? [product.image_url] : [])) : []);
    
  const [mainImg, setMainImg] = useState(null);

  useEffect(() => {
    if (productImages.length > 0 && !productImages.includes(mainImg)) {
      setMainImg(productImages[0]);
    }
  }, [productImages, selectedVariantIdx]);

  useGSAP(() => {
    if (product) {
      gsap.from('.fade-up', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }
  }, { scope: container, dependencies: [product] });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-[#2874f0]/20 border-t-[#2874f0] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 bg-white">
        <p className="mb-4 text-lg">Product not found.</p>
        <button onClick={() => navigate('/')} className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-medium">
          Go Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const variantWithColor = { ...selectedSizeObj, color: parsedSizes[selectedVariantIdx]?.color || '' };
    addToCart(product, variantWithColor, quantity);
  };

  const handleBuyNow = () => {
    const variantWithColor = { ...selectedSizeObj, color: parsedSizes[selectedVariantIdx]?.color || '' };
    addToCart(product, variantWithColor, quantity);
    navigate('/cart');
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = window.location.href;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Indbasket!`,
      url: url
    };

    if (navigator.share) {
      try {
        const imgUrl = mainImg || productImages[0];
        if (imgUrl) {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          const file = new File([blob], 'product.jpg', { type: blob.type });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        }
      } catch (err) {
        console.warn('Could not attach image to share:', err);
      }
      
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const originalPrice = selectedSizeObj ? Math.round(selectedSizeObj.price * 1.4) : 0;
  const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - selectedSizeObj.price) / originalPrice) * 100) : 0;
  
  let customAttrs = {};
  try {
    customAttrs = typeof product.custom_attributes === 'string' ? JSON.parse(product.custom_attributes) : product.custom_attributes || {};
  } catch(e) {}

  return (
    <div ref={container} className="min-h-screen bg-white pb-28 md:pb-12">
      <Header />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mt-6 md:mt-10 space-y-12 font-sans">
        <div className="md:flex items-start gap-8 lg:gap-16">
          
          {/* LEFT COLUMN: Images & Action Buttons */}
          <div className="md:w-[45%] lg:w-[50%] flex-shrink-0 relative">
            <div className="sticky top-[100px]">
              <div className="flex gap-2">
                {/* Thumbnails (Desktop Left) */}
                <div className="hidden md:flex flex-col gap-2 w-[64px]">
                  {productImages.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setMainImg(img)}
                      className={`w-16 h-16 border rounded-sm p-1 cursor-pointer hover:border-[#2874f0] ${mainImg === img ? 'border-[#2874f0]' : 'border-gray-200'}`}
                    >
                      <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
                
                {/* Main Image */}
                <div 
                  className="flex-1 relative aspect-square border border-gray-200 rounded-sm p-2 group cursor-zoom-in"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center border border-gray-200 hover:scale-110 transition-transform">
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#ff4343] text-[#ff4343]' : 'text-gray-400'}`} />
                    </button>
                    <button onClick={handleShare} className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center border border-gray-200 hover:scale-110 transition-transform">
                      <Share2 className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <img src={mainImg || productImages[0]} alt={product.name} className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Mobile Thumbnails */}
              <div className="flex md:hidden gap-2 mt-4 overflow-x-auto hide-scrollbar">
                {productImages.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setMainImg(img)}
                    className={`w-14 h-14 border rounded-sm p-1 cursor-pointer flex-shrink-0 ${mainImg === img ? 'border-[#2874f0]' : 'border-gray-200'}`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex gap-2 mt-6">
                <button onClick={handleAddToCart} className="flex-1 bg-[#ff9f00] hover:bg-[#f39800] text-white font-bold py-4 rounded-sm shadow-sm flex items-center justify-center gap-2 transition-colors">
                  <ShoppingCart className="w-5 h-5" /> ADD TO CART
                </button>
                <button onClick={handleBuyNow} className="flex-1 bg-[#fb641b] hover:bg-[#f05f19] text-white font-bold py-4 rounded-sm shadow-sm flex items-center justify-center gap-2 transition-colors">
                  <Zap className="w-5 h-5 fill-current" /> BUY NOW
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="md:w-[60%] p-4 md:p-6 text-gray-800 text-sm">
            <div className="fade-up">
              {/* Title & Ratings */}
              <h1 className="text-[18px] text-[#212121] mb-2">{product.name}</h1>
              <div className="text-gray-500 mb-2">{product.short_description}</div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-0.5 rounded-sm text-[12px] font-bold">
                  4.5 <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-gray-500 font-medium">1,245 Ratings & 142 Reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-[28px] font-medium text-[#212121]">₹{selectedSizeObj?.price || 0}</span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-gray-500 line-through text-[16px]">₹{originalPrice}</span>
                    <span className="text-[#388e3c] font-bold text-[16px]">{discountPercent}% off</span>
                  </>
                )}
              </div>
            </div>

            {/* Colors */}
            {isHierarchical && parsedSizes.length > 0 && (
              <div className="fade-up flex items-start gap-12 mb-6 py-4 border-t border-gray-200">
                <span className="text-gray-500 font-medium w-16 shrink-0">Color</span>
                <div className="flex flex-wrap gap-3">
                  {parsedSizes.map((variant, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setSelectedVariantIdx(idx);
                        setSelectedSizeIdx(0);
                      }}
                      className={`px-4 py-1.5 border transition-all ${
                        selectedVariantIdx === idx 
                          ? 'border-[#2874f0] text-[#2874f0] font-medium' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes/Variants */}
            {currentSizesArray && currentSizesArray.length > 0 && (
              <div className="fade-up flex items-start gap-12 mb-6 py-4 border-t border-gray-200">
                <span className="text-gray-500 font-medium w-16 shrink-0">Size</span>
                <div className="flex flex-wrap gap-3">
                  {currentSizesArray.map((sizeObj, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`px-4 py-1.5 border transition-all ${
                        selectedSizeIdx === idx 
                          ? 'border-[#2874f0] text-[#2874f0] font-medium' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {sizeObj.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery */}
            <div className="fade-up flex items-start gap-12 mb-6 border-t border-gray-200 pt-4">
              <span className="text-gray-500 font-medium w-16 shrink-0 mt-1">Delivery</span>
              <div className="flex-1">
                <div className="flex items-center border-b-2 border-[#2874f0] w-64 pb-1 mb-2">
                  <MapPin className="w-4 h-4 text-[#2874f0] mr-2" />
                  <input 
                    type="text" 
                    placeholder="Enter Delivery Pincode" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 outline-none text-[14px] placeholder-gray-400 font-medium bg-transparent" 
                    maxLength={6}
                  />
                  <button className="text-[#2874f0] font-medium text-[14px]">Check</button>
                </div>
                <p className="text-[14px] font-medium mt-2">Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} | <span className="text-[#388e3c]">Free</span> <span className="line-through text-gray-400">₹40</span></p>
                <p className="text-[12px] text-gray-500 mt-1">If ordered before 4:00 PM</p>
              </div>
            </div>

            {/* Product Description */}
            <div className="fade-up mb-10 border-t border-gray-200 pt-6">
              <h2 className="font-bold text-[20px] text-gray-900 mb-4">Product Description</h2>
              <div className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description || "Experience the perfect blend of tradition and quality. This product is carefully crafted to meet your daily needs while maintaining an authentic feel. Suitable for all occasions and built to last."}
              </div>
            </div>

            {/* Specifications */}
            <div className="fade-up mb-10 border-t border-gray-200 pt-6">
              <h2 className="font-bold text-[20px] text-gray-900 mb-4">Specifications</h2>
              <div>
                <div className="font-medium text-[16px] mb-4 text-gray-800">General</div>
                <table className="w-full text-[15px]">
                  <tbody>
                    <tr className="align-top border-b border-gray-100">
                      <td className="py-3 text-gray-500 w-32 md:w-48">Category</td>
                      <td className="py-3 font-medium text-gray-900">{product.category || 'General'}</td>
                    </tr>
                    {currentVariant?.color && (
                      <tr className="align-top border-b border-gray-100">
                        <td className="py-3 text-gray-500 w-32 md:w-48">Color</td>
                        <td className="py-3 font-medium text-gray-900">{currentVariant.color}</td>
                      </tr>
                    )}
                    {Object.entries(customAttrs).map(([key, value]) => (
                      <tr key={key} className="align-top border-b border-gray-100">
                        <td className="py-3 text-gray-500 w-32 md:w-48 capitalize">{key.replace(/_/g, ' ')}</td>
                        <td className="py-3 font-medium text-gray-900">
                           {String(value).startsWith('http') ? <a href={value} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View Document/Image</a> : value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
        
        {/* People Also Bought / Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-gray-100 fade-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">People also bought</h2>
            <div className="flex overflow-x-auto gap-6 hide-scrollbar pb-6 snap-x">
              {relatedProducts.map(rp => (
                <div key={rp.id} className="w-[180px] md:w-[220px] flex-shrink-0 snap-start">
                  <ProductCard product={rp} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar (Visible only on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-white text-[#212121] font-medium py-3.5 flex items-center justify-center gap-2"
        >
          ADD TO CART
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-[#fb641b] text-white font-medium py-3.5 flex items-center justify-center gap-2"
        >
           BUY NOW
        </button>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={() => setIsImageModalOpen(false)}
          >
            <button 
              onClick={() => setIsImageModalOpen(false)} 
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[101]"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl p-4 md:p-8 flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={mainImg || productImages[0]} alt={product.name} className="w-full h-auto max-h-[70vh] object-contain" />
              
              <div className="flex gap-2 overflow-x-auto hide-scrollbar max-w-full pb-2">
                {productImages.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setMainImg(img)}
                    className={`w-16 h-16 border-2 rounded-sm p-1 cursor-pointer flex-shrink-0 bg-white transition-all ${mainImg === img ? 'border-[#2874f0]' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
