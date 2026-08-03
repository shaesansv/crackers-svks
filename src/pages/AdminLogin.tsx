import React, { useState } from 'react';

interface AdminLoginProps {
  setCurrentPage: (p: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ setCurrentPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        setCurrentPage('admin-dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Cannot connect to admin server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center min-h-[70vh] bg-gray-50/50 py-12 px-6 relative select-none">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] p-8 relative z-10 animate-fade-in">
        
        {/* Banner strip */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#7C3AED] to-[#EA580C] rounded-t-[24px]"></div>

        {/* Card Header */}
        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-extrabold font-poppins text-dark-navy">Admin Portal</h2>
          <p className="text-xs text-gray-400 mt-1 font-medium font-inter">Sign in to manage products and pricing</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-[14px] bg-red-50 border border-red-100 text-red-600 text-xs font-semibold text-center leading-normal animate-shake">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 font-inter">
          {/* Username Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Username</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full py-3.5 pl-10 pr-4 border border-gray-200 rounded-[14px] text-sm bg-gray-50/30 focus:bg-white text-dark-navy outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-100"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-3.5 pl-10 pr-4 border border-gray-200 rounded-[14px] text-sm bg-gray-50/30 focus:bg-white text-dark-navy outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-100"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 py-3.5 rounded-[14px] text-white font-bold text-sm font-poppins transition-all duration-300 shadow-md ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-violet-600 hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
