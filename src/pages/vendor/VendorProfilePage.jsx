import React, { useState, useEffect } from 'react';
import { User, Store, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function VendorProfilePage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
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
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading profile...</div>;
  }

  if (!vendor) {
    return <div className="py-12 text-center text-gray-500">Profile data not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Profile</h1>
        <p className="text-gray-500 mt-1">View your store and personal details.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover & Avatar */}
        <div className="h-32 bg-gradient-to-r from-[#fe6603] to-[#ff8c42]"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border-4 border-white flex items-center justify-center text-[#fe6603]">
              <Store className="w-10 h-10" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize border ${
              vendor.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
              vendor.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              {vendor.status} Status
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{vendor.store_name}</h2>
              <p className="text-gray-500 text-sm">Joined {new Date(vendor.created_at).toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-2">Owner Information</h3>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Full Name</p>
                    <p className="font-medium text-gray-900">{vendor.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email Address</p>
                    <p className="font-medium text-gray-900">{vendor.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone Number</p>
                    <p className="font-medium text-gray-900">{vendor.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-2">Business Information</h3>
                
                <div className="flex items-start gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Store Address</p>
                    <p className="font-medium text-gray-900 leading-snug mt-0.5">{vendor.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button className="px-6 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                Request Details Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
