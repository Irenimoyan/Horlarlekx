import React from 'react';
import Badge from './Badge';

export default function StatCard({ stat }) {
  return (
    <div className="bg-navy-900/90 rounded-xl p-6 border border-navy-800 hover:border-brand-orange/50 transition-all duration-300 shadow-lg text-center flex flex-col items-center justify-between group">
      <div className="mb-2">
        <Badge variant="placeholder" size="sm">Placeholder</Badge>
      </div>

      <div className="my-2">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white group-hover:text-brand-orange transition-colors">
          {stat.value}
        </span>
        <h4 className="text-sm font-bold text-slate-200 font-heading uppercase tracking-wide mt-2">
          {stat.label}
        </h4>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed max-w-xs mt-2">
        {stat.description}
      </p>
    </div>
  );
}
