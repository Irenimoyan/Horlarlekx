import React from 'react';
import Badge from './Badge';

export default function StatCard({ stat }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-custom-light hover:border-cyan/50 transition-all duration-300 shadow-md text-center flex flex-col items-center justify-between group">
      <div className="mb-2">
        <Badge variant="placeholder" size="sm">Placeholder</Badge>
      </div>

      <div className="my-2">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-primary group-hover:text-cyan transition-colors">
          {stat.value}
        </span>
        <h4 className="text-sm font-bold text-custom-darkText font-heading uppercase tracking-wide mt-2">
          {stat.label}
        </h4>
      </div>

      <p className="text-custom-darkText/80 text-xs leading-relaxed max-w-xs mt-2">
        {stat.description}
      </p>
    </div>
  );
}
