import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, Star, ShoppingCart } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useWishlistStore } from '../store/useWishlistStore';
import { useStoreData } from '../store/useStoreData';
import { useCartStore } from '../store/useCartStore';

export function WishlistPage() {
  const navigate = useNavigate();
  const { items, toggleWishlist } = useWishlistStore();
  const { products } = useStoreData();
  const { addToCart } = useCartStore();
  
  React.useEffect(() => {
    if (products.length > 0) {
      const validItems = items.filter(id => products.some(p => String(p.id) === String(id)));
      if (validItems.length !== items.length) {
        useWishlistStore.setState({ items: validItems });
      }
    }
  }, [items, products]);

  const wishlistProducts = items.map(id => products.find(p => String(p.id) === String(id))).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-24 font-sans">
      <Header />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 py-6 md:py-8 flex flex-col md:flex-row gap-4 mt-16 md:mt-0">
        
        {/* Desktop Sidebar (Optional, mimicking Flipkart) */}
        <div className="hidden md:block w-72 shrink-0">
           <div className="bg-white shadow-sm p-4 mb-4 rounded-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=User&background=2874f0&color=fff" alt="Profile" />
              </div>
              <div>
                <div className="text-[12px] text-gray-500">Hello,</div>
                <div className="font-bold text-[16px]">Flipkart User</div>
              </div>
           </div>
           
           <div className="bg-white shadow-sm rounded-sm">
             <div className="border-b border-gray-100 p-4 hover:bg-gray-50 cursor-pointer font-medium text-gray-500 hover:text-[#2874f0] transition-colors">
               My Orders
             </div>
             <div className="p-4 bg-blue-50/50 cursor-pointer font-medium text-[#2874f0] transition-colors flex items-center justify-between">
               <span>My Wishlist</span>
               <span className="bg-[#2874f0] text-white text-xs font-bold px-2 py-0.5 rounded-full">{wishlistProducts.length}</span>
             </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white shadow-sm rounded-sm min-h-[60vh]">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-[18px] font-medium text-[#212121]">
              My Wishlist <span className="font-normal text-gray-500 text-[14px]">({wishlistProducts.length})</span>
            </h1>
          </div>

          {wishlistProducts.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-24 text-center px-4">
               <div className="mb-6">
                 <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png" alt="Empty Wishlist" className="w-64 opacity-80" />
               </div>
               <h2 className="text-[18px] font-medium text-gray-900 mb-2">Empty Wishlist</h2>
               <p className="text-gray-500 text-[14px] mb-6">
                 You have no items in your wishlist. Start adding!
               </p>
               <Link to="/category/all" className="bg-[#2874f0] text-white px-8 py-3 rounded-sm font-medium text-[14px] hover:bg-blue-600 shadow-md">
                 Explore Products
               </Link>
             </div>
          ) : (
            <div className="flex flex-col">
              {wishlistProducts.map((product, idx) => {
                
                let parsedSizes = [];
                try {
                  if (typeof product.sizes === 'string') {
                    parsedSizes = JSON.parse(product.sizes);
                  } else if (Array.isArray(product.sizes)) {
                    parsedSizes = product.sizes;
                  }
                } catch (e) {}

                let defaultSize = { size: 'Standard', price: product.price || 0 };
                let firstImg = product.image_url;
                let color = product.color;

                if (parsedSizes && parsedSizes.length > 0) {
                  if (parsedSizes[0].sizes && Array.isArray(parsedSizes[0].sizes) && parsedSizes[0].sizes.length > 0) {
                    defaultSize = parsedSizes[0].sizes[0];
                    color = parsedSizes[0].color;
                    if (parsedSizes[0].images && parsedSizes[0].images.length > 0) {
                      firstImg = parsedSizes[0].images[0];
                    }
                  } else if (parsedSizes[0].size) {
                    defaultSize = parsedSizes[0];
                  }
                }

                if (!firstImg && product.images && product.images.length > 0) {
                  firstImg = product.images[0];
                }
                
                const displayPrice = defaultSize.price;
                const originalPrice = Math.round(displayPrice * 1.4);
                const discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

                return (
                  <div key={product.id} className={`flex gap-6 p-6 ${idx !== wishlistProducts.length - 1 ? 'border-b border-gray-200' : ''} hover:shadow-md transition-shadow relative group cursor-pointer`} onClick={() => navigate(`/product/${product.id}`)}>
                    
                    <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 relative">
                      <img src={firstImg} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between items-start gap-4">
                        <div className="pr-12">
                          <h3 className="text-[16px] md:text-[18px] font-medium text-[#212121] hover:text-[#2874f0] line-clamp-2 leading-snug mb-1">{product.name}</h3>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-0.5 rounded-sm text-[12px] font-bold">
                              4.5 <Star className="w-3 h-3 fill-current" />
                            </div>
                            <span className="text-gray-500 font-medium text-[14px]">(1,245)</span>
                          </div>

                          <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-[24px] font-medium text-[#212121]">₹{displayPrice}</span>
                            <span className="text-gray-500 line-through text-[14px]">₹{originalPrice}</span>
                            <span className="text-[#388e3c] font-bold text-[14px]">{discountPercent}% off</span>
                          </div>
                        </div>

                        {/* Trash Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="absolute right-6 top-6 text-gray-400 hover:text-[#2874f0] transition-colors p-2"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product, defaultSize);
                              navigate('/cart');
                            }}
                            className="bg-[#2874f0] text-white px-6 py-2 text-[14px] font-medium rounded-sm flex items-center gap-2 hover:bg-blue-600"
                         >
                            <ShoppingCart className="w-4 h-4" /> ADD TO CART
                         </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
