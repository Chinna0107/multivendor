import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/logo.jpeg';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    const res = await login(form.email, form.password);
    if (res.success) navigate(res.role === 'admin' ? '/admin' : '/');
    else setLocalError(res.error);
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Indbasket" className="h-16 object-contain mix-blend-multiply" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange} required
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all bg-gray-50 hover:bg-white focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                name="password" type={showPass ? 'text' : 'password'} value={form.password}
                onChange={handleChange} required
                placeholder="Your password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all bg-gray-50 hover:bg-white focus:bg-white pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-orange transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {displayError && (
            <div className="bg-red-50 text-red-500 text-xs font-semibold px-3 py-2 rounded-lg border border-red-100 text-center">
              {displayError}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-brand-orange to-brand-green text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg hover:from-[#e55c02] hover:to-[#02561d] transition-all disabled:opacity-60 disabled:hover:shadow-md mt-2 hover:-translate-y-0.5">
            {loading ? 'Logging in...' : 'Login Securely'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-green font-bold hover:underline underline-offset-2">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
