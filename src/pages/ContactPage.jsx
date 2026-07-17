import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      <Header title="Contact Us" />
      
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full pointer-events-none opacity-50"></div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-maroon mb-6 relative z-10">Get in Touch</h2>
            <p className="text-gray-600 mb-8 text-base leading-relaxed relative z-10">
              We would love to hear from you. Whether you have a question about our products, need assistance with an order, or just want to share your feedback, our team is ready to help.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Our Location</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    1-1-738, Vinayaka temple road,<br/>
                    Koratla, Telangana, India
                  </p>
                  <p className="text-xs text-gray-500 mt-1">GSTIN: 36BANPK1643M1ZC</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Phone & WhatsApp</h3>
                  <p className="text-sm text-gray-600">+91 9848397379</p>
                  <p className="text-xs text-gray-500 mt-1">Mon-Sat, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Address</h3>
                  <p className="text-sm text-gray-600">mokshamandir542@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 relative"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-orange to-brand-maroon rounded-t-3xl"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-shadow" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-shadow" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-shadow" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-shadow resize-none" placeholder="Write your message here..."></textarea>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#C16E4F] to-brand-maroon text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all mt-2"
              >
                Send Message
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
