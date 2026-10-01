import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Globe,
  ChevronDown,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { LANGUAGES } from './Navbar';

export function Footer({ currentLang, onSelectLang, onOpenUpload }) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const footerLangRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (footerLangRef.current && !footerLangRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const footerColumns = [
    {
      title: 'Solutions',
      links: [
        { label: 'KYC & Identity Verification', href: '#features' },
        { label: 'Invoice 3-Way Match Audit', href: '#features' },
        { label: 'Fraud & Tamper Detection', href: '#features' },
        { label: 'Bank Statement Extraction', href: '#use-cases' },
        { label: 'Cross-Border AML Screening', href: '#use-cases' },
        { label: 'Tax & Financial Audit', href: '#use-cases' },
      ],
    },
    {
      title: 'Technology',
      links: [
        { label: 'Multi-Modal Vision Engine', href: '#features' },
        { label: 'Forensic OCR Architecture', href: '#features' },
        { label: 'Verification REST API', href: '#api-preview' },
        { label: 'Event-Driven Webhooks', href: '#api-preview' },
        { label: 'Air-Gapped Private VPC', href: '#security' },
        { label: 'Zero-Knowledge Security', href: '#security' },
      ],
    },
    {
      title: 'Legal & Privacy',
      links: [
        { label: 'ISO 27001 Certification', href: '#security' },
        { label: 'SOC-2 Type II Report', href: '#security' },
        { label: 'Privacy Policy', href: '#security' },
        { label: 'Terms of Service', href: '#security' },
        { label: 'GDPR / CCPA Compliance', href: '#security' },
        { label: 'Security Disclosures', href: '#security' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About DocTrust AI', href: '#features' },
        { label: 'Trust & Safety Center', href: '#security' },
        { label: 'Customer Case Studies', href: '#use-cases' },
        { label: 'Documentation & Guides', href: '#faq' },
        { label: 'Careers (We are hiring!)', href: '#faq' },
        { label: 'Contact Enterprise Sales', href: '#pricing' },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top Callout & Quick Action */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-12 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#111827]">
                  DocTrust
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  AI
                </span>
              </div>
              <p className="text-xs text-gray-500">
                The gold standard in intelligent document verification and forensic audit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <span>Test Free in Sandbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/login"
              className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* 4 Massive SEO Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 pb-16">
          {footerColumns.map((col, idx) => (
            <div key={idx} className="space-y-3.5">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="text-gray-500 hover:text-blue-600 transition-colors inline-block text-[13px]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright, Socials, and Secondary Language Switcher in the Bottom Corner */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          {/* Left: Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span className="font-bold text-[#111827]">DocTrust AI</span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span>Inspired by Documents.io craftsmanship</span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span>© 2026 DocTrust AI Technologies Inc. All rights reserved.</span>
          </div>

          {/* Center: Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-[#111827] transition-colors"
              aria-label="Twitter / X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-[#111827] transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-[#111827] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>

          {/* Right: Secondary Language Switcher in the Bottom Corner */}
          <div className="relative" ref={footerLangRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200/80 text-gray-700 font-semibold text-xs transition-colors cursor-pointer border border-gray-200/60"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentLang?.flag} {currentLang?.name || 'English'}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl border border-gray-200 shadow-xl p-1.5 z-50 ring-1 ring-black/5">
                <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase">
                  Change Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLang(lang);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      currentLang?.code === lang.code
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    {currentLang?.code === lang.code && (
                      <Check className="w-3 h-3 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
