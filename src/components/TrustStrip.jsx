import React from 'react';
import { ShieldCheck, Crosshair, Award, Clock, ThumbsUp } from 'lucide-react';

export default function TrustStrip() {
  const trustItems = [
    {
      title: "Quality",
      desc: "Premium grade materials & PVDF panels",
      icon: ShieldCheck,
    },
    {
      title: "Precision",
      desc: "Architectural alignment & accuracy",
      icon: Crosshair,
    },
    {
      title: "Reliability",
      desc: "On-time execution & transparent terms",
      icon: Clock,
    },
    {
      title: "Professionalism",
      desc: "Safety compliance & skilled craft",
      icon: Award,
    },
    {
      title: "Customer Satisfaction",
      desc: "Client-focused project delivery",
      icon: ThumbsUp,
    },
  ];

  return (
    <div className="bg-white border-y border-custom-light py-8 relative z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-custom-light">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className={`flex flex-col items-center text-center p-3 transition-transform hover:-translate-y-1 duration-300 ${index > 0 ? 'pt-4 md:pt-3' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-custom-light/50 border border-custom-light flex items-center justify-center text-cyan mb-3 shadow-sm group-hover:border-cyan">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-primary font-bold text-sm tracking-wide font-heading">
                  {item.title}
                </h3>
                <p className="text-custom-darkText text-xs mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
