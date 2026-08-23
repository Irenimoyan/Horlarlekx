import React from 'react';

export default function ProcessTimeline() {
  const steps = [
    {
      num: "01",
      title: "Consultation",
      desc: "Initial project discovery to understand architectural requirements, building type, aesthetic vision, and project timeline."
    },
    {
      num: "02",
      title: "Site Assessment",
      desc: "On-site physical inspection, laser elevation measurement, structural framing checks, and environmental assessment."
    },
    {
      num: "03",
      title: "Design & Planning",
      desc: "Development of 3D architectural renders, material specifications, joint engineering, and structural load calculations."
    },
    {
      num: "04",
      title: "Quotation",
      desc: "Transparent, itemized quotation breakdown including materials, fabrication, scaffolding, labor, and execution schedule."
    },
    {
      num: "05",
      title: "Fabrication & Prep",
      desc: "Off-site precision cutting of ACP panels, metal structural framing, glass tempering, and signage lettering assembly."
    },
    {
      num: "06",
      title: "Professional Installation",
      desc: "On-site substructure mounting, panel fitting, silicone weather-sealing, glass installation, and safety rigging."
    },
    {
      num: "07",
      title: "Quality Inspection",
      desc: "Rigorous quality check verifying panel joint alignment, weather seals, lighting circuitry, and structural stability."
    },
    {
      num: "08",
      title: "Project Completion",
      desc: "Final site cleanup, client walkthrough, sign-off handover, and ongoing maintenance guidelines."
    }
  ];

  return (
    <div className="relative">
      {/* Central connecting line for desktop */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-orange via-navy-700 to-brand-orange transform -translate-x-1/2 opacity-30" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="group relative bg-navy-900/90 rounded-xl p-6 border border-navy-800 hover:border-brand-orange/60 transition-all duration-300 shadow-md hover:shadow-navy-lg flex flex-col justify-between"
          >
            <div>
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono font-extrabold text-2xl text-brand-orange group-hover:scale-110 transition-transform">
                  {step.num}
                </span>
                <span className="w-8 h-8 rounded-full bg-navy-800 text-slate-400 group-hover:bg-brand-orange group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                  {idx + 1}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white font-heading group-hover:text-brand-orange transition-colors">
                {step.title}
              </h3>

              <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-navy-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Phase {idx < 4 ? 'Phase A' : 'Phase B'}</span>
              <span className="text-brand-orange font-bold">HORLARLEKX Quality</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
