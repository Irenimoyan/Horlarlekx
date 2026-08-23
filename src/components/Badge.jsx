import React from 'react';

export default function Badge({ children, variant = 'orange', size = 'md', className = '' }) {
  const baseStyles = 'inline-flex items-center font-semibold tracking-wider uppercase rounded-full border transition-colors';
  
  const variants = {
    orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
    navy: 'bg-navy-800 text-slate-300 border-navy-600',
    slate: 'bg-slate-800 text-slate-400 border-slate-700',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    placeholder: 'bg-amber-500/10 text-amber-400 border-amber-500/30 text-[11px] font-mono'
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5'
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.orange} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
}
