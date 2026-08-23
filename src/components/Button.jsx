import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  to,
  href,
  variant = 'primary', // primary | secondary | outline | ghost | whatsapp
  size = 'md', // sm | md | lg
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon = null,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variants = {
    primary: 'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-lg shadow-brand-orange/20 hover:shadow-orange-glow border border-brand-orange',
    secondary: 'bg-navy-800 hover:bg-navy-700 text-white border border-navy-600 hover:border-slate-400 shadow-md',
    outline: 'bg-transparent hover:bg-navy-800/60 text-slate-200 hover:text-white border border-slate-600 hover:border-brand-orange',
    ghost: 'bg-transparent hover:bg-navy-800/40 text-slate-300 hover:text-brand-orange',
    whatsapp: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500',
    white: 'bg-white text-navy-950 hover:bg-slate-100 shadow-lg font-bold border border-white'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 space-x-1.5',
    md: 'text-sm px-5 py-2.5 space-x-2',
    lg: 'text-base px-7 py-3.5 space-x-2.5 font-bold tracking-wide'
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  const renderContent = () => (
    <>
      {Icon && iconPosition === 'left' && <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {renderContent()}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {renderContent()}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses} {...props}>
      {renderContent()}
    </button>
  );
}
