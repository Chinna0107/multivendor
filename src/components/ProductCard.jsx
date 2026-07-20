import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Share2 } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';

export function ProductCard({ product, layout = 'grid' }) {
  const navigate = useNavigate();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  const { addToCart } = useCartStore();

  const isWishlisted = wishlistItems.includes(product.id);
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : { size: 'Standard', price: 0 };
  const displayPrice = defaultSize.price;
  
  // Use the first image from images array, fallback to image_url
  const firstImg = (product.images && product.images.length > 0) ? product.images[0] : product.image_url;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = window.location.origin + `/product/${product.id}`;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Indbasket!`,
      url: url
    };

    if (navigator.share) {
      try {
        if (firstImg) {
          const response = await fetch(firstImg);
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultSize);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  if (layout === 'list') {
    return (
      <Link to={`/product/${product.id}`} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm mb-4 relative hover:shadow-md transition-shadow">
        <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 p-2 relative border border-[#036e26]/10">
          <img src={firstImg} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col justify-center flex-grow">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">{product.name}</h3>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-medium text-gray-500">4.5 (12)</span>
            {product.color && (
              <>
                <span className="text-[10px] font-medium text-gray-300 px-1">•</span>
                <span className="text-[10px] font-medium text-gray-500">{product.color}</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-gray-900">₹{displayPrice}</span>
              <span className="text-[9px] text-[#036e26] font-bold bg-[#036e26]/10 px-1 py-0.5 rounded">{defaultSize.size}</span>
            </div>
            <button onClick={handleAddToCart} className="bg-[#036e26] text-white text-xs font-semibold px-4 py-1.5 rounded-md hover:bg-[#004012] transition-colors flex items-center gap-1">
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button 
            onClick={handleWishlist}
            className="text-gray-300 hover:scale-110 transition-transform bg-white/80 p-1 rounded-full shadow-sm"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#fe6603] text-[#fe6603]' : ''}`} />
          </button>
          <button 
            onClick={handleShare}
            className="text-gray-400 hover:scale-110 transition-transform bg-white/80 p-1 rounded-full shadow-sm"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#036e26]/10 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 h-full p-3 relative"
    >
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button onClick={handleWishlist} className="p-1.5 hover:scale-110 transition-transform bg-white/90 rounded-full shadow-sm border border-gray-100">
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#fe6603] text-[#fe6603]' : 'text-gray-400'}`} />
        </button>
        <button onClick={handleShare} className="p-1.5 hover:scale-110 transition-transform bg-white/90 rounded-full shadow-sm border border-gray-100">
          <Share2 className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-xl mb-3">
        <img src={firstImg} alt={product.name} className="w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1.5">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-medium text-gray-500">4.5 (12)</span>
          {product.color && (
            <>
              <span className="text-[10px] font-medium text-gray-300 px-1">•</span>
              <span className="text-[10px] font-medium text-gray-500">{product.color}</span>
            </>
          )}
        </div>

        <div className="flex flex-col gap-1 mb-3 mt-auto">
          <span className="text-[9px] text-[#036e26] font-bold bg-[#036e26]/10 px-1.5 py-0.5 rounded w-fit">{defaultSize.size}</span>
          <span className="text-base font-bold text-gray-900">₹{displayPrice}</span>
        </div>

        <button onClick={handleAddToCart} className="w-full bg-[#036e26] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#004012] transition-colors flex items-center justify-center gap-1.5">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
