import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import Badge from './Badge';

export default function FAQAccordion({ faqs, showSearch = false, className = '' }) {
  const [openId, setOpenId] = useState(faqs[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {showSearch && (
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions (e.g. ACP, quotation, locations)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-navy-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-orange text-sm shadow-inner"
          />
        </div>
      )}

      {filteredFaqs.length === 0 ? (
        <div className="p-8 text-center bg-navy-900 rounded-xl border border-navy-800 text-slate-400 text-sm">
          No questions found matching "{searchQuery}".
        </div>
      ) : (
        filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-navy-900 border-brand-orange/60 shadow-lg'
                  : 'bg-navy-900/60 hover:bg-navy-900 border-navy-800'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between space-x-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'bg-brand-orange text-white' : 'bg-navy-800 text-brand-orange'
                  }`}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-white font-heading">
                    {faq.question}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {faq.category && (
                    <div className="hidden sm:block">
                      <Badge variant="navy" size="sm">{faq.category}</Badge>
                    </div>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180 text-brand-orange' : ''
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-navy-800/60 bg-navy-950/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
