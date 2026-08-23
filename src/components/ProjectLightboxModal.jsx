import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from './Badge';

export default function ProjectLightboxModal({ project, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && project?.images) {
        setActiveImageIndex((prev) => (prev + 1) % project.images.length);
      }
      if (e.key === 'ArrowLeft' && project?.images) {
        setActiveImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const currentImage = project.images[activeImageIndex] || project.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/95 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-5xl bg-navy-900 border border-navy-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-navy-950 border-b border-navy-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="orange" size="sm">{project.category}</Badge>
              <span className="text-xs text-slate-400 font-mono">{project.year}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading truncate">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-navy-800 hover:bg-brand-orange text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Viewport */}
        <div className="relative flex-grow bg-black flex items-center justify-center min-h-[300px] sm:min-h-[450px] overflow-hidden">
          <img
            src={currentImage}
            alt={`${project.title} view ${activeImageIndex + 1}`}
            className="max-h-[60vh] max-w-full object-contain"
          />

          {/* Controls */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)}
                className="absolute left-4 p-3 rounded-full bg-navy-900/80 hover:bg-brand-orange text-white border border-navy-700 transition-colors shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % project.images.length)}
                className="absolute right-4 p-3 rounded-full bg-navy-900/80 hover:bg-brand-orange text-white border border-navy-700 transition-colors shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Modal Footer Controls & Details */}
        <div className="p-4 sm:p-6 bg-navy-950 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <MapPin className="w-4 h-4 text-brand-orange" />
            <span>{project.location}</span>
          </div>

          {/* Thumbnails */}
          {project.images.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto py-1">
              {project.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    idx === activeImageIndex ? 'border-brand-orange scale-105' : 'border-navy-700 opacity-60'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <Link
            to={`/projects/${project.slug}`}
            onClick={onClose}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-colors"
          >
            <span>View Full Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
