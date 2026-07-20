import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Heart, ShoppingCart, Star, Plus, Minus, Tag, MapPin, ChevronRight, Zap, X, RefreshCcw, Banknote } from 'lucide-react';
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
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const isWishlisted = product ? wishlistItems.includes(product.id) : false;
  const relatedProducts = product ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10) : [];
  
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
    addToCart(product, selectedSize || { size: 'Standard', price: 0 }, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize || { size: 'Standard', price: 0 }, quantity);
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

  // Mock data for Flipkart-like UI
  const originalPrice = selectedSize ? Math.round(selectedSize.price * 1.4) : 0;
  const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - selectedSize.price) / originalPrice) * 100) : 0;

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
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-0.5 rounded-sm text-[12px] font-bold">
                  4.5 <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-gray-500 font-medium">1,245 Ratings & 142 Reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-[28px] font-medium text-[#212121]">₹{selectedSize?.price || 0}</span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-gray-500 line-through text-[16px]">₹{originalPrice}</span>
                    <span className="text-[#388e3c] font-bold text-[16px]">{discountPercent}% off</span>
                  </>
                )}
              </div>
            </div>

            {/* Available Offers */}
            <div className="fade-up mb-6">
              <h3 className="font-medium text-[16px] mb-3">Available offers</h3>
              <div className="space-y-2">
                {[
                  "Bank Offer 5% Cashback on Flipkart Axis Bank Card",
                  "Special Price Get extra 10% off (price inclusive of cashback/coupon)",
                  "Partner Offer Sign up for Flipkart Pay Later and get Flipkart Gift Card worth up to ₹500"
                ].map((offer, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Tag className="w-4 h-4 text-[#388e3c] shrink-0 mt-0.5 fill-current" />
                    <span className="text-[14px]">
                      <span className="font-medium">{offer.split(' ')[0]} {offer.split(' ')[1]}</span> {offer.split(' ').slice(2).join(' ')}
                      <span className="text-[#2874f0] font-medium cursor-pointer ml-1">T&C</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes/Variants */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="fade-up flex items-start gap-12 mb-6 py-4 border-t border-gray-200">
                <span className="text-gray-500 font-medium w-16 shrink-0">Size</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(sizeObj => (
                    <button 
                      key={sizeObj.size}
                      onClick={() => setSelectedSize(sizeObj)}
                      className={`px-4 py-1.5 border transition-all ${
                        selectedSize?.size === sizeObj.size 
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
            <div className="fade-up flex items-start gap-12 mb-6">
              <span className="text-gray-500 font-medium w-16 shrink-0 mt-1">Delivery</span>
              <div className="flex-1">
                <div className="flex items-center border-b-2 border-[#2874f0] w-64 pb-1 mb-2">
                  <MapPin className="w-4 h-4 text-[#2874f0] mr-2" />
                  <input 
                    type="text" 
                    placeholder="Enter Delivery Pincode" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 outline-none text-[14px] placeholder-gray-400 font-medium" 
                    maxLength={6}
                  />
                  <button className="text-[#2874f0] font-medium text-[14px]">Check</button>
                </div>
                <p className="text-[14px] font-medium mt-2">Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} | <span className="text-[#388e3c]">Free</span> <span className="line-through text-gray-400">₹40</span></p>
                <p className="text-[12px] text-gray-500 mt-1">If ordered before 4:00 PM</p>
              </div>
            </div>

            {/* Highlights & Services */}
            <div className="fade-up flex flex-col md:flex-row gap-6 md:gap-12 py-6 border-t border-b border-gray-100 mb-6">
              <div className="flex items-start gap-12 md:w-1/2">
                <span className="text-gray-500 font-medium w-16 shrink-0">Highlights</span>
                <ul className="list-disc pl-4 space-y-1.5 text-[14px]">
                  <li>Premium Quality Material</li>
                  <li>Authentic & Traditional Design</li>
                  <li>Perfect for everyday use</li>
                  <li>Easy to maintain</li>
                </ul>
              </div>
              <div className="flex items-start gap-12 md:w-1/2">
                <span className="text-gray-500 font-medium w-16 shrink-0">Services</span>
                <ul className="space-y-3 text-[14px] text-gray-800">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <RefreshCcw className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">7 Days Replacement Policy</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                      <Banknote className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">Cash on Delivery available</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Product Description */}
            <div className="fade-up mb-10">
              <h2 className="font-bold text-[20px] text-gray-900 mb-4">Product Description</h2>
              <div className="text-[15px] text-gray-600 leading-relaxed">
                {product.description || "Experience the perfect blend of tradition and quality. This product is carefully crafted to meet your daily needs while maintaining an authentic feel. Suitable for all occasions and built to last."}
              </div>
            </div>

            {/* Specifications */}
            <div className="fade-up mb-10">
              <h2 className="font-bold text-[20px] text-gray-900 mb-4">Specifications</h2>
              <div>
                <div className="font-medium text-[16px] mb-4 text-gray-800">General</div>
                <table className="w-full text-[15px]">
                  <tbody>
                    <tr className="align-top border-b border-gray-100">
                      <td className="py-3 text-gray-500 w-32 md:w-48">Category</td>
                      <td className="py-3 font-medium text-gray-900">{product.category || 'General'}</td>
                    </tr>
                    {product.color && (
                      <tr className="align-top border-b border-gray-100">
                        <td className="py-3 text-gray-500 w-32 md:w-48">Color</td>
                        <td className="py-3 font-medium text-gray-900">{product.color}</td>
                      </tr>
                    )}
                    {product.model && (
                      <tr className="align-top border-b border-gray-100">
                        <td className="py-3 text-gray-500 w-32 md:w-48">Model</td>
                        <td className="py-3 font-medium text-gray-900">{product.model}</td>
                      </tr>
                    )}
                    <tr className="align-top border-b border-gray-100">
                      <td className="py-3 text-gray-500 w-32 md:w-48">Pack Of</td>
                      <td className="py-3 font-medium text-gray-900">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ratings & Reviews */}
            <div className="fade-up mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-[20px] text-gray-900">Ratings & Reviews</h2>
                <button className="bg-white text-[#fe6603] px-5 py-2 rounded-full font-bold border border-[#fe6603]/30 hover:bg-orange-50 transition-colors text-sm">Rate Product</button>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-[40px] font-bold text-gray-900 flex items-center justify-center gap-2">4.5 <Star className="w-8 h-8 fill-current text-[#fe6603]" /></div>
                  <div className="text-gray-500 text-[14px] mt-2 font-medium">1,245 Ratings &</div>
                  <div className="text-gray-500 text-[14px] font-medium">142 Reviews</div>
                </div>
                <div className="flex-1 w-full max-w-sm space-y-2.5">
                  {[5, 4, 3, 2, 1].map((star, idx) => (
                    <div key={star} className="flex items-center gap-3 text-[13px] font-medium">
                      <span className="w-3 text-gray-700">{star}</span>
                      <Star className="w-3 h-3 fill-current text-gray-400 shrink-0" />
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${star >= 4 ? 'bg-[#036e26]' : star === 3 ? 'bg-[#ff9f00]' : 'bg-[#ff6161]'}`} 
                          style={{ width: `${[70, 20, 5, 3, 2][idx]}%` }}
                        />
                      </div>
                      <span className="text-gray-500 w-10 text-right">{[876, 245, 65, 34, 25][idx]}</span>
                    </div>
                  ))}
                </div>
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
