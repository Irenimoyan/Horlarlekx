import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { servicesData } from '../data/servicesData';
import { companyInfo } from '../data/companyInfo';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Cladding & Facades',
    'Signage & Branding',
    'Aluminium & Glass',
    'Finishing & Carpentry',
    'General Construction',
    'Design & Planning'
  ];

  const filteredServices = selectedCategory === 'All'
    ? servicesData
    : servicesData.filter((s) => s.category === selectedCategory);

  return (
    <div className="pt-28 pb-20 section-double-bg-white text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Services' }]} />

        <div className="py-8 border-b border-custom-light">
          <Badge variant="cyan">Turnkey Solutions</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-primary font-heading tracking-tight mt-3">
            Our Architectural & Construction Services
          </h1>
          <p className="mt-4 text-base sm:text-lg text-custom-darkText max-w-3xl leading-relaxed">
            {companyInfo.coreStatement}
          </p>
        </div>

        {/* Category Filters */}
        <div className="py-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none w-full max-w-full min-w-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-cyan text-white shadow-md scale-105'
                    : 'bg-white text-custom-darkText hover:bg-custom-light border border-custom-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Bottom Quote Banner */}
        <div className="mt-16 bg-primary rounded-2xl p-8 border border-cyan/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div>
            <Badge variant="accent" size="sm">Need a Customized Service Package?</Badge>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mt-2">
              Combining Multiple Building & Finishing Services?
            </h3>
            <p className="text-custom-light text-sm mt-1">
              Through our general contracting services, HORLARLEKX can coordinate all your facade, signage, glass, and interior finishing needs under one contract.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Button to="/quote" variant="primary" size="md" icon={ArrowRight} iconPosition="right">
              REQUEST A QUOTE
            </Button>
            <Button href={companyInfo.contacts.whatsappLink} variant="whatsapp" size="md" icon={PhoneCall}>
              WhatsApp
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
