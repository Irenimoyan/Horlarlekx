import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';
import { servicesData } from '../data/servicesData';
import { projectsData } from '../data/projectsData';
import { companyInfo } from '../data/companyInfo';
import { CheckCircle2, ArrowRight, PhoneCall, ShieldCheck, Layers, Building2 } from 'lucide-react';

export default function ServiceDetailPage() {
  const { slug } = useParams();

  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Related projects
  const relatedProjects = projectsData
    .filter((p) => p.servicesProvided?.includes(service.title) || p.category.toLowerCase().includes(service.category.toLowerCase().split(' ')[0]))
    .slice(0, 3);

  return (
    <div className="pt-28 pb-20 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs
          items={[
            { label: 'Services', path: '/services' },
            { label: service.title }
          ]}
        />

        {/* Hero Section */}
        <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-b border-navy-800">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-2">
              <Badge variant="orange">{service.category}</Badge>
              {service.isFeatured && <Badge variant="navy">Core Specialty</Badge>}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
              {service.title}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {service.fullDescription}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button to={`/quote?service=${encodeURIComponent(service.title)}`} variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Request Quote for {service.title}
              </Button>
              <Button href={companyInfo.contacts.whatsappLink} variant="whatsapp" size="lg" icon={PhoneCall}>
                Discuss on WhatsApp
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-navy-700">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-[320px] sm:h-[400px] object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Technical Features & Applications Grid */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-navy-800">
          
          {/* Key Features */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold text-white font-heading">
              Key Technical Features & Specifications
            </h2>
            <div className="h-1 w-16 bg-brand-orange rounded-full" />

            <div className="space-y-3">
              {service.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-navy-900 border border-navy-800 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-sm leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Applications & Scope */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold text-white font-heading">
              Primary Applications
            </h2>
            <div className="h-1 w-16 bg-brand-orange rounded-full" />

            <div className="bg-navy-900 p-6 rounded-2xl border border-navy-800 space-y-4">
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                Ideal Building Types:
              </p>
              <ul className="space-y-2.5">
                {service.applications.map((app, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm text-slate-200">
                    <Building2 className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-navy-800">
                <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Includes HORLARLEKX Installation Warranty</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="py-16">
            <h2 className="text-2xl font-bold text-white font-heading mb-6">
              Projects Featuring {service.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
