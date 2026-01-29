'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage for API calls
        const token = data.token;

        // Store in localStorage for dashboard API calls
        try {
          localStorage.setItem('auth-token', token);
        } catch (error) {
          console.error('LocalStorage error:', error);
        }

        // Add small delay to ensure storage is set
        setTimeout(() => {
          router.push('/hot_admin/dashboard');
        }, 100);

      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0E0E0E] font-inter">

      {/* Brand Logo */}
      <div className="mb-8 relative w-64 h-24 md:w-96 md:h-32">
        <Image
          src="/assets/logo.png"
          alt="CyberX Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-[14px] shadow-lg p-8 md:p-12 border border-white/5">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-2 tracking-tight">
            CyberX Admin Access
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#A0A0A0] block">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              required
              className="w-full bg-[#181818] border border-[#333333] rounded-lg px-4 py-3 text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#E6C200] transition-colors duration-200"
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#A0A0A0] block">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              required
              className="w-full bg-[#181818] border border-[#333333] rounded-lg px-4 py-3 text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#E6C200] transition-colors duration-200"
              placeholder="Enter password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E6C200] hover:bg-[#d4b200] text-black font-semibold rounded-lg py-3 px-4 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-[#555555]">
            For authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
