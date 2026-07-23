import React, { useState, useEffect } from 'react';
import { Wallet, IndianRupee, Landmark, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function VendorWalletPage() {
  const [vendor, setVendor] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchWallet = fetch(`${BACKEND_URL}/vendorAuth/me`, { headers }).then(r => r.json());
    const fetchTxns = fetch(`${BACKEND_URL}/vendor/transactions`, { headers }).then(r => r.json());

    Promise.all([fetchWallet, fetchTxns])
      .then(([walletData, txnData]) => {
        if (walletData.vendor) setVendor(walletData.vendor);
        setTransactions(txnData.transactions || []);
      })
      .catch(() => toast.error('Failed to load wallet data'))
      .finally(() => setLoading(false));
  }, []);

  const totalCredits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const totalDebits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Virtual Wallet</h1>
        <p className="text-gray-500 mt-1">Track your earnings, payouts, and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
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
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <ArrowDownLeft className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Earned</p>
            <h3 className="text-2xl font-bold text-green-600">
              {loading ? '...' : `₹${totalCredits.toLocaleString()}`}
            </h3>
          </div>
        </div>

        {/* Total Payouts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
            <ArrowUpRight className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Payouts</p>
            <h3 className="text-2xl font-bold text-red-500">
              {loading ? '...' : `₹${totalDebits.toLocaleString()}`}
            </h3>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 font-medium">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-1">Earnings from customer orders will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map(txn => (
              <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${txn.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {txn.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {txn.type === 'credit' ? 'Order Earning' : 'Payout'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {txn.order_number && <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium mr-2">{txn.order_number}</span>}
                      {txn.description || ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-base ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{parseFloat(txn.amount || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(txn.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
