import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ExternalLink, Maximize2, Video } from 'lucide-react';
import Badge from './Badge';

export default function ProjectCard({ project, onOpenLightbox, className = '' }) {
  return (
    <div className={`group bg-navy-900 rounded-xl border border-navy-800 hover:border-brand-orange/60 overflow-hidden shadow-lg hover:shadow-navy-lg transition-all duration-300 flex flex-col ${className}`}>
      {/* Image Container with overlay */}
      <div className="relative h-60 sm:h-64 overflow-hidden bg-navy-950">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 gap-2">
          <Badge variant="orange" size="sm">{project.category}</Badge>
          <div className="flex items-center space-x-2">
            {project.videos && project.videos.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-amber-300 bg-navy-950/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40">
                <Video className="w-3 h-3 text-amber-400" />
                <span className="font-semibold text-[10px]">Video</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-slate-300 text-xs bg-navy-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-navy-800">
              <Calendar className="w-3 h-3 text-brand-orange" />
              <span>{project.year}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Overlay Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {onOpenLightbox && (
            <button
              onClick={() => onOpenLightbox(project)}
              className="p-2 rounded-lg bg-navy-950/90 text-white hover:bg-brand-orange transition-colors shadow-md"
              title="Quick Lightbox View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <Link
            to={`/projects/${project.slug}`}
            className="p-2 rounded-lg bg-brand-orange text-white hover:bg-brand-orange-hover transition-colors shadow-md"
            title="View Full Case Study"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center space-x-1.5 text-xs text-brand-orange font-semibold mb-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{project.location}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading group-hover:text-brand-orange transition-colors line-clamp-2">
          <Link to={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2 flex-grow">
          {project.shortDescription}
        </p>

        <div className="mt-5 pt-4 border-t border-navy-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {project.projectType}
          </span>
          <Link
            to={`/projects/${project.slug}`}
            className="text-xs font-extrabold text-brand-orange hover:text-white uppercase tracking-wider transition-colors"
          >
            View Project →
          </Link>
        </div>
      </div>
    </div>
  );
}
