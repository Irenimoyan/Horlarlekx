import React from 'react';
import { MessageSquare } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

export default function WhatsAppFloat() {
  return (
    <a
      href={companyInfo.contacts.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-emerald-400"
      aria-label="Chat with HORLARLEKX on WhatsApp"
      title="Chat on WhatsApp (07055534249)"
    >
      <div className="relative">
        {/* Animated pulse ring */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <MessageSquare className="w-6 h-6 fill-current relative z-10" />
      </div>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-extrabold tracking-wide uppercase pr-1">
        Chat with Us
      </span>
    </a>
  );
}
