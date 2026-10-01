import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How does DocTrust AI detect manipulated or forged documents?',
    a: 'DocTrust AI utilizes a multi-layered verification pipeline combining high-resolution visual artifact detection (detecting pixel splices, micro-font variations, and compression anomalies), cryptographic checksum audits (validating MRZ, barcode, and digital certificate chains), and cross-database entity reconciliations.',
  },
  {
    q: 'How fast is document extraction and verification?',
    a: 'Standard documents such as government IDs, commercial invoices, and tax returns are processed and verified in under 400 milliseconds. Complex multi-page financial dossiers or legal binders are validated in under 1.8 seconds.',
  },
  {
    q: 'Is customer document data retained or used for AI training?',
    a: 'Never. DocTrust AI is architected on a zero-retention foundation. Files uploaded to our web console or REST API are processed inside isolated, ephemeral in-memory sandboxes and permanently purged immediately after verification. We never store or train models on user data.',
  },
  {
    q: 'What formats and languages does DocTrust AI support?',
    a: 'We support PDF, PNG, JPG, JPEG, TIFF, and DOCX across over 180 countries and 48 languages. Our multi-modal vision engine automatically handles rotated scans, mobile camera captures, and varying lighting angles without pre-processing.',
  },
  {
    q: 'Can we integrate DocTrust AI directly into our backend via API?',
    a: 'Yes! We provide robust REST endpoints, SDKs for Node.js, Python, and Go, and event-driven webhooks with HMAC SHA-256 signatures. Integration takes fewer than 15 lines of code, and sandbox keys are generated instantly.',
  },
  {
    q: 'How does the pricing work for high-volume enterprise verification?',
    a: 'We offer a free sandbox tier with 500 document checks per month, followed by scale-as-you-grow volume pricing. Enterprise plans include volume discounts, dedicated private VPC deployments, and custom SLA agreements.',
  },
];

export function AccordionFAQ({ onOpenUpload }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#F9FAFB] border-t border-gray-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight mb-3">
            Frequently Asked Questions
          </h2>

          <p className="text-base text-gray-600 max-w-lg mx-auto font-normal">
            Everything you need to know about DocTrust AI verification models, security protocols, and integration.
          </p>
        </div>

        {/* Smooth Accordion FAQ List with AnimatePresence */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-blue-300 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/10'
                    : 'bg-white/90 border-gray-200/80 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[#111827] pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-blue-50 text-blue-600 rotate-180' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100/70 font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827]">Have custom verification requirements?</div>
              <div className="text-[11px] text-gray-500">
                Our machine learning engineers can calibrate custom document schemas for your enterprise.
              </div>
            </div>
          </div>

          <button
            onClick={onOpenUpload}
            className="px-4.5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
          >
            Speak with an AI Engineer
          </button>
        </div>
      </div>
    </section>
  );
}

export default AccordionFAQ;
