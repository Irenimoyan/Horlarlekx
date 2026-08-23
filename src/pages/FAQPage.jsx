import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SectionHeader from '../components/SectionHeader';
import FAQAccordion from '../components/FAQAccordion';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { ArrowRight } from 'lucide-react';
import { faqData } from '../data/faqData';

export default function FAQPage() {
  return (
    <div className="pt-28 pb-20 bg-navy-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

        <div className="py-8 border-b border-navy-800 text-center">
          <Badge variant="orange">Help Center</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight mt-3">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about HORLARLEKX ACP cladding, architectural facade engineering, quotations, and operational coverage.
          </p>
        </div>

        <div className="py-12">
          <FAQAccordion faqs={faqData} showSearch={true} />
        </div>

        <div className="p-8 rounded-2xl bg-navy-900 border border-brand-orange/40 text-center space-y-4">
          <h3 className="text-xl font-bold text-white font-heading">Have a Specific Project Question?</h3>
          <p className="text-slate-300 text-sm">
            If your question is not listed above, our engineering team is available to discuss your blueprints directly.
          </p>
          <div className="pt-2 flex justify-center space-x-4">
            <Button to="/contact" variant="primary" size="md">
              Contact Our Office
            </Button>
            <Button to="/quote" variant="outline" size="md">
              Request a Quotation
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
