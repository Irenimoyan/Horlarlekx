import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  PlusCircle, 
  Users,
  UserPlus,
  Image as ImageIcon, 
  ShieldCheck,
  Settings, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  Building2
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Add Project', path: '/admin/projects/new', icon: PlusCircle },
    { label: 'Team Members', path: '/admin/team', icon: Users },
    { label: 'Add Team Member', path: '/admin/team/new', icon: UserPlus },
    { label: 'Media', path: '/admin/media', icon: ImageIcon },
    { label: 'Administrators', path: '/admin/administrators', icon: ShieldCheck },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path) && (path !== '/admin' || location.pathname === '/admin');
  };

  return (
    <div className="min-h-screen bg-[#003F73] text-slate-100 flex flex-col font-sans selection:bg-cyan selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#004880] border-b border-cyan/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-cyan/20 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/admin" className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan flex items-center justify-center text-white font-black text-lg shadow-md">
                  <img src="../public/logo.jpg" alt="logo" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-extrabold text-white font-heading leading-tight tracking-tight uppercase">
                    HORLAR SERVICES
                  </h1>
                  <span className="text-[10px] font-bold tracking-widest text-cyan uppercase block">
                    ADMIN DASHBOARD
                  </span>
                </div>
              </Link>
            </div>

            {/* Right side user info & logout */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link 
                to="/" 
                target="_blank" 
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-navy-900 border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Website</span>
              </Link>

              <div className="hidden sm:flex items-center space-x-2 bg-navy-900/80 px-3 py-1.5 rounded-full border border-cyan/30">
                <ShieldCheck className="w-4 h-4 text-cyan" />
                <span className="text-xs font-medium text-slate-200 truncate max-w-[160px]">
                  {currentUser?.email || 'Admin'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-[#004880] rounded-2xl border border-cyan/20 p-4 space-y-6 shadow-xl">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan px-3 block mb-2 font-mono">
                Navigation Menu
              </span>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        active
                          ? 'bg-cyan text-white shadow-md'
                          : 'text-slate-300 hover:text-white hover:bg-navy-900/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-cyan'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-navy-800">
              <Link
                to="/"
                target="_blank"
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Visit Public Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-600/80 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 w-72 max-w-full bg-[#004880] p-6 shadow-2xl flex flex-col justify-between border-r border-cyan/30">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-navy-800 pb-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-6 h-6 text-cyan" />
                    <span className="font-bold text-white text-sm font-heading">ADMIN MENU</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path, item.exact);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-cyan text-white shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-navy-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-cyan'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-navy-800 space-y-2">
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-navy-900"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Public Site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}
