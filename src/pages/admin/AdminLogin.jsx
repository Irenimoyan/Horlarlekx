import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldAlert, ArrowLeft, Loader2, Building2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // If already logged in, redirect immediately
  if (currentUser) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-cyan selection:text-white">
      
      {/* Back to website button */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-cyan transition-colors bg-navy-900/80 px-3.5 py-2 rounded-xl border border-cyan/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to HORLAR SERVICES Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Brand Icon & Heading */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan via-primary to-accent flex items-center justify-center text-white shadow-2xl shadow-cyan/30 border border-cyan/30">
            <img src="../public/logo.jpg" alt="logo" />
          </div>
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
          HORLAR SERVICES
        </h2>
        <p className="mt-1 text-center text-xs font-bold uppercase tracking-widest text-cyan font-mono">
          ADMINISTRATOR LOGIN
        </p>

      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#004880] py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-cyan/30 backdrop-blur-xl">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 flex items-start space-x-3 text-red-200 text-xs leading-relaxed animate-shake">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-red-300">Authentication Error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-mono">
                Administrator Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Johndoe@gmail.com"
                  className="block w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-mono">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-cyan/50 rounded-xl shadow-lg text-sm font-bold text-white bg-cyan hover:bg-cyan-hover focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In to Admin Dashboard</span>
                )}
              </button>
            </div>

          </form>

          <div className="mt-6 pt-6 border-t border-navy-800 text-center">
            <p className="text-[11px] text-slate-400">
              Protected Administrator Area.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
