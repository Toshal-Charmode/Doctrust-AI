import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'What is Documents.io?',
    a: 'Documents.io is a modern, unified document productivity platform. It empowers individuals and teams to convert, compress, edit, annotate, summarize, and wirelessly transfer any document or media file format with zero friction directly in your browser or through our native iOS/iPadOS app.',
  },
  {
    q: 'Can I convert files for free?',
    a: 'Yes, 100%! All core file conversion, basic compression, and viewing utilities are completely free to use without requiring a credit card. For power users and businesses processing hundreds of batch files or utilizing advanced AI PDF summarization, we offer affordable premium plans with higher quotas.',
  },
  {
    q: 'Is Documents.io safe and private?',
    a: 'Absolutely. We prioritize your privacy above all else. All transfers and operations are protected with 256-bit TLS encryption. Files processed on our web platform are automatically and permanently purged from temporary memory within 2 hours. We never sell your data or train AI models on your files.',
  },
  {
    q: 'What file formats are supported?',
    a: 'Documents.io supports over 40+ industry-standard formats, including PDF, DOCX, XLSX, PPTX, JPG, PNG, HEIC, WebP, SVG, MP4, MOV, MP3, WAV, FLAC, EPUB, TXT, and CSV. You can convert bidirectionally between virtually any format.',
  },
  {
    q: 'How does the wireless file transfer work?',
    a: 'Our wireless transfer technology operates via direct local Wi-Fi and peer-to-peer WebRTC connections. When both devices are connected to the same network or scan the pairing QR code, files are transferred directly between devices at speeds up to 85 MB/s without uploading to a third-party cloud server.',
  },
  {
    q: 'Do I need to install any desktop software?',
    a: 'No desktop installation is required! The entire Documents.io suite runs natively in all modern web browsers (Chrome, Safari, Edge, Firefox). If you are on an iPhone or iPad, you can additionally download our award-winning Documents iOS app for an even faster offline experience.',
  },
];

export function FAQSection() {
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

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-3">
            Frequently Asked Questions
          </h2>

          <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
            Everything you need to know about Documents.io file tools, privacy standards, and supported platforms.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-blue-200 shadow-md shadow-blue-500/5'
                    : 'bg-white/80 border-gray-200/80 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full py-4.5 px-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
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

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100/60 animate-in fade-in duration-150 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827]">Have more questions?</div>
              <div className="text-[11px] text-gray-500">
                Our customer support team is available 24/7 to assist you.
              </div>
            </div>
          </div>

          <Link
            to="/register"
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors shrink-0"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
