import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const logoUrl = '/image.png';
  return (
    <footer className="bg-[#5C4033] text-orange-50 pt-12 pb-24 md:pb-12 mt-12 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="Mokshamandir" className="w-10 h-10 object-contain bg-white rounded-full p-1" />
              <h2 className="text-2xl font-bold text-brand-gold">Mokshamandir</h2>
            </div>
            <p className="text-sm text-orange-100/80 leading-relaxed">
              Your one-stop destination for all authentic and premium pooja samagri. Experience the divine with our carefully curated spiritual collection.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-[#5C4033] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-[#5C4033] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-[#5C4033] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-[#5C4033] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-brand-gold mb-2">Quick Links</h3>
            <Link to="/" className="text-sm text-orange-100/80 hover:text-brand-gold transition-colors">Home</Link>
            <Link to="/category/all" className="text-sm text-orange-100/80 hover:text-brand-gold transition-colors">Shop All</Link>
            <Link to="/profile" className="text-sm text-orange-100/80 hover:text-brand-gold transition-colors">My Account</Link>
            <Link to="/my-orders" className="text-sm text-orange-100/80 hover:text-brand-gold transition-colors">Order Tracking</Link>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-brand-gold mb-2">Customer Service</h3>
            <Link to="/contact" className="text-sm text-orange-100/80 hover:text-brand-gold transition-colors">Contact Us</Link>
            <Link to="/about" className="text-sm text-orange-100/80 hover:text-brand-gold transition-colors">About Us</Link>
            <Link to="#" className="text-sm text-orange-100/80 hover:text-brand-gold transition-colors">Shipping Policy</Link>
            <Link to="#" className="text-sm text-orange-100/80 hover:text-brand-gold transition-colors">Returns & Exchanges</Link>
            <Link to="#" className="text-sm text-orange-100/80 hover:text-brand-gold transition-colors">FAQs</Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-brand-gold mb-2">Contact Us</h3>
            <div className="flex items-start gap-3 text-sm text-orange-100/80">
              <MapPin className="w-5 h-5 shrink-0 text-brand-gold" />
              <span>1-1-738, Vinayaka temple road,<br/>Koratla, Telangana, India<br/><span className="text-xs text-orange-100/50">GSTIN: 36BANPK1643M1ZC</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-orange-100/80">
              <Phone className="w-5 h-5 shrink-0 text-brand-gold" />
              <span>+91 9848397379</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-orange-100/80">
              <Mail className="w-5 h-5 shrink-0 text-brand-gold" />
              <span>mokshamandir542@gmail.com</span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-orange-100/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-orange-100/60">
            © {new Date().getFullYear()} Mokshamandir. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-orange-100/60">
            <Link to="#" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-brand-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
