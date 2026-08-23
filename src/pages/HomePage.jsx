import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, CheckCircle2, ShieldCheck, Building, Sparkles, Layers, PhoneCall, Award, Users, HardHat } from 'lucide-react';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import TrustStrip from '../components/TrustStrip';
import ServiceCard from '../components/ServiceCard';
import ProjectCard from '../components/ProjectCard';
import ProjectLightboxModal from '../components/ProjectLightboxModal';
import ProcessTimeline from '../components/ProcessTimeline';
import StatCard from '../components/StatCard';
import FAQAccordion from '../components/FAQAccordion';
import Badge from '../components/Badge';

import { companyInfo } from '../data/companyInfo';
import { servicesData } from '../data/servicesData';
import { projectsData, projectCategories } from '../data/projectsData';
import { faqData } from '../data/faqData';
import { testimonialsData } from '../data/testimonialsData';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightboxProject, setActiveLightboxProject] = useState(null);

  // Filter projects based on tab
  const filteredProjects = selectedCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === selectedCategory || (selectedCategory === 'ACP/ALUCOBOND' && p.category.includes('ACP')));

  // Featured 6 core services for homepage
  const featuredServices = servicesData.filter((s) => s.isFeatured).slice(0, 6);

  return (
    <div className="space-y-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-navy-950">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="HORLARLEKX Exterior Cladding & Construction Project"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90"
          />
          <div className="absolute inset-0 hero-overlay" />
          {/* Subtle grid pattern graphic */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left py-12">
          <div className="max-w-3xl space-y-6">
            
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-navy-900/90 border border-brand-orange/40 text-xs font-bold text-slate-200 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
              <span className="text-brand-orange uppercase font-mono tracking-widest">{companyInfo.tagline}</span>
              <span className="text-slate-400">•</span>
              <span className="truncate">{companyInfo.brandName}</span>
            </div>

            {/* Main Hero Copy */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-heading tracking-tight leading-[1.1]">
              Modern Construction & <br className="hidden sm:inline" />
              <span className="orange-gradient-text">Architectural Finishing</span> Solutions
            </h1>

            {/* Supporting text */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl">
              From exterior cladding and architectural facades to signage, aluminium, glass, roofing and general contracting, HORLARLEKX delivers quality building solutions with precision and professional execution.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button to="/quote" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                REQUEST A QUOTE
              </Button>
              <Button to="/projects" variant="outline" size="lg">
                VIEW OUR PROJECTS
              </Button>
            </div>

            {/* Core Specialties Strip under Hero CTA */}
            <div className="pt-6 border-t border-navy-800/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
              <span className="font-bold text-slate-400">Core Specialties:</span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" />
                <span>ACP Cladding (ALUCOBOND)</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" />
                <span>3D & Pylon Signage</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" />
                <span>Aluminium & Glass</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex flex-col items-center space-y-1 text-slate-400 text-xs">
          <span>Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 text-brand-orange animate-bounce" />
        </div>
      </section>

      {/* 2. TRUST / VALUE STRIP */}
      <TrustStrip />

      {/* 3. INTRODUCTION SECTION */}
      <section className="py-20 bg-navy-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Architectural imagery stack */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-navy-700 group">
                <img
                  src="/projects/Opic complex at Sheraton  ikeja lagos/20250404_130140.jpg"
                  alt="HORLARLEKX Building Facade Solutions"
                  className="w-full h-[380px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating feature card overlay */}
              <div className="absolute -bottom-6 -right-2 sm:bottom-6 sm:-right-6 bg-navy-950/95 backdrop-blur-xl p-5 rounded-xl border border-brand-orange/40 shadow-2xl max-w-xs hidden sm:block">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-lg bg-brand-orange/20 text-brand-orange shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm font-heading">Quality Workmanship</h4>
                    <p className="text-slate-300 text-xs mt-1">Precision architectural cladding & structural fabrication across Nigeria.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Copy & Positioning */}
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="orange">Company Overview</Badge>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
                Building Beyond Expectations
              </h2>

              <div className="h-1 w-20 bg-brand-orange rounded-full" />

              <p className="text-slate-300 text-base leading-relaxed">
                HORLARLEKX Exterior Services provides comprehensive construction, exterior finishing, architectural facade, signage, fabrication, and general contracting solutions for commercial, residential, and corporate developments.
              </p>

              <p className="text-slate-300 text-base leading-relaxed">
                Positioned as more than an exterior cladding contractor, we combine multi-disciplinary engineering expertise with premium materials to deliver buildings that stand out for their aesthetic sophistication, structural integrity, and long-term weather endurance.
              </p>

              {/* 5 Core Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { title: "Quality Materials", desc: "Certified PVDF composite panels & glass" },
                  { title: "Precision Workmanship", desc: "Millimeter accuracy joint fitting" },
                  { title: "Creative Design", desc: "Photorealistic 3D architectural mockups" },
                  { title: "Professional Execution", desc: "On-time delivery & safety compliance" },
                ].map((pillar, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-navy-950 border border-navy-800 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-bold text-xs font-heading">{pillar.title}</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button to="/about" variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
                  Learn More About Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className="py-20 bg-navy-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badgeText="Comprehensive Solutions"
            title="Our Core Services"
            subtitle="Comprehensive building, finishing and architectural solutions tailored to every project requirement."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button to="/services" variant="outline" size="lg" icon={ArrowRight} iconPosition="right">
              View All 18+ Service Categories
            </Button>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PROJECTS SHOWCASE */}
      <section className="py-20 bg-navy-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badgeText="Architectural Portfolio"
            title="Our Recent Work"
            subtitle="Explore some of the projects where we have transformed ideas into professionally finished spaces."
          />

          {/* Project Category Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20 scale-105'
                    : 'bg-navy-950 text-slate-400 hover:text-white hover:bg-navy-800 border border-navy-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenLightbox={(proj) => setActiveLightboxProject(proj)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button to="/projects" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
              VIEW ALL PROJECTS
            </Button>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE HORLARLEKX */}
      <section className="py-20 bg-navy-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            badgeText="Why Us"
            title="Why Choose HORLARLEKX?"
            subtitle="Engineered for durability, modern visual appeal, and client satisfaction."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Multiple Solutions Under One Roof",
                desc: "From cladding and facade solutions to aluminium, glass, signage, roofing and general contracting, we provide comprehensive project solutions.",
                icon: Layers
              },
              {
                title: "Quality Workmanship",
                desc: "We combine quality materials with skilled craftsmanship and strict attention to detail in every elevation.",
                icon: Award
              },
              {
                title: "Modern Architectural Design",
                desc: "We create contemporary architectural solutions that enhance the visual identity and property market value of buildings.",
                icon: Sparkles
              },
              {
                title: "Professional Execution",
                desc: "We approach every project with structured planning, precision, site safety compliance, and full accountability.",
                icon: HardHat
              },
              {
                title: "Customized Solutions",
                desc: "Every project is tailored to the client's specific requirements, building type, structural style, and budget.",
                icon: Building
              },
              {
                title: "Customer Satisfaction",
                desc: "Our goal is to deliver results that exceed expectations and create long-term structural value for property owners.",
                icon: Users
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-navy-900/90 rounded-xl p-6 border border-navy-800 hover:border-brand-orange/60 transition-all duration-300 shadow-lg group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-navy-950 border border-navy-700 flex items-center justify-center text-brand-orange mb-5 group-hover:bg-brand-orange group-hover:text-white transition-colors shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-brand-orange transition-colors">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                      "{feature.desc}"
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-navy-800/80 text-[11px] font-mono text-slate-400">
                    HORLARLEKX Advantage #{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. PROCESS SECTION */}
      <section className="py-20 bg-navy-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badgeText="How We Work"
            title="Our Architectural Project Workflow"
            subtitle="An 8-step structured engineering process ensuring precision execution from initial consultation to final completion."
            centered
          />
          <ProcessTimeline />
        </div>
      </section>

      {/* 8. COMPANY STATISTICS (Clear Placeholders as requested) */}
      <section className="py-16 bg-navy-950 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge variant="placeholder" size="sm">Company Track Record</Badge>
            <h3 className="text-xl font-bold text-white font-heading mt-2">
              Performance & Capacity Overview
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1">
              Official figures will be updated upon final verification. Structure prepared for seamless client input.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyInfo.stats.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION (Genuine Placeholders) */}
      <section className="py-20 bg-navy-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badgeText="Client Reviews"
            title="What Clients Say"
            subtitle="Genuine feedback from property owners, real estate developers, and corporate clients."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((test) => (
              <div
                key={test.id}
                className="bg-navy-950 p-6 rounded-xl border border-navy-800 relative flex flex-col justify-between"
              >
                <div className="mb-4">
                  <Badge variant="placeholder" size="sm">Placeholder Review</Badge>
                </div>

                <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                  "{test.testimonial}"
                </p>

                <div className="pt-4 border-t border-navy-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="text-white font-bold">{test.clientName}</h4>
                    <p className="text-slate-400">{test.company} • {test.position}</p>
                  </div>
                  <span className="text-[11px] font-mono text-brand-orange">{test.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION PREVIEW */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badgeText="Got Questions?"
            title="Frequently Asked Questions"
            subtitle="Find quick answers to common questions about our cladding, signage, and construction services."
            centered
          />
          <FAQAccordion faqs={faqData.slice(0, 5)} />
          <div className="mt-8 text-center">
            <Link to="/faq" className="text-xs font-bold text-brand-orange hover:text-white uppercase tracking-wider transition-colors">
              View All Frequently Asked Questions →
            </Link>
          </div>
        </div>
      </section>

      {/* 11. CONVERSION CTA BLOCK */}
      <section className="py-16 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border-t border-brand-orange/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900/90 rounded-2xl p-8 sm:p-12 border border-brand-orange/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <Badge variant="orange">Ready to Transform Your Building?</Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
                Let's Discuss Your Project Requirements
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Contact HORLARLEKX today for professional architectural cladding, facade engineering, signage, and building finishing quotations across Lagos, Ogun, and Nigeria.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 shrink-0 w-full sm:w-auto">
              <Button to="/quote" variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                REQUEST A QUOTE
              </Button>
              <Button href={companyInfo.contacts.whatsappLink} variant="whatsapp" size="lg" icon={PhoneCall} className="w-full sm:w-auto">
                WhatsApp Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeLightboxProject && (
        <ProjectLightboxModal
          project={activeLightboxProject}
          onClose={() => setActiveLightboxProject(null)}
        />
      )}
    </div>
  );
}
