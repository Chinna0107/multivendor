import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Flower2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, verifyOtp, loading, error } = useAuthStore();

  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState('');
  const otpRefs = useRef([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError('');
    const res = await signup(form.name, form.email, form.phone, form.password);
    if (res.success) setStep('otp');
    else setLocalError(res.error);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError('');
    const code = otp.join('');
    if (code.length < 6) return setLocalError('Enter all 6 digits');
    const res = await verifyOtp(form.email, code);
    if (res.success) navigate('/');
    else setLocalError(res.error);
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-brand-green flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-2">
            <Flower2 className="w-7 h-7 text-brand-orange" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
          <p className="text-xs text-gray-500 mt-1">Join Indbasket</p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
              <input
                name="name" value={form.name} onChange={handleChange} required
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Phone</label>
              <input
                name="phone" value={form.phone} onChange={handleChange} required
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} required minLength={6}
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {displayError && <p className="text-xs text-red-500 text-center">{displayError}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl text-sm hover:bg-orange-600 transition-colors disabled:opacity-60">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">OTP sent to</p>
              <p className="font-semibold text-gray-900">{form.email}</p>
            </div>
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  className="w-10 h-12 text-center text-lg text-gray-900 font-bold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-gray-50 focus:bg-white"
                />
              ))}
            </div>

            {displayError && <p className="text-xs text-red-500 text-center">{displayError}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl text-sm hover:bg-orange-600 transition-colors disabled:opacity-60">
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <button type="button" onClick={() => setStep('form')}
              className="w-full text-xs text-gray-500 hover:text-gray-700">
              ← Change details
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-orange font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
