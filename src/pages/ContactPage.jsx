import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import Breadcrumbs from '../components/Breadcrumbs';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

export default function ContactPage() {
  const [state, handleSubmit, reset] = useForm('xdeogkjp');

  return (
    <div className="pt-28 pb-20 section-double-bg-white text-custom-darkText">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="py-8 border-b border-custom-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <Badge variant="cyan">Direct Communication</Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-primary font-heading tracking-tight">
              Contact HORLARS SERVICES
            </h1>
            <p className="text-base sm:text-lg text-custom-darkText max-w-3xl leading-relaxed">
              Get in touch with our team for project inquiries, site assessments, and architectural finishing consultations in Lagos and Ogun State.
            </p>
          </div>
          <div className="shrink-0 bg-white p-2.5 rounded-2xl shadow-xl border border-cyan/40">
            <img
              src="/logo.jpg"
              alt="HORLARS SERVICES Logo"
              className="h-16 sm:h-20 w-auto object-contain rounded-xl"
            />
          </div>
        </div>

        {/* 1. Office Cards & Direct Channels */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Lagos Office Card */}
          <div className="bg-white rounded-2xl p-6 border border-custom-light space-y-4 shadow-md hover:border-cyan/50 transition-colors">
            <div className="flex items-center space-x-2 text-cyan">
              <MapPin className="w-5 h-5 shrink-0" />
              <span className="font-mono text-xs uppercase font-bold">Lagos State Office</span>
            </div>
            <h3 className="text-xl font-bold text-primary font-heading">
              {companyInfo.offices[0].name}
            </h3>
            <p className="text-custom-darkText text-sm leading-relaxed">
              {companyInfo.offices[0].address}
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-custom-darkText/60 block mb-1">Interactive Map Link:</span>
              <span className="text-xs text-secondary font-mono italic">To be provided</span>
            </div>
          </div>

          {/* Ogun Office Card */}
          <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 space-y-4 shadow-lg hover:border-brand-orange/50 transition-colors">
            <div className="flex items-center space-x-2 text-brand-orange">
              <MapPin className="w-5 h-5 shrink-0" />
              <span className="font-mono text-xs uppercase font-bold">Ogun State Office</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              {companyInfo.offices[1].name}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {companyInfo.offices[1].address}
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">Interactive Map Link:</span>
              <span className="text-xs text-amber-400 font-mono italic">To be provided</span>
            </div>
          </div>

          {/* Direct Communication Channels */}
          <div className="bg-navy-900 rounded-2xl p-6 border border-brand-orange/40 space-y-4 shadow-lg">
            <div className="flex items-center space-x-2 text-brand-orange">
              <Phone className="w-5 h-5 shrink-0" />
              <span className="font-mono text-xs uppercase font-bold">Direct Channels</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Call / WhatsApp / Email
            </h3>

            <div className="space-y-3 text-sm">
              <a
                href={`tel:${companyInfo.contacts.phone}`}
                className="flex items-center space-x-3 text-slate-200 hover:text-brand-orange transition-colors p-2.5 rounded-lg bg-navy-950 border border-navy-800"
              >
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone Line</span>
                  <span className="font-semibold">{companyInfo.contacts.phoneFormatted}</span>
                </div>
              </a>

              <a
                href={companyInfo.contacts.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 text-emerald-400 hover:text-emerald-300 transition-colors p-2.5 rounded-lg bg-navy-950 border border-emerald-500/30"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">WhatsApp Instant Chat</span>
                  <span className="font-semibold">{companyInfo.contacts.phoneFormatted}</span>
                </div>
              </a>

              <a
                href={`mailto:${companyInfo.contacts.email}`}
                className="flex items-center space-x-3 text-slate-200 hover:text-brand-orange transition-colors p-2.5 rounded-lg bg-navy-950 border border-navy-800"
              >
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Email Address</span>
                  <span className="font-semibold truncate">{companyInfo.contacts.email}</span>
                </div>
              </a>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Business Hours: <span className="text-amber-400 font-mono">{companyInfo.contacts.hours}</span></span>
            </div>
          </div>

        </div>

        {/* 2. Form & Map Section */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-navy-800">
          
          {/* Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-navy-900 p-8 rounded-2xl border border-navy-800 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white font-heading">Send Us a Message</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              {state.succeeded ? (
                <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400" />
                  <h4 className="font-bold text-xl text-white">Message Sent Successfully</h4>
                  <p className="text-sm">Thank you for contacting HORLARLEKX SERVICES. Your project enquiry has been received successfully. Our team will review your request and get back to you shortly.</p>
                  <Button onClick={reset} variant="outline" size="sm">
                    Submit Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  {state.errors && state.errors.length > 0 && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                      We couldn't submit your request. Please check your information and try again.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Arc. Oladipo Adeleke"
                        className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                      />
                      <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="07055534249"
                        className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                      />
                      <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-400 text-xs mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="client@company.com"
                        className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        placeholder="e.g. ACP Cladding Quote Inquiry"
                        className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                      />
                      <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-400 text-xs mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Message / Requirements</label>
                    <textarea
                      rows={4}
                      name="message"
                      required
                      placeholder="Detail your project requirements, location, measurements, or timeline..."
                      className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs mt-1" />
                  </div>

                  <Button type="submit" variant="primary" size="lg" icon={Send} iconPosition="right" className="w-full" disabled={state.submitting}>
                    {state.submitting ? 'Sending...' : 'SEND MESSAGE'}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Social & Map Embed Container */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-navy-900 p-6 rounded-2xl border border-navy-800 space-y-4">
              <h4 className="text-base font-bold text-white font-heading">Social Media Channels</h4>
              
              <a
                href={companyInfo.socials.tiktok.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-navy-700 hover:border-brand-orange text-slate-200 hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-brand-orange text-sm">TikTok</span>
                  <span className="text-xs text-slate-400">@{companyInfo.socials.tiktok.handle}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-brand-orange" />
              </a>

              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs text-slate-400 space-y-1">
                <span className="font-mono text-amber-400 block font-bold">OTHER SOCIAL MEDIA ACCOUNTS:</span>
                <p>Facebook, Instagram, LinkedIn, X, YouTube are marked <span className="font-mono text-amber-400">To be provided</span> until official URLs are released.</p>
              </div>
            </div>

            {/* Map Visual Container */}
            <div className="bg-navy-900 p-6 rounded-2xl border border-navy-800 space-y-3">
              <h4 className="text-base font-bold text-white font-heading">Map Location Integration</h4>
              <div className="w-full h-48 rounded-xl bg-navy-950 border border-navy-800 flex flex-col items-center justify-center p-4 text-center">
                <MapPin className="w-8 h-8 text-brand-orange mb-2" />
                <span className="text-xs text-slate-300 font-semibold">Interactive Google Map Embed</span>
                <span className="text-[11px] text-amber-400 font-mono mt-1">To be integrated once location links/coordinates are provided</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
