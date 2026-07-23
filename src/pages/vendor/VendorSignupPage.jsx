import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Store, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.jpeg';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function VendorSignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    storeName: '',
    storeAddress: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Submit initial application & send OTP
      setLoading(true);
      try {
        const payload = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          store_name: formData.storeName,
          address: formData.storeAddress
        };

        const res = await fetch(`${BACKEND_URL}/vendorAuth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to sign up');

        setStep(3);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      // Verify OTP
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/vendorAuth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp: formData.otp })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to verify OTP');

        toast.success("Application verified! We will review your request and notify you once approved.");
        navigate('/vendor-login');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img src={logo} alt="Indbasket" className="h-12 mx-auto mix-blend-multiply" />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Store className="w-6 h-6 text-[#fe6603]" />
            <h1 className="text-3xl font-bold text-gray-900">Become a Vendor</h1>
          </div>
          <p className="text-gray-500">Apply to sell your products on Indbasket</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#fe6603]/10">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-[#fe6603] text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
            <div className={`w-12 sm:w-16 h-1 mx-2 rounded-full ${step >= 2 ? 'bg-[#fe6603]' : 'bg-gray-100'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-[#fe6603] text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
            <div className={`w-12 sm:w-16 h-1 mx-2 rounded-full ${step >= 3 ? 'bg-[#fe6603]' : 'bg-gray-100'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 3 ? 'bg-[#fe6603] text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#fe6603] focus:border-transparent" placeholder="John" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#fe6603] focus:border-transparent" placeholder="Doe" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#fe6603] focus:border-transparent" placeholder="vendor@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#fe6603] focus:border-transparent" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#fe6603] focus:border-transparent" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Store/Business Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Store className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#fe6603] focus:border-transparent" placeholder="My Awesome Store" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Address</label>
                  <textarea name="storeAddress" value={formData.storeAddress} onChange={handleChange} required rows={3} className="block w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#fe6603] focus:border-transparent resize-none" placeholder="Enter complete business address" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                 <ShieldCheck className="w-16 h-16 text-[#fe6603] mx-auto mb-4" />
                 <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
                 <p className="text-gray-500 text-sm">We've sent a 6-digit OTP to <strong>{formData.email}</strong>. Enter it below to verify your application.</p>
                 
                 <div className="pt-4 max-w-xs mx-auto">
                    <input 
                      type="text" 
                      name="otp" 
                      value={formData.otp} 
                      onChange={handleChange} 
                      required 
                      maxLength={6}
                      className="block w-full text-center tracking-[0.5em] font-bold text-2xl py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#fe6603] focus:border-transparent" 
                      placeholder="------" 
                    />
                 </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step === 2 && (
                <button type="button" disabled={loading} onClick={() => setStep(1)} className="px-6 py-3.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                  Back
                </button>
              )}
              {step === 3 && (
                <button type="button" disabled={loading} onClick={() => { setStep(2); setFormData(p => ({...p, otp: ''})); }} className="px-6 py-3.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-[#fe6603] text-white py-3.5 rounded-xl font-medium hover:bg-[#e55c00] transition-colors disabled:opacity-50">
                {loading ? 'Processing...' : (step === 1 ? 'Continue' : (step === 2 ? 'Send OTP' : 'Verify & Submit'))} 
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </form>

          {step < 3 && (
            <p className="mt-8 text-center text-gray-600">
              Already have a vendor account?{' '}
              <Link to="/vendor-login" className="text-[#fe6603] font-medium hover:underline">
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
