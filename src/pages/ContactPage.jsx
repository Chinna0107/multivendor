import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Mail, Phone, MapPin, Send, Package, RefreshCcw, CreditCard, HelpCircle, MessageSquare } from 'lucide-react';

export function ContactPage() {
  const helpTopics = [
    { icon: Package, title: 'I want help with my orders', desc: 'Track, cancel or return orders' },
    { icon: RefreshCcw, title: 'I want help with returns & refunds', desc: 'Manage your return requests' },
    { icon: CreditCard, title: 'I want help with payment', desc: 'Payment issues, refunds' },
    { icon: HelpCircle, title: 'I want help with other issues', desc: 'Offers, account, etc.' }
  ];

  return (
    <div className="bg-brand-green min-h-screen pb-24 md:pb-16 font-sans">
      <Header title="Help Center" />
      
      {/* Top Banner */}
      <div className="bg-brand-green text-white py-10 md:py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Indbasket Help Center</h1>
          <p className="text-sm md:text-base text-green-100">We are here to help you 24x7. How can we assist you today?</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Help Topics */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Help Topics</h2>
              </div>
              <div className="flex flex-col">
                {helpTopics.map((topic, index) => (
                  <button key={index} className="flex items-start gap-4 p-4 border-b border-gray-50 hover:bg-orange-50 transition-colors text-left group">
                    <topic.icon className="w-5 h-5 text-[#fe6603] mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#fe6603] transition-colors">{topic.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{topic.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Contact Info Card */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Direct Contact</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#fe6603] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800 mb-0.5">Corporate Office</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      1-1-738, Vinayaka temple road,<br/>
                      Koratla, Telangana, India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#fe6603] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800 mb-0.5">Customer Support</p>
                    <p className="text-xs text-gray-600">+91 90326 75205</p>
                    <p className="text-[10px] text-gray-500">Mon-Sat, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#fe6603] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800 mb-0.5">Email</p>
                    <p className="text-xs text-gray-600">indbasket@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="w-full lg:w-2/3 flex flex-col">
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <MessageSquare className="w-6 h-6 text-brand-orange" />
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Still need help? Write to us.</h2>
              </div>
              
              <form className="space-y-6 flex-1 flex flex-col" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded border border-gray-200 text-sm focus:outline-none focus:border-[#fe6603] transition-colors bg-gray-50 focus:bg-white" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded border border-gray-200 text-sm focus:outline-none focus:border-[#fe6603] transition-colors bg-gray-50 focus:bg-white" placeholder="john@example.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Subject / Order ID</label>
                  <input type="text" className="w-full px-4 py-3 rounded border border-gray-200 text-sm focus:outline-none focus:border-[#fe6603] transition-colors bg-gray-50 focus:bg-white" placeholder="What is this regarding?" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Description</label>
                  <textarea className="w-full flex-1 min-h-[150px] px-4 py-3 rounded border border-gray-200 text-sm focus:outline-none focus:border-[#fe6603] transition-colors bg-gray-50 focus:bg-white resize-none" placeholder="Please describe your issue in detail..."></textarea>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#fe6603] text-white font-bold py-3.5 px-8 rounded shadow-sm hover:shadow-md hover:bg-orange-600 transition-all flex items-center justify-center gap-2 mt-auto w-full md:w-auto md:self-end"
                >
                  <Send className="w-4 h-4" />
                  Submit Request
                </motion.button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
