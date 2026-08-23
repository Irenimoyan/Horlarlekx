import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, ExternalLink, Video, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from './Badge';

export default function ProjectLightboxModal({ project, onClose }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Combine images and videos into a single media array
  const allMedia = [
    ...(project?.images || []).map((src) => ({ type: 'image', src })),
    ...(project?.videos || []).map((src) => ({ type: 'video', src }))
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && allMedia.length > 0) {
        setActiveMediaIndex((prev) => (prev + 1) % allMedia.length);
      }
      if (e.key === 'ArrowLeft' && allMedia.length > 0) {
        setActiveMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allMedia.length, onClose]);

  if (!project || allMedia.length === 0) return null;

  const currentMedia = allMedia[activeMediaIndex] || allMedia[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/95 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-5xl bg-navy-900 border border-navy-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-navy-950 border-b border-navy-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="orange" size="sm">{project.category}</Badge>
              <span className="text-xs text-slate-400 font-mono">{project.year}</span>
              {project.videos && project.videos.length > 0 && (
                <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center space-x-1">
                  <Video className="w-3 h-3 text-amber-400" />
                  <span>Includes Videos</span>
                </span>
              )}
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
          {currentMedia.type === 'video' ? (
            <video
              key={currentMedia.src}
              src={currentMedia.src}
              controls
              muted
              autoPlay
              playsInline
              className="max-h-[60vh] max-w-full object-contain"
            />
          ) : (
            <img
              src={currentMedia.src}
              alt={`${project.title} view ${activeMediaIndex + 1}`}
              className="max-h-[60vh] max-w-full object-contain block mx-auto"
            />
          )}

          {/* Controls */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={() => setActiveMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)}
                className="absolute left-4 p-3 rounded-full bg-navy-900/80 hover:bg-brand-orange text-white border border-navy-700 transition-colors shadow-lg"
                aria-label="Previous item"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveMediaIndex((prev) => (prev + 1) % allMedia.length)}
                className="absolute right-4 p-3 rounded-full bg-navy-900/80 hover:bg-brand-orange text-white border border-navy-700 transition-colors shadow-lg"
                aria-label="Next item"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Modal Footer Controls & Details */}
        <div className="p-4 sm:p-6 bg-navy-950 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
            <span>{project.location}</span>
          </div>

          {/* Media Thumbnails */}
          {allMedia.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-md">
              {allMedia.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 relative flex items-center justify-center bg-navy-950 ${
                    idx === activeMediaIndex ? 'border-brand-orange scale-105' : 'border-navy-700 opacity-60'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-navy-900 flex flex-col items-center justify-center text-amber-400">
                      <Play className="w-5 h-5 fill-amber-400" />
                      <span className="text-[8px] font-mono text-slate-300">VID</span>
                    </div>
                  ) : (
                    <img src={item.src} alt="thumbnail" className="w-full h-full object-cover" />
                  )}
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
