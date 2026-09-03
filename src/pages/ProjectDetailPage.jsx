import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProjectLightboxModal from '../components/ProjectLightboxModal';
import { MapPin, Calendar, Building, Clock, CheckCircle2, ArrowRight, PhoneCall, Maximize2, Video, Play, Loader2 } from 'lucide-react';
import { projectsData } from '../data/projectsData';
import { getProjectBySlug } from '../firebase/projects';
import { getOptimizedImageUrl } from '../utils/imageHelper';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProject() {
      setLoading(true);
      try {
        const firestoreDoc = await getProjectBySlug(slug);
        if (isMounted && firestoreDoc) {
          setProject(firestoreDoc);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Firestore slug lookup notice:', err.message);
      }

      // Fallback to static data
      const staticDoc = projectsData.find((p) => p.slug === slug);
      if (isMounted) {
        setProject(staticDoc || null);
        setLoading(false);
      }
    }
    loadProject();

    return () => { isMounted = false; };
  }, [slug]);

  // Update SEO Document Title
  useEffect(() => {
    if (project?.title) {
      document.title = `${project.title} | HORLARLEKX SERVICES`;
    }
  }, [project]);

  if (loading) {
    return (
      <div className="pt-28 pb-20 min-h-[60vh] section-double-bg-blue flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-cyan mb-3" />
        <p className="text-xs font-mono text-slate-300">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const mainHeroImg = project.featuredImage || project.images?.[0] || '';

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
            {project.showcaseNumber && (
              <Badge variant="cyan">{project.showcaseNumber}</Badge>
            )}
            <Badge variant="orange">{project.category || 'ACP/ALUCOBOND'}</Badge>
            <span className="text-xs text-slate-400 font-mono bg-navy-900 px-3 py-1 rounded-full border border-navy-800">
              {project.projectType || 'Facade Cladding'}
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
            {project.duration && (
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Duration: {project.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Project Hero Image */}
        {mainHeroImg && (
          <div className="py-8">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-navy-700 aspect-[16/9] max-h-[500px] bg-navy-950">
              <img
                src={getOptimizedImageUrl(mainHeroImg, 'full')}
                alt={project.title}
                className="block w-full h-full object-cover object-center max-w-full"
                fetchpriority="high"
                decoding="async"
              />
              {project.images && project.images.length > 0 && (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-4 right-4 bg-navy-950/90 text-white px-4 py-2 rounded-lg border border-navy-700 flex items-center space-x-2 text-xs font-bold hover:bg-cyan transition-colors shadow-lg"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Open Lightbox Gallery ({project.images.length} Photos{project.videos?.length ? `, ${project.videos.length} Videos` : ''})</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Project Breakdown: Overview, Challenge, Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12 border-b border-navy-800">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white font-heading">Project Overview</h2>
              <div className="h-1 w-16 bg-cyan rounded-full" />
              <p className="text-slate-300 text-base leading-relaxed">
                {project.overview || project.description || project.shortDescription}
              </p>
              {project.motto && (
                <div className="p-4 mt-4 rounded-xl bg-navy-900/90 border-l-4 border-cyan text-slate-200 italic text-sm font-medium shadow-md">
                  "{project.motto}"
                </div>
              )}
            </div>

            {/* Challenge & Solution Split */}
            {(project.challenge || project.solution) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {project.challenge && (
                  <div className="p-6 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
                    <h3 className="text-lg font-bold text-amber-400 font-heading">The Challenge</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                )}

                {project.solution && (
                  <div className="p-6 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
                    <h3 className="text-lg font-bold text-emerald-400 font-heading">HORLARLEKX Solution</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Video Showcase Section */}
            {project.videos && project.videos.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-navy-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-cyan/20 text-cyan border border-cyan/30">
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
                      className="group relative bg-navy-900 rounded-2xl overflow-hidden border border-navy-800 shadow-xl transition-all hover:border-cyan/50"
                    >
                      <div className="relative aspect-video bg-black flex items-center justify-center">
                        {vidSrc.includes('youtube.com') || vidSrc.includes('youtu.be') || vidSrc.includes('vimeo.com') ? (
                          <iframe
                            src={vidSrc}
                            title={`Video ${idx + 1}`}
                            className="w-full h-full border-0"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={vidSrc}
                            controls
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-3.5 flex items-center justify-between text-xs text-slate-300 bg-navy-950/90 border-t border-navy-800">
                        <div className="flex items-center space-x-2 font-medium">
                          <Play className="w-4 h-4 text-cyan fill-cyan" />
                          <span>On-Site Recording #{idx + 1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery Grid */}
            {project.images && project.images.length > 0 && (
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
            )}
          </div>

          {/* Project Details Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-navy-900 p-6 rounded-2xl border border-navy-800 space-y-6">
              <h3 className="text-lg font-bold text-white font-heading border-b border-navy-800 pb-3">
                Project Summary
              </h3>

              <div className="space-y-4 text-xs">
                {project.client && (
                  <div>
                    <span className="text-slate-400 block font-mono">CLIENT ENTITY:</span>
                    <span className="text-slate-200 font-semibold text-sm">{project.client}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 block font-mono">LOCATION:</span>
                  <span className="text-slate-200 font-semibold text-sm">{project.location}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-mono">YEAR COMPLETED:</span>
                  <span className="text-slate-200 font-semibold text-sm">{project.year}</span>
                </div>

                {project.duration && (
                  <div>
                    <span className="text-slate-400 block font-mono">TIMELINE DURATION:</span>
                    <span className="text-slate-200 font-semibold text-sm">{project.duration}</span>
                  </div>
                )}

                {project.projectDates && (
                  <div>
                    <span className="text-slate-400 block font-mono">PROJECT DATES:</span>
                    <span className="text-slate-200 font-semibold text-sm">{project.projectDates}</span>
                  </div>
                )}
              </div>

              {project.servicesProvided && project.servicesProvided.length > 0 && (
                <div className="pt-4 border-t border-navy-800">
                  <span className="text-xs text-slate-400 block font-mono mb-2">SERVICES DELIVERED:</span>
                  <div className="space-y-2">
                    {project.servicesProvided.map((serv, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan shrink-0" />
                        <span>{serv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Have a similar project CTA */}
            <div className="bg-navy-900/90 p-6 rounded-2xl border border-cyan/40 text-center space-y-4 shadow-xl">
              <h4 className="text-base font-bold text-white font-heading">Have a Similar Project?</h4>
              <p className="text-slate-300 text-xs">Request a tailored quotation for your building facade, ACP cladding, or signage project.</p>
              <Button to="/quote" variant="primary" size="md" icon={ArrowRight} iconPosition="right" className="w-full">
                Request a Quote
              </Button>
            </div>
          </div>

        </div>

      </div>

      {lightboxOpen && project.images && (
        <ProjectLightboxModal
          project={project}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
