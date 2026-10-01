import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Heart,
  Globe,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

export function DocumentsFooter() {
  const footerSections = [
    {
      title: 'Document Converters',
      links: [
        { label: 'Word to PDF', href: '#converter' },
        { label: 'PDF to Word', href: '#converter' },
        { label: 'Excel to PDF', href: '#converter' },
        { label: 'PowerPoint to PDF', href: '#converter' },
        { label: 'EPUB to PDF', href: '#tools' },
        { label: 'TXT to PDF', href: '#tools' },
      ],
    },
    {
      title: 'PDF Converters & Tools',
      links: [
        { label: 'Merge PDF', href: '#tools' },
        { label: 'Split PDF', href: '#tools' },
        { label: 'Compress PDF', href: '#compressor' },
        { label: 'Sign PDF Document', href: '#tools' },
        { label: 'Protect & Encrypt PDF', href: '#tools' },
        { label: 'Watermark PDF Pages', href: '#tools' },
      ],
    },
    {
      title: 'Video Converters',
      links: [
        { label: 'MP4 to MP3 Audio', href: '#tools' },
        { label: 'Compress Video Files', href: '#compressor' },
        { label: 'MOV to MP4 Converter', href: '#tools' },
        { label: 'Video to Animated GIF', href: '#tools' },
        { label: 'Trim & Cut Video', href: '#tools' },
        { label: 'M4V to MP4 Converter', href: '#tools' },
      ],
    },
    {
      title: 'Image Converters',
      links: [
        { label: 'HEIC to JPG Converter', href: '#tools' },
        { label: 'PNG to PDF Document', href: '#converter' },
        { label: 'JPG to PNG High-Res', href: '#tools' },
        { label: 'WebP to JPG Converter', href: '#tools' },
        { label: 'SVG to PNG Vector', href: '#tools' },
        { label: 'Remove Image Background', href: '#tools' },
      ],
    },
    {
      title: 'Audio Converters',
      links: [
        { label: 'WAV to MP3 Converter', href: '#tools' },
        { label: 'Audio Cutter & Trimmer', href: '#tools' },
        { label: 'MP3 File Compressor', href: '#compressor' },
        { label: 'FLAC to MP3 Studio', href: '#tools' },
        { label: 'Extract Audio from Video', href: '#tools' },
        { label: 'M4A to MP3 Converter', href: '#tools' },
      ],
    },
    {
      title: 'Company & Resources',
      links: [
        { label: 'About Documents.io', href: '#app' },
        { label: 'Trust & Privacy Center', href: '#security' },
        { label: 'ISO 27001 Security', href: '#security' },
        { label: 'Documents iOS App', href: '#app' },
        { label: 'Developer API Docs', href: '/register' },
        { label: 'Help & Knowledgebase', href: '#faq' },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 text-xs">
      {/* Top Banner / Newsletter or Brand Pitch */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-12 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#111827]">
                  Documents
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  .io
                </span>
              </div>
              <p className="text-xs text-gray-500">
                The all-in-one document suite for seamless modern productivity.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>Get Started Free</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/login"
              className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* 6-Column SEO-Friendly Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pt-12 pb-16">
          {footerSections.map((section, idx) => (
            <div key={idx} className="space-y-3.5">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link, lIdx) => (
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

        {/* Bottom Bar: Readdle-style Logo, Copyright, Socials & Legal */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          {/* Left: Readdle-Style Brand attribution & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span className="font-semibold text-gray-800">Documents.io</span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span>Inspired by Readdle craftsmanship</span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span>© 2026 Documents.io Inc. All rights reserved.</span>
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
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-[#111827] transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          {/* Right: Legal Links */}
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <Link to="/register" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <Link to="/register" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/register" className="hover:text-gray-900 transition-colors">
              Security
            </Link>
            <Link to="/register" className="hover:text-gray-900 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default DocumentsFooter;
