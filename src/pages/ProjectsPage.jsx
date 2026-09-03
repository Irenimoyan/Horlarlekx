import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SectionHeader from '../components/SectionHeader';
import ProjectCard from '../components/ProjectCard';
import ProjectLightboxModal from '../components/ProjectLightboxModal';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { ArrowRight } from 'lucide-react';
import { projectsData, projectCategories } from '../data/projectsData';
import { getPublishedProjects } from '../firebase/projects';

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightboxProject, setActiveLightboxProject] = useState(null);
  const [allProjects, setAllProjects] = useState(projectsData);

  useEffect(() => {
    let isMounted = true;
    async function loadFirestoreProjects() {
      try {
        const firestoreProjects = await getPublishedProjects();
        if (isMounted && firestoreProjects && firestoreProjects.length > 0) {
          setAllProjects(firestoreProjects);
        }
      } catch (err) {
        console.warn('Using static projects fallback:', err.message);
      }
    }
    loadFirestoreProjects();
    return () => { isMounted = false; };
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? allProjects
    : allProjects.filter((p) => 
        p.category === selectedCategory || 
        (selectedCategory === 'ACP/ALUCOBOND' && p.category?.includes('ACP'))
      );

  return (
    <div className="pt-28 pb-20 section-double-bg-white text-custom-darkText">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Projects' }]} />

        <div className="py-8 border-b border-custom-light">
          <Badge variant="cyan">Project Portfolio</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-primary font-heading tracking-tight mt-3">
            Our Architectural & Cladding Work
          </h1>
          <p className="mt-4 text-base sm:text-lg text-custom-darkText max-w-3xl leading-relaxed">
            Explore our recent commercial, residential, corporate signage, and exterior building envelope projects completed across Nigeria.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="py-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none w-full max-w-full min-w-0">
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-cyan text-white shadow-md scale-105'
                    : 'bg-white text-custom-darkText hover:bg-custom-light border border-custom-light'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id || project.slug}
              project={project}
              onOpenLightbox={(p) => setActiveLightboxProject(p)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-primary rounded-2xl p-8 border border-cyan/40 text-center space-y-4 shadow-xl text-white">
          <h3 className="text-2xl font-bold text-white font-heading">Have a Similar Project Requirement?</h3>
          <p className="text-custom-light text-sm max-w-2xl mx-auto">
            Our architectural cladding, signage, and general contracting team is ready to review your blueprints and provide a competitive quote.
          </p>
          <Button to="/quote" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            REQUEST A QUOTE
          </Button>
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeLightboxProject && (
        <ProjectLightboxModal
          project={activeLightboxProject}
          onClose={() => setActiveLightboxProject(null)}
        />
      )}
    </div>
  );
}
