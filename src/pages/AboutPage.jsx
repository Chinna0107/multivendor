import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { ShieldCheck, Truck, Headphones, Package, Target, HeartHandshake } from 'lucide-react';

const values = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: 'Authenticity Guaranteed',
    desc: 'Every product is sourced directly from certified brands and trusted manufacturers.',
    color: 'from-orange-400 to-[#fe6603]'
  },
  {
    icon: <Truck className="w-8 h-8 text-white" />,
    title: 'Lightning Fast Delivery',
    desc: 'Our optimized logistics network ensures your orders reach you in record time.',
    color: 'from-green-400 to-[#036e26]'
  },
  {
    icon: <Headphones className="w-8 h-8 text-white" />,
    title: '24/7 Customer Support',
    desc: 'Our dedicated team is always available to help you with any queries or concerns.',
    color: 'from-blue-400 to-blue-600'
  }
];

export function AboutPage() {
  return (
    <div className="bg-white min-h-screen pb-20 md:pb-0 font-sans">
      <Header variant="back" title="About Us" />

      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80" 
          alt="About Us Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="max-w-[1400px] w-full mx-auto px-6 md:px-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                Redefining Your <br/><span className="text-[#fe6603]">Shopping Experience</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium">
                Discover a world of premium products, unbeatable prices, and seamless delivery. Welcome to Indbasket.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-16 md:py-24">
        
        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-[#fe6603] font-bold text-sm tracking-wider uppercase mb-2">
              <Target className="w-4 h-4" /> Our Vision
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Quality & Trust <br/>at our core.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to <strong className="text-gray-900 font-extrabold">Indbasket</strong>. Our journey began with a simple yet powerful vision: to bridge the gap between quality products and seamless convenience.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We understand that trust is the foundation of a great shopping experience. That's why we meticulously source our products from top brands across the country. Whether it's electronics, fashion, or home essentials, we ensure that every item meets the highest standards.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div>
                <h4 className="text-3xl font-extrabold text-[#036e26] mb-1">1M+</h4>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Happy Customers</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-[#fe6603] mb-1">50k+</h4>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Products Available</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[600px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" 
              alt="Our Story" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <HeartHandshake className="w-12 h-12 mb-4 text-white opacity-90" />
              <h3 className="text-2xl font-bold mb-2">Built for you</h3>
              <p className="text-gray-200">We are not just selling products; we are building lasting relationships.</p>
            </div>
          </motion.div>
        </div>

        {/* Our Core Values */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">The Indbasket Promise</h2>
          <p className="text-lg text-gray-500">We hold ourselves to the highest standards to ensure your complete satisfaction with every purchase.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-50 hover:bg-white rounded-3xl p-8 border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${val.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {val.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
              <p className="text-gray-600 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
