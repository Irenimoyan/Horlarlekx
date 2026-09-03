import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { currentUser, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-cyan border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-300 font-sans">Verifying Administrator Permissions...</p>
      </div>
    );
  }

  // Not authenticated -> Redirect to Admin Login
  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated user but NOT an authorized administrator -> Show Unauthorized Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#003F73] text-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-cyan selection:text-white">
        <div className="max-w-md w-full bg-[#004880] p-8 rounded-3xl border border-red-500/40 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-inner border border-red-500/30">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white font-heading tracking-tight">
              Access Restricted
            </h1>
            <p className="text-slate-200 text-sm leading-relaxed">
              You do not have permission to access the HORLARLEKX Admin Dashboard.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 text-xs font-mono space-y-1 text-left">
            <div className="flex justify-between items-center text-slate-400">
              <span>Account:</span>
              <span className="text-slate-200 font-bold">{currentUser?.email || 'Authenticated User'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Status:</span>
              <span className="text-red-400 font-bold">Unauthorized Admin</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/"
              className="w-full py-3 px-4 rounded-xl bg-cyan hover:bg-cyan-hover text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center space-x-2 border border-cyan/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Website</span>
            </Link>

            <button
              onClick={logout}
              className="w-full py-3 px-4 rounded-xl bg-navy-950 hover:bg-navy-900 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 border border-navy-800"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out & Try Authorized Email</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated & Authorized Administrator
  return children;
}
