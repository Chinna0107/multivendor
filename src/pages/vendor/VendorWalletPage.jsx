import React, { useState, useEffect } from 'react';
import { Wallet, IndianRupee, RefreshCw, Landmark } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function VendorWalletPage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('vendor_token');
      const res = await fetch(`${BACKEND_URL}/vendorAuth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.vendor) {
        setVendor(data.vendor);
      }
    } catch (error) {
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Virtual Wallet</h1>
        <p className="text-gray-500 mt-1">Track your earnings and pending payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#fe6603] to-[#e55c00] p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="w-8 h-8 opacity-80" />
              <span className="text-lg font-medium opacity-90">Available Balance</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <IndianRupee className="w-8 h-8 opacity-90" />
              <h2 className="text-5xl font-bold tracking-tight">
                {loading || !vendor ? '...' : parseFloat(vendor.wallet_balance || 0).toLocaleString()}
              </h2>
            </div>
            
            <p className="mt-8 text-sm opacity-80 max-w-sm leading-relaxed">
              This balance reflects your earnings from delivered orders. Payouts are automatically processed to your registered bank account on the 1st and 15th of every month.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <Landmark className="w-16 h-16 text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Bank Details</h3>
          <p className="text-gray-500 mb-6 max-w-xs">
            Your earnings will be securely transferred to the bank account associated with your vendor profile.
          </p>
          <button className="px-6 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
            Update Bank Details
          </button>
        </div>
      </div>
    </div>
  );
}
