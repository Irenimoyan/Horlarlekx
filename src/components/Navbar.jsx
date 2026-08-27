import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';
import Button from './Button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full max-w-full">
      {/* Top bar */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 border-b border-navy-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a 
              href={`tel:${companyInfo.contacts.phone}`} 
              className="flex items-center space-x-1.5 hover:text-cyan transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-cyan" />
              <span>{companyInfo.contacts.phoneFormatted}</span>
            </a>
            <a 
              href={`mailto:${companyInfo.contacts.email}`} 
              className="flex items-center space-x-1.5 hover:text-cyan transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-cyan" />
              <span>{companyInfo.contacts.email}</span>
            </a>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan" />
              <span>Lagos & Ogun State, Nigeria</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">Certified Cladding & Construction</span>
            </span>
            <span className="text-slate-600">|</span>
            <a 
              href={companyInfo.socials.tiktok.url} 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-cyan font-medium transition-colors"
            >
              TikTok: @{companyInfo.socials.tiktok.handle}
            </a>
          </div>
        </div>
      </div>

      {/* Main sticky navigation bar */}
      <div className={`transition-all duration-300 ${isScrolled ? 'glass-nav py-3 shadow-navy-lg' : 'bg-navy-900/90 backdrop-blur-md py-4 border-b border-navy-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Branding */}
          <Link to="/" className="flex items-center space-x-3 group min-w-0">
            <div className="bg-white p-1 rounded-xl shadow-lg border border-cyan/40 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center shrink-0">
              <img
                src="/logo.jpg"
                alt="HORLARS SERVICES Logo"
                className="h-9 sm:h-10 md:h-11 w-auto object-contain rounded-lg"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base sm:text-lg md:text-xl text-white tracking-tight leading-tight group-hover:text-cyan transition-colors truncate">
                HORLARS SERVICES
              </span>
              <span className="text-[10px] md:text-[11px] font-semibold text-cyan tracking-wider uppercase truncate">
                {companyInfo.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-white bg-navy-800 border-b-2 border-cyan font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-navy-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button to="/quote" variant="primary" size="md">
              REQUEST A QUOTE
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-cyan"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-cyan" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-navy-950/98 backdrop-blur-xl border-b border-navy-800 p-6 shadow-2xl transition-all duration-300 max-h-[calc(100vh-60px)] overflow-y-auto w-full max-w-full text-slate-100">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-cyan text-white'
                    : 'text-slate-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>
            ))}

            <div className="pt-4 border-t border-navy-800 space-y-3">
              <Button to="/quote" variant="primary" size="lg" className="w-full">
                REQUEST A QUOTE
              </Button>
              
              <div className="p-4 rounded-lg bg-navy-900 border border-navy-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Phone className="w-4 h-4 text-cyan" />
                  <a href={`tel:${companyInfo.contacts.phone}`} className="hover:text-cyan">
                    {companyInfo.contacts.phoneFormatted}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan" />
                  <a href={`mailto:${companyInfo.contacts.email}`} className="hover:text-cyan truncate">
                    {companyInfo.contacts.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
