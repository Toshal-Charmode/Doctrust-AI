import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Zap,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Layers,
  ArrowDownUp,
  Minimize2,
  Share2,
  Smartphone,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export function DocumentsNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      name: 'Tools',
      id: 'tools',
      href: '#tools',
      hasDropdown: true,
      items: [
        { title: 'PDF Converter', desc: 'Convert Word, Excel, PPT to & from PDF', icon: ArrowDownUp, href: '#converter' },
        { title: 'File Compressor', desc: 'Shrink PDF, image & video file sizes', icon: Minimize2, href: '#compressor' },
        { title: 'Merge & Split', desc: 'Combine multiple documents or split pages', icon: Layers, href: '#tools' },
        { title: 'Explore All 40+ Tools', desc: 'Every tool you need in one place', icon: Zap, href: '#tools', highlight: true },
      ],
    },
    {
      name: 'AI Tools',
      id: 'ai-tools',
      href: '#ai-tools',
      badge: 'NEW',
      hasDropdown: true,
      items: [
        { title: 'AI PDF Assistant', desc: 'Chat directly with your documents', icon: Sparkles, href: '#tools' },
        { title: 'Smart Summarizer', desc: 'Generate executive summaries in seconds', icon: FileText, href: '#tools' },
        { title: 'OCR & Text Scanner', desc: 'Extract editable text from scanned pages', icon: Zap, href: '#tools' },
      ],
    },
    { name: 'File Transfer', id: 'transfer', href: '#transfer' },
    { name: 'App', id: 'app', href: '#app' },
    { name: 'Pricing', id: 'pricing', href: '#pricing' },
    { name: 'Resources', id: 'resources', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
          : 'bg-white/60 backdrop-blur-xs border-b border-gray-100/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-200">
              <Layers className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#111827]">
                Documents
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
                .io
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <div
                key={link.id}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.id)}
                onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
              >
                <a
                  href={link.href}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg hover:text-[#111827] hover:bg-gray-100/70 transition-colors"
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white tracking-wider">
                      {link.badge}
                    </span>
                  )}
                  {link.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-transform" />
                  )}
                </a>

                {/* Dropdown Menu */}
                {link.hasDropdown && activeDropdown === link.id && (
                  <div className="absolute top-full left-0 w-72 pt-2 z-50">
                    <div className="p-2 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                      {link.items.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={idx}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                              item.highlight
                                ? 'bg-blue-50/60 text-blue-700 hover:bg-blue-50'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg shrink-0 ${
                                item.highlight
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-[#111827]">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-gray-500 line-clamp-1">
                                {item.desc}
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Auth / Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-700 hover:text-[#111827] px-3.5 py-2 rounded-lg hover:bg-gray-100/70 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
            >
              <span>Get started free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/register"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white"
            >
              Start Free
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-1">
            <a
              href="#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>File Tools</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="#converter"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>File Converter</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">Popular</span>
            </a>
            <a
              href="#compressor"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>File Compressor</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">-85%</span>
            </a>
            <a
              href="#transfer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>File Transfer</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-600">Wireless</span>
            </a>
            <a
              href="#app"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>iOS & iPad App</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">★ 4.7</span>
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              FAQ & Help
            </a>
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-500/25"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default DocumentsNavbar;
