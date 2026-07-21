import React, { useState } from 'react';
import { Header } from '../components/Header';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Placing an order is simple! Browse our categories, add your desired products to the cart, and proceed to checkout. You can securely pay using various payment methods."
  },
  {
    question: "Do you offer cash on delivery (COD)?",
    answer: "Currently, we accept prepaid orders only to ensure contactless and safe delivery of your items. We support all major Credit/Debit cards, UPI, and Net Banking."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with the tracking details. You can also log into your account and check the 'My Orders' section for real-time updates."
  },
  {
    question: "Can I cancel my order?",
    answer: "Orders can be cancelled before they are dispatched. Once an order is shipped, it cannot be cancelled. Please contact our support team immediately if you need to cancel an order."
  },
  {
    question: "Are your products authentic?",
    answer: "Yes, absolutely! We source all our electronics, fashion, and home products directly from trusted brands and verified vendors to ensure you receive 100% authentic items."
  }
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="bg-brand-green min-h-screen pb-24 md:pb-16 font-sans">
      <Header title="FAQs" />
      
      {/* Top Banner */}
      <div className="bg-brand-green text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Frequently Asked Questions</h1>
          <p className="text-sm md:text-base text-green-100 max-w-2xl mx-auto">
            Find answers to the most common questions about shopping with Indbasket.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <HelpCircle className="w-6 h-6 text-[#fe6603]" />
            <h2 className="text-xl font-bold text-gray-900">Common Queries</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={cn(
                  "border rounded-lg overflow-hidden transition-all duration-200",
                  openIndex === index ? "border-[#fe6603] shadow-sm" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-bold text-gray-900 text-sm pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-[#fe6603] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="p-4 pt-0 bg-white">
                    <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
