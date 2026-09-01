import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import Breadcrumbs from '../components/Breadcrumbs';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { HardHat, Send, CheckCircle2 } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

export default function CareersPage() {
  const [state, handleSubmit, reset] = useForm('xdeogkjp');

  return (
    <div className="pt-28 pb-20 section-double-bg-blue text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Careers' }]} />

        <div className="py-8 border-b border-navy-800">
          <Badge variant="orange">Craftsmanship Opportunities</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight mt-3">
            Build Your Future With HORLARLEKX
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            HORLARLEKX Exterior Services works with skilled professionals, technicians, and craft specialists across construction and finishing disciplines.
          </p>
        </div>

        <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Side */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-bold text-white font-heading">Why Work With Us?</h2>
            <div className="h-1 w-16 bg-brand-orange rounded-full" />

            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                We believe exceptional architectural facades and building finishes are built by exceptional technicians. We provide a safety-first, professional environment where craftsmanship is respected and rewarded.
              </p>
              
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 font-mono block">CURRENT VACANCIES STATUS:</span>
                <p className="text-xs text-slate-300">
                  Specific vacancy listings are <span className="font-mono text-amber-400">To be provided</span>. However, we accept continuous open applications from qualified trade professionals.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-heading">Trade Disciplines We Hire:</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'ACP Cladding Installers',
                  'Aluminium Fabricators',
                  'Glass Installation Technicians',
                  'Structural Steel Welders',
                  'Signage & Pylon Specialists',
                  'Master Carpenters',
                  'Aluminium Roofing Technicians',
                  'POP & Ceiling Installers',
                  'General Site Supervisors'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-2 rounded bg-navy-900 text-slate-300 border border-navy-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-6">
            <div className="bg-navy-900 p-8 rounded-2xl border border-navy-800 space-y-6">
              <h3 className="text-xl font-bold text-white font-heading">Trade Expression of Interest</h3>

              {state.succeeded ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                  <h4 className="font-bold text-lg text-white">Application Received</h4>
                  <p className="text-xs">Thank you for submitting your details. Our human resources team will review your trade skills and contact you when relevant project roles open.</p>
                  <Button onClick={reset} variant="outline" size="sm">
                    Submit Another Application
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  {state.errors && state.errors.length > 0 && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                      We couldn't submit your request. Please check your information and try again.
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Samuel Adebayo"
                      className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                    <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs mt-1" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="08012345678"
                        className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                      />
                      <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-400 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Trade Discipline</label>
                      <select
                        name="trade"
                        defaultValue="ACP Cladding Installer"
                        className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-brand-orange"
                      >
                        <option>ACP Cladding Installer</option>
                        <option>Aluminium Fabricator</option>
                        <option>Glass Installer</option>
                        <option>Metal & Steel Welder</option>
                        <option>Signage Technician</option>
                        <option>Carpenter / Furniture</option>
                        <option>Site Supervisor</option>
                      </select>
                      <ValidationError prefix="Trade" field="trade" errors={state.errors} className="text-red-400 text-xs mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Current Location (City/State)</label>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="e.g. Lagos State / Ogun State"
                      className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                    <ValidationError prefix="Location" field="location" errors={state.errors} className="text-red-400 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Experience & Past Projects Summary</label>
                    <textarea
                      rows={3}
                      name="experience"
                      placeholder="Briefly state your technical background..."
                      className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                    <ValidationError prefix="Experience" field="experience" errors={state.errors} className="text-red-400 text-xs mt-1" />
                  </div>

                  <Button type="submit" variant="primary" size="md" icon={Send} iconPosition="right" className="w-full" disabled={state.submitting}>
                    {state.submitting ? 'Sending...' : 'Submit Trade Application'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
