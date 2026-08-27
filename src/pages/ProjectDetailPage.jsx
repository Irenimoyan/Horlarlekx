import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProjectLightboxModal from '../components/ProjectLightboxModal';
import { MapPin, Calendar, Building, Clock, CheckCircle2, ArrowRight, PhoneCall, Maximize2, Video, Play } from 'lucide-react';
import { projectsData } from '../data/projectsData';
import { companyInfo } from '../data/companyInfo';
import { getOptimizedImageUrl } from '../utils/imageHelper';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="pt-28 pb-20 section-double-bg-blue text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs
          items={[
            { label: 'Projects', path: '/projects' },
            { label: project.title }
          ]}
        />

        {/* Hero Title & Meta */}
        <div className="py-6 border-b border-navy-800 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="orange">{project.category}</Badge>
            <span className="text-xs text-slate-400 font-mono bg-navy-900 px-3 py-1 rounded-full border border-navy-800">
              {project.projectType}
            </span>
            {project.videos && project.videos.length > 0 && (
              <span className="text-xs text-amber-300 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 flex items-center space-x-1">
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>{project.videos.length} Video{project.videos.length > 1 ? 's' : ''} Included</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 pt-2">
            <div className="flex items-center space-x-1.5 text-brand-orange font-semibold">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Year: {project.year}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Duration: {project.duration}</span>
            </div>
          </div>
        </div>

        {/* Main Project Hero Image */}
        <div className="py-8">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-navy-700 aspect-[16/9] max-h-[500px] bg-navy-950">
            <img
              src={getOptimizedImageUrl(project.images[0], 'full')}
              alt={project.title}
              className="block w-full h-full object-cover object-center max-w-full"
              fetchpriority="high"
              decoding="async"
            />
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 bg-navy-950/90 text-white px-4 py-2 rounded-lg border border-navy-700 flex items-center space-x-2 text-xs font-bold hover:bg-brand-orange transition-colors shadow-lg"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Open Lightbox Gallery ({project.images.length} Photos{project.videos?.length ? `, ${project.videos.length} Videos` : ''})</span>
            </button>
          </div>
        </div>

        {/* Project Breakdown: Overview, Challenge, Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12 border-b border-navy-800">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white font-heading">Project Overview</h2>
              <div className="h-1 w-16 bg-brand-orange rounded-full" />
              <p className="text-slate-300 text-base leading-relaxed">
                {project.overview}
              </p>
            </div>

            {/* Challenge & Solution Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
                <h3 className="text-lg font-bold text-amber-400 font-heading">The Challenge</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
                <h3 className="text-lg font-bold text-emerald-400 font-heading">HORLARLEKX Solution</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Video Showcase Section */}
            {project.videos && project.videos.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-navy-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                      <Video className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-heading">
                      Project Video Walkthroughs ({project.videos.length})
                    </h3>
                  </div>
                  <span className="text-xs text-amber-300 font-mono bg-navy-900 px-3 py-1 rounded-full border border-amber-500/30">
                    On-Site Media
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {project.videos.map((vidSrc, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-navy-900 rounded-2xl overflow-hidden border border-navy-800 shadow-xl transition-all hover:border-brand-orange/50"
                    >
                      <div className="relative aspect-video bg-black flex items-center justify-center">
                        <video
                          src={vidSrc}
                          controls
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3.5 flex items-center justify-between text-xs text-slate-300 bg-navy-950/90 border-t border-navy-800">
                        <div className="flex items-center space-x-2 font-medium">
                          <Play className="w-4 h-4 text-brand-orange fill-brand-orange" />
                          <span>On-Site Recording #{idx + 1}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px] uppercase">MP4 Video</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery Grid */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-white font-heading">Project Image Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxOpen(true)}
                    className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-navy-800 cursor-pointer group bg-navy-950"
                  >
                    <img
                      src={getOptimizedImageUrl(img, 'thumb')}
                      alt={`Gallery thumbnail ${idx + 1}`}
                      className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 max-w-full"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-navy-900 p-6 rounded-2xl border border-navy-800 space-y-6">
              <h3 className="text-lg font-bold text-white font-heading border-b border-navy-800 pb-3">
                Project Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono">CLIENT ENTITY:</span>
                  <span className="text-slate-200 font-semibold text-sm">{project.client}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-mono">LOCATION:</span>
                  <span className="text-slate-200 font-semibold text-sm">{project.location}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-mono">YEAR COMPLETED:</span>
                  <span className="text-slate-200 font-semibold text-sm">{project.year}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-mono">TIMELINE DURATION:</span>
                  <span className="text-slate-200 font-semibold text-sm">{project.duration}</span>
                </div>

                {project.projectDates && (
                  <div>
                    <span className="text-slate-400 block font-mono">PROJECT DATES:</span>
                    <span className="text-slate-200 font-semibold text-sm">{project.projectDates}</span>
                  </div>
                )}

                {project.delivery && (
                  <div>
                    <span className="text-slate-400 block font-mono">DELIVERY STATUS:</span>
                    <span className="text-slate-200 font-semibold text-sm">{project.delivery}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-navy-800">
                <span className="text-xs text-slate-400 block font-mono mb-2">SERVICES DELIVERED:</span>
                <div className="space-y-2">
                  {project.servicesProvided.map((serv, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                      <span>{serv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Have a similar project CTA */}
            <div className="bg-navy-900/90 p-6 rounded-2xl border border-brand-orange/40 text-center space-y-4">
              <h4 className="text-base font-bold text-white font-heading">Have a Similar Project?</h4>
              <p className="text-slate-300 text-xs">Request a tailored quotation for your building facade, ACP cladding, or signage project.</p>
              <Button to="/quote" variant="primary" size="md" icon={ArrowRight} iconPosition="right" className="w-full">
                Request a Quote
              </Button>
            </div>
          </div>

        </div>

      </div>

      {lightboxOpen && (
        <ProjectLightboxModal
          project={project}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
