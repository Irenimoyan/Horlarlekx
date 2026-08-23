import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Shield, Building2, Compass, Maximize2, Signpost, TowerControl, Frame, Box, Spline, Home, Hammer, Armchair, Wrench, Grid, HardHat, Paintbrush, Megaphone } from 'lucide-react';
import Badge from './Badge';

// Map string icon names to Lucide components safely
const iconMap = {
  Layers, Shield, Building2, Compass, Maximize2, Signpost, TowerControl, Frame, Box, Spline, Home, Hammer, Armchair, Wrench, Grid, HardHat, Paintbrush, Megaphone
};

export default function ServiceCard({ service, className = '' }) {
  const IconComponent = iconMap[service.iconName] || Building2;

  return (
    <div className={`group bg-navy-900/90 rounded-xl border border-navy-800 hover:border-brand-orange/60 overflow-hidden shadow-lg hover:shadow-navy-lg transition-all duration-300 flex flex-col h-full ${className}`}>
      {/* Image container */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-navy-950">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent opacity-80" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="navy" size="sm">{service.category}</Badge>
        </div>

        {/* Icon Floating Badge */}
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-lg bg-brand-orange text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Body content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-extrabold text-white font-heading group-hover:text-brand-orange transition-colors">
          {service.title}
        </h3>

        <p className="mt-3 text-slate-300 text-sm leading-relaxed flex-grow line-clamp-3">
          {service.shortDescription}
        </p>

        {/* Learn More link */}
        <div className="mt-6 pt-4 border-t border-navy-800 flex items-center justify-between">
          <Link
            to={`/services/${service.slug}`}
            className="inline-flex items-center space-x-2 text-xs font-extrabold text-brand-orange uppercase tracking-wider hover:text-white transition-colors"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {service.isFeatured && (
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-navy-800 px-2 py-0.5 rounded">
              Core Specialty
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
