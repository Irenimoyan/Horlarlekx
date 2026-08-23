import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { ShieldCheck, Target, Eye, Award, CheckCircle2, ArrowRight, MapPin, Building2, HardHat } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Page Header */}
        <div className="py-8 border-b border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <Badge variant="orange">Company History & Values</Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight">
              About HORLARS SERVICES
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              Building Excellence across Nigeria through modern architectural facades, ACP cladding, corporate signage, aluminium, glass, and turnkey general contracting.
            </p>
          </div>
          <div className="shrink-0 bg-white p-2.5 rounded-2xl shadow-2xl border border-brand-orange/40">
            <img
              src="/logo.jpg"
              alt="HORLARS SERVICES Logo"
              className="h-16 sm:h-20 w-auto object-contain rounded-xl"
            />
          </div>
        </div>

        {/* 1. Company Story */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="orange">Our Origin & Identity</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Company Story
            </h2>
            <div className="h-1 w-16 bg-brand-orange rounded-full" />

            <p className="text-slate-300 text-base leading-relaxed">
              <strong className="text-white">HORLARLEKX Exterior Cladding Services</strong> was established to provide clients with reliable and professional solutions for building construction, exterior finishing, architectural enhancement and corporate branding.
            </p>

            <p className="text-slate-300 text-base leading-relaxed">
              The company developed its services around the growing demand for modern building facades, quality cladding, professional signage, aluminium and glass works, roofing, interior finishing and general construction solutions across Lagos, Ogun State, and major urban centers in Nigeria.
            </p>

            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Legal & Trading Entity</span>
              </div>
              <p className="text-xs text-slate-300">
                Registered/Legal Entity: <span className="text-white font-semibold">{companyInfo.legalName}</span><br />
                Trading & Brand Name: <span className="text-white font-semibold">{companyInfo.brandName}</span><br />
                Official Tagline: <span className="text-brand-orange font-bold font-mono">{companyInfo.tagline}</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-navy-700">
              <img
                src="/hero-bg.jpg"
                alt="HORLARLEKX Exterior Cladding Project"
                className="w-full h-[400px] object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* 2. Mission & Vision */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-navy-800">
          {/* Mission Card */}
          <div className="bg-navy-900/90 rounded-2xl p-8 border border-navy-800 hover:border-brand-orange/50 transition-all shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/20 text-brand-orange flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <Badge variant="orange" size="sm">Our Mission</Badge>
            <h3 className="text-2xl font-bold text-white font-heading">Mission Statement</h3>
            <p className="text-slate-300 text-base leading-relaxed italic">
              "{companyInfo.description ? "To provide high-quality construction, exterior finishing, cladding, signage and architectural solutions through professional workmanship, quality materials, innovative designs and reliable service." : ""}"
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-navy-900/90 rounded-2xl p-8 border border-navy-800 hover:border-brand-orange/50 transition-all shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-navy-800 text-brand-orange flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <Badge variant="navy" size="sm">Our Vision</Badge>
            <h3 className="text-2xl font-bold text-white font-heading">Vision Statement</h3>
            <p className="text-slate-300 text-base leading-relaxed italic">
              "To become a leading and trusted construction, exterior cladding and architectural finishing company in Nigeria, recognized for quality, innovation, professionalism and customer satisfaction."
            </p>
          </div>
        </div>

        {/* 3. Core Values (10 Values Grid) */}
        <div className="py-16 border-t border-navy-800">
          <SectionHeader
            badgeText="Foundational Ethics"
            title="Our 10 Core Values"
            subtitle="The principles that guide every design, fabrication, and installation carried out by HORLARLEKX."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {companyInfo.values.map((val, idx) => (
              <div
                key={idx}
                className="bg-navy-900 p-5 rounded-xl border border-navy-800 hover:border-brand-orange/60 transition-all shadow-md group"
              >
                <div className="w-8 h-8 rounded-lg bg-navy-950 text-brand-orange flex items-center justify-center font-bold text-xs mb-3 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <h4 className="text-base font-bold text-white font-heading group-hover:text-brand-orange transition-colors">
                  {val.title}
                </h4>
                <p className="mt-2 text-slate-300 text-xs leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Offices & Operations */}
        <div className="py-16 border-t border-navy-800">
          <SectionHeader
            badgeText="Regional Presence"
            title="Our Operating Bases"
            subtitle="Headquartered to serve Lagos State, Ogun State, and commercial hubs nationwide."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companyInfo.offices.map((office) => (
              <div key={office.id} className="bg-navy-900 p-8 rounded-2xl border border-navy-800 space-y-4">
                <div className="flex items-center space-x-2 text-brand-orange">
                  <MapPin className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase font-bold tracking-wider">{office.state}</span>
                </div>
                <h3 className="text-xl font-bold text-white font-heading">{office.name}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{office.address}</p>
                <div className="pt-2">
                  <Button to="/contact" variant="outline" size="sm">
                    Contact {office.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 p-8 rounded-2xl bg-navy-900 border border-brand-orange/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Partner With HORLARLEKX Today</h3>
            <p className="text-slate-300 text-sm mt-1">Get an expert assessment and quotation for your building project.</p>
          </div>
          <Button to="/quote" variant="primary" size="md" icon={ArrowRight} iconPosition="right">
            REQUEST A QUOTE
          </Button>
        </div>

      </div>
    </div>
  );
}
