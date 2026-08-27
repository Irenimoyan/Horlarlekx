import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ExternalLink, Maximize2, Video } from 'lucide-react';
import Badge from './Badge';
import { getOptimizedImageUrl } from '../utils/imageHelper';

export default function ProjectCard({ project, onOpenLightbox, className = '' }) {
  return (
    <article className={`group bg-white rounded-2xl border border-custom-light hover:border-cyan/60 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col w-full min-w-0 ${className}`}>
      {/* Strict Image Container with aspect ratio & clip overflow */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-navy-950 shrink-0 border-b border-custom-light">
        <img
          src={getOptimizedImageUrl(project.images[0], 'thumb')}
          alt={project.title}
          className="block w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 max-w-full"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 gap-2 pointer-events-none">
          <div className="pointer-events-auto shrink-0">
            <Badge variant="cyan" size="sm">{project.category}</Badge>
          </div>
          <div className="flex items-center space-x-2 pointer-events-auto shrink-0">
            {project.videos && project.videos.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-amber-300 bg-navy-950/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40 shadow-sm">
                <Video className="w-3 h-3 text-amber-400" />
                <span className="font-semibold text-[10px]">Video</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-slate-200 text-xs bg-navy-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-navy-800 shadow-sm">
              <Calendar className="w-3 h-3 text-cyan" />
              <span>{project.year}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Overlay Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {onOpenLightbox && (
            <button
              onClick={() => onOpenLightbox(project)}
              className="p-2 rounded-lg bg-navy-950/90 text-white hover:bg-cyan transition-colors shadow-md"
              title="Quick Lightbox View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <Link
            to={`/projects/${project.slug}`}
            className="p-2 rounded-lg bg-cyan text-white hover:bg-cyan-hover transition-colors shadow-md"
            title="View Full Case Study"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-6 flex flex-col flex-grow min-w-0">
        <div className="flex items-center space-x-1.5 text-xs text-cyan font-bold mb-2 truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{project.location}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-primary font-heading group-hover:text-cyan transition-colors line-clamp-2">
          <Link to={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-custom-darkText text-xs sm:text-sm leading-relaxed line-clamp-2 flex-grow">
          {project.shortDescription}
        </p>

        <div className="mt-5 pt-4 border-t border-custom-light flex items-center justify-between">
          <span className="text-xs text-custom-darkText/70 font-mono truncate mr-2">
            {project.projectType}
          </span>
          <Link
            to={`/projects/${project.slug}`}
            className="text-xs font-extrabold text-cyan hover:text-secondary uppercase tracking-wider transition-colors shrink-0"
          >
            View Project →
          </Link>
        </div>
      </div>
    </article>
  );
}
