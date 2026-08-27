import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';
import Button from './Button';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle architectural background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800">
          
          {/* Column 1: Company Profile */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group inline-flex">
              <div className="bg-white p-1 rounded-xl shadow-lg border border-brand-orange/40 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="HORLARS SERVICES Logo"
                  className="h-10 w-auto object-contain rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight">
                  HORLARS SERVICES
                </span>
                <span className="text-xs font-semibold text-brand-orange tracking-wider uppercase">
                  {companyInfo.tagline}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {companyInfo.description}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-navy-900 border border-navy-800 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Certified Exterior Facade & Cladding Solutions</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="pt-3 flex items-center space-x-3">
              <a
                href={companyInfo.socials.tiktok.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-md bg-navy-900 hover:bg-brand-orange text-xs text-slate-200 hover:text-white border border-navy-800 transition-colors flex items-center space-x-1.5"
                title="Follow HORLARLEKX on TikTok"
              >
                <span>TikTok: @{companyInfo.socials.tiktok.handle}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-heading border-l-2 border-brand-orange pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Our Services', path: '/services' },
                { name: 'Recent Projects', path: '/projects' },
                { name: 'Our Team', path: '/team' },
                { name: 'Company Blog', path: '/blog' },
                { name: 'Careers', path: '/careers' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-accent transition-colors flex items-center space-x-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-brand-orange opacity-70" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Core Specialties */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-heading border-l-2 border-brand-orange pl-2.5">
              Specialties
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'ACP Cladding (ALUCOBOND)', path: '/services/acp-cladding-panels' },
                { name: 'Building Facade Solutions', path: '/services/building-facade-solutions' },
                { name: 'Pylon & 3D Signage', path: '/services/pylon-signs' },
                { name: 'Aluminium & Glass', path: '/services/glass-installation' },
                { name: 'Glass Railings', path: '/services/glass-railings' },
                { name: 'Aluminium Roofing', path: '/services/aluminium-roofing' },
                { name: 'Carpentry & Furniture', path: '/services/carpentry-works' },
                { name: 'General Contracting', path: '/services/general-contracting' },
              ].map((service, idx) => (
                <li key={idx}>
                  <Link
                    to={service.path}
                    className="text-slate-400 hover:text-accent transition-colors flex items-center space-x-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-brand-orange opacity-70" />
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-heading border-l-2 border-brand-orange pl-2.5">
              Direct Contact
            </h4>
            <div className="space-y-3.5 text-sm">
              <div>
                <span className="text-xs font-bold text-brand-orange uppercase block mb-1">
                  Lagos Office
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {companyInfo.offices[0].address}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-brand-orange uppercase block mb-1">
                  Ogun Office
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {companyInfo.offices[1].address}
                </p>
              </div>

              <div className="pt-1 space-y-2">
                <a
                  href={`tel:${companyInfo.contacts.phone}`}
                  className="flex items-center space-x-2 text-slate-200 hover:text-brand-orange text-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                  <span>{companyInfo.contacts.phoneFormatted}</span>
                </a>
                <a
                  href={`mailto:${companyInfo.contacts.email}`}
                  className="flex items-center space-x-2 text-slate-200 hover:text-brand-orange text-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                  <span className="truncate">{companyInfo.contacts.email}</span>
                </a>
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Hours: <span className="font-mono text-amber-400">{companyInfo.contacts.hours}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 <span className="text-slate-300 font-bold">HORLARLEKX Exterior Services</span>. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <span>Trading as HORLARLEKX EXTERIOR SERVICES</span>
            <span>•</span>
            <Link to="/faq" className="hover:text-brand-orange transition-colors">FAQ</Link>
            <span>•</span>
            <Link to="/quote" className="hover:text-brand-orange transition-colors font-semibold text-brand-orange">
              Request Quotation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
