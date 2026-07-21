import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { AdBanner } from '../components/AdBanner';
import { useStoreData } from '../store/useStoreData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import imgHeroBanner from '../assets/hero_banner.png';
import imgAarti from '../assets/story_aarti.png';

export function HomePage() {
  const container = useRef(null);
  const { products, categories, loading } = useStoreData();
  const [banners, setBanners] = React.useState([]);

  React.useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
    fetch(`${url}/general/banners`)
      .then(r => r.json())
      .then(d => { if (d.banners) setBanners(d.banners); })
      .catch(e => console.error(e));
  }, []);
  
  useGSAP(() => {
    if (!loading) {
      gsap.from('.animate-section', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }
  }, { scope: container, dependencies: [loading] });

  return (
    <div ref={container} className="bg-brand-green min-h-screen pb-12">
      <Header variant="home" />
      
      {/* 1. Categories Ribbon */}
      <div className="sticky top-[60px] md:top-[76px] z-30 bg-brand-green/95 backdrop-blur-md border-b border-white/10 mb-4 px-2 py-3 overflow-x-auto hide-scrollbar shadow-sm">
        <div className="flex gap-4 md:gap-10 justify-start md:justify-center min-w-max mx-auto px-4">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <img src={imgHeroBanner} alt="Cat" className="w-full h-full object-cover opacity-50" />
                )}
              </div>
              <span className="text-[11px] md:text-[12px] font-semibold text-white text-center group-hover:text-brand-orange">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 2. Hero Banner Carousel */}
      <div className="animate-section px-4 md:px-6 mb-8 max-w-[1280px] mx-auto">
        {banners.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2">
            {banners.map((banner) => (
              <div key={banner.id} className="relative w-full shrink-0 snap-center rounded-2xl overflow-hidden shadow-xl h-[280px] md:h-[420px]">
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-20">
                  <h2 className="text-white text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 drop-shadow-2xl max-w-xl leading-tight">
                    {banner.title}
                  </h2>
                  {(banner.link_url || banner.link_url === '') && (
                    <Link to={banner.link_url || "/category/all"} className="bg-white text-black text-xs md:text-sm font-bold px-8 py-3 md:py-4 rounded-full shadow-lg w-fit hover:scale-105 transition-transform uppercase tracking-wider">
                      Shop Collection
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl h-[280px] md:h-[420px]">
            <img src={imgHeroBanner} alt="Hero Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-20">
              <h2 className="text-white text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 drop-shadow-2xl max-w-xl leading-tight">
                Mega Sale <br/> All Products Available
              </h2>
              <Link to="/category/all" className="bg-white text-black text-xs md:text-sm font-bold px-8 py-3 md:py-4 rounded-full shadow-lg w-fit hover:scale-105 transition-transform uppercase tracking-wider hover:bg-[#fe6603] hover:text-white">
                Explore Now
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-2 md:px-4">
        
        {/* Unified Transparent Block (No Card Styling) */}
        <div className="animate-section mb-8 flex flex-col gap-8 md:gap-10">
          
          {/* Top Picks (Special Offers) */}
          {products.filter(p => p.is_offer).length > 0 && (
            <div>
              <div className="flex justify-between items-center px-2 md:px-0 py-2 mb-2">
                <h3 className="text-lg md:text-xl font-bold text-white">Top Picks For You</h3>
                <Link to="/collection/top-picks" className="text-brand-orange text-[10px] md:text-xs font-bold px-4 py-2 flex items-center gap-1 hover:underline transition-all">VIEW ALL &gt;</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {products.filter(p => p.is_offer).slice(0, 6).map(product => (
                  <div key={product.id} className="hover:-translate-y-1 transition-transform">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Sellers */}
          {products.filter(p => p.is_bestseller).length > 0 && (
            <div>
              <div className="flex justify-between items-center px-2 md:px-0 py-2 mb-2">
                <h3 className="text-lg md:text-xl font-bold text-white">Best Sellers</h3>
                <Link to="/collection/best-sellers" className="text-brand-orange text-[10px] md:text-xs font-bold px-4 py-2 flex items-center gap-1 hover:underline transition-all">VIEW ALL &gt;</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {products.filter(p => p.is_bestseller).slice(0, 6).map(product => (
                  <div key={product.id} className="hover:-translate-y-1 transition-transform">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Middle Advertisement Block */}
          <AdBanner 
            imageUrl={imgAarti} 
            altText="Middle Ad" 
            link="/category/all" 
          />

          {/* Trending (Previously Deals of the Day) */}
          {products.filter(p => p.is_trending).length > 0 && (
            <div>
              <div className="flex justify-between items-center px-2 md:px-0 py-2 mb-2">
                <h3 className="text-lg md:text-xl font-bold text-white">Trending</h3>
                <Link to="/collection/trending" className="text-brand-orange text-[10px] md:text-xs font-bold px-4 py-2 flex items-center gap-1 hover:underline transition-all">VIEW ALL &gt;</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {products.filter(p => p.is_trending).slice(0, 6).map(product => (
                  <div key={product.id} className="hover:-translate-y-1 transition-transform">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories horizontally scrolling products */}
          {categories.map((cat) => {
            const catProducts = products.filter(p => p.category === cat.name);
            if (catProducts.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="flex justify-between items-center px-2 md:px-0 py-2 mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-white">{cat.name}</h3>
                  <Link to={`/category/${cat.id}`} className="text-brand-orange text-[10px] md:text-xs font-bold hover:underline transition-all flex items-center gap-1">VIEW ALL {cat.name.toUpperCase()} &gt;</Link>
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                  {catProducts.slice(0, 8).map(product => (
                    <div key={product.id} className="w-[140px] md:w-[180px] shrink-0 hover:-translate-y-1 transition-transform">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Bottom Advertisement Block */}
          <AdBanner 
            imageUrl={imgHeroBanner} 
            altText="Bottom Ad" 
            link="/category/all" 
          />

        </div>
      </div>

    </div>
  );
}
