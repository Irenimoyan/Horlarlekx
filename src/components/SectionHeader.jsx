import React from 'react';
import Badge from './Badge';

export default function SectionHeader({
  badgeText,
  title,
  subtitle,
  centered = false,
  lightMode = false,
  className = ''
}) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'} ${className}`}>
      {badgeText && (
        <div className="mb-3">
          <Badge variant={lightMode ? 'navy' : 'orange'}>{badgeText}</Badge>
        </div>
      )}
      
      {title && (
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight ${lightMode ? 'text-navy-950' : 'text-white'}`}>
          {title}
        </h2>
      )}

      {/* Subtle architectural orange line accent */}
      <div className={`h-1 w-16 bg-brand-orange mt-4 rounded-full ${centered ? 'mx-auto' : ''}`} />

      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg leading-relaxed ${lightMode ? 'text-slate-600' : 'text-slate-300'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
