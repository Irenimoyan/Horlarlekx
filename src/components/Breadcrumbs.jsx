import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400 overflow-x-auto">
        <li>
          <Link to="/" className="flex items-center hover:text-brand-orange transition-colors">
            <Home className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center space-x-2 shrink-0">
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              {isLast || !item.path ? (
                <span className="font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-brand-orange transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
