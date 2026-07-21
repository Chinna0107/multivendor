import React from 'react';
import { Header } from '../components/Header';
import { RefreshCcw, ShieldAlert, CreditCard, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ReturnsPolicyPage() {
  return (
    <div className="bg-brand-green min-h-screen pb-24 md:pb-16 font-sans">
      <Header title="Returns & Exchanges" />
      
      {/* Top Banner */}
      <div className="bg-brand-green text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Returns & Exchanges</h1>
          <p className="text-sm md:text-base text-green-100 max-w-2xl mx-auto">
            Not completely satisfied? We're here to help make it right with our simple return process.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-10 space-y-8">
          
          <section>
            <div className="flex items-center gap-3 mb-4">
              <RefreshCcw className="w-6 h-6 text-[#fe6603]" />
              <h2 className="text-xl font-bold text-gray-900">Return Window</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              We offer a 7-day return policy for most items. If 7 days have gone by since your purchase was delivered, unfortunately, we cannot offer you a refund or exchange. To be eligible for a return, your item must be unused, unsealed, and in the exact same condition that you received it. It must also be in the original packaging.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-[#fe6603]" />
              <h2 className="text-xl font-bold text-gray-900">Non-Returnable Items</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Several types of goods are exempt from being returned due to hygiene, safety, and brand policies:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>Perishable goods, intimate apparel, sanitary goods, or hazardous materials.</li>
              <li>Certain electronics if the seal is broken or if they have been activated/installed.</li>
              <li>Items purchased during clearance sales or special festive offers (unless damaged).</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-[#fe6603]" />
              <h2 className="text-xl font-bold text-gray-900">Refunds</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
              If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 5-7 business days.
            </p>
          </section>

          <div className="mt-10 p-6 bg-orange-50 border border-orange-100 rounded-lg text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to initiate a return?</h3>
            <p className="text-sm text-gray-600 mb-4">Reach out to our support team and we'll guide you through the process.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#fe6603] text-white font-bold py-2.5 px-6 rounded hover:bg-orange-600 transition-colors">
              <HelpCircle className="w-4 h-4" />
              Contact Support
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
