import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Shield, Building2, Compass, Maximize2, Signpost, TowerControl, Frame, Box, Spline, Home, Hammer, Armchair, Wrench, Grid, HardHat, Paintbrush, Megaphone } from 'lucide-react';
import Badge from './Badge';
import { getOptimizedImageUrl } from '../utils/imageHelper';

// Map string icon names to Lucide components safely
const iconMap = {
  Layers, Shield, Building2, Compass, Maximize2, Signpost, TowerControl, Frame, Box, Spline, Home, Hammer, Armchair, Wrench, Grid, HardHat, Paintbrush, Megaphone
};

export default function ServiceCard({ service, className = '' }) {
  const IconComponent = iconMap[service.iconName] || Building2;

  return (
    <div className={`group bg-white rounded-xl border border-custom-light hover:border-cyan/60 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full ${className}`}>
      {/* Image container */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-navy-950">
        <img
          src={getOptimizedImageUrl(service.image, 'thumb')}
          alt={service.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 max-w-full"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent opacity-50" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="cyan" size="sm">{service.category}</Badge>
        </div>

        {/* Icon Floating Badge */}
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-lg bg-cyan text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Body content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-extrabold text-primary font-heading group-hover:text-cyan transition-colors">
          {service.title}
        </h3>

        <p className="mt-3 text-custom-darkText text-sm leading-relaxed flex-grow line-clamp-3">
          {service.shortDescription}
        </p>

        {/* Learn More link */}
        <div className="mt-6 pt-4 border-t border-custom-light flex items-center justify-between">
          <Link
            to={`/services/${service.slug}`}
            className="inline-flex items-center space-x-2 text-xs font-extrabold text-cyan uppercase tracking-wider hover:text-secondary transition-colors"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {service.isFeatured && (
            <span className="text-[10px] uppercase font-bold text-primary bg-custom-light px-2.5 py-1 rounded-md">
              Core Specialty
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
