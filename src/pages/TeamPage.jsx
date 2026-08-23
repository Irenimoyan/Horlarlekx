import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { executiveLeadership, specialistTeams } from '../data/teamData';
import { ShieldCheck, HardHat, CheckCircle2, UserCheck, Layers, Frame, Box, Signpost, Wrench, Hammer, Home, Grid, ArrowRight } from 'lucide-react';

const iconMap = {
  Layers, Frame, Box, Signpost, Wrench, Hammer, Home, Grid, HardHat
};

export default function TeamPage() {
  return (
    <div className="pt-28 pb-20 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Our Team' }]} />

        <div className="py-8 border-b border-navy-800">
          <Badge variant="orange">Professional Craftsmanship</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight mt-3">
            The HORLARLEKX Project & Engineering Team
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Our multi-disciplinary workforce unites certified cladding technicians, structural steel fabricators, glass installers, carpenters, and experienced site managers.
          </p>
        </div>

        {/* 1. Executive Leadership Section (Clean Placeholders as requested) */}
        <div className="py-16 border-b border-navy-800">
          <div className="bg-navy-900 rounded-2xl p-8 border border-navy-800 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Photo Placeholder */}
              <div className="w-40 h-40 rounded-2xl bg-navy-950 border-2 border-dashed border-navy-700 flex flex-col items-center justify-center p-4 text-center shrink-0">
                <UserCheck className="w-10 h-10 text-brand-orange mb-2" />
                <Badge variant="placeholder" size="sm">Photo To Be Provided</Badge>
              </div>

              {/* Bio Placeholder */}
              <div className="space-y-3 text-center md:text-left">
                <Badge variant="navy">{executiveLeadership.title}</Badge>
                
                <h3 className="text-2xl font-bold text-white font-heading">
                  Name: <span className="font-mono text-amber-400">{executiveLeadership.name}</span>
                </h3>

                <p className="text-xs text-slate-400 font-mono">
                  Years of Experience: <span className="text-amber-400">{executiveLeadership.experienceYears}</span>
                </p>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Biography: <span className="italic text-slate-400">{executiveLeadership.biography}</span>
                </p>

                <p className="text-slate-300 text-xs leading-relaxed border-t border-navy-800 pt-3">
                  {executiveLeadership.roleDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Specialized Craft Disciplines Grid */}
        <div className="py-16">
          <SectionHeader
            badgeText="Multi-Trade Expertise"
            title="Our Technical & Craft Disciplines"
            subtitle="Dedicated teams organized across specific building envelope and finishing capabilities."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialistTeams.map((team, idx) => {
              const Icon = iconMap[team.iconName] || HardHat;
              return (
                <div
                  key={idx}
                  className="bg-navy-900/90 rounded-xl p-6 border border-navy-800 hover:border-brand-orange/60 transition-all duration-300 shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-navy-950 border border-navy-700 text-brand-orange flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-brand-orange transition-colors">
                      {team.role}
                    </h3>

                    <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {team.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-navy-800/80 space-y-1.5">
                      <span className="text-[11px] font-mono text-slate-400 uppercase block font-bold">Key Capabilities:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {team.keyCapabilities.map((cap, cIdx) => (
                          <span key={cIdx} className="text-[11px] bg-navy-950 px-2 py-0.5 rounded text-slate-300 border border-navy-800">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-navy-800 text-[11px] font-mono text-slate-400">
                    HORLARLEKX Division #{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Work With Our Team CTA */}
        <div className="bg-navy-900 rounded-2xl p-8 border border-brand-orange/40 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white font-heading">Interested in Joining Our Technical Team?</h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            We work with skilled professionals across construction, cladding, aluminium, glass, and carpentry disciplines in Nigeria.
          </p>
          <Button to="/careers" variant="outline" size="md" icon={ArrowRight} iconPosition="right">
            Explore Careers at HORLARLEKX
          </Button>
        </div>

      </div>
    </div>
  );
}
