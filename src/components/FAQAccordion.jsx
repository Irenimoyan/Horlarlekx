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
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-custom-darkText/50" />
          <input
            type="text"
            placeholder="Search questions (e.g. ACP, quotation, locations)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-custom-light rounded-xl text-custom-darkText placeholder-custom-darkText/50 focus:outline-none focus:border-cyan text-sm shadow-sm"
          />
        </div>
      )}

      {filteredFaqs.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-custom-light text-custom-darkText/70 text-sm">
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
                  ? 'bg-white border-cyan/60 shadow-md'
                  : 'bg-white hover:bg-custom-light/30 border-custom-light'
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
                    isOpen ? 'bg-cyan text-white' : 'bg-custom-light text-cyan'
                  }`}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-primary font-heading">
                    {faq.question}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {faq.category && (
                    <div className="hidden sm:block">
                      <Badge variant="cyan" size="sm">{faq.category}</Badge>
                    </div>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 text-custom-darkText/50 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180 text-cyan' : ''
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-custom-darkText text-sm leading-relaxed border-t border-custom-light bg-custom-light/20">
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
