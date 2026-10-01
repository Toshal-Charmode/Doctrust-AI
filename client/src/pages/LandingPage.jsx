import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Globe,
  ChevronDown,
  UploadCloud,
  Code,
  CheckCircle2,
  FileText,
  ScanFace,
  Shield,
  Lock,
  Server,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Check,
  X,
  FileSpreadsheet,
  Scale,
} from 'lucide-react';
import UploadModal from '../components/doctrust/UploadModal';
import AIChatWidget from '../components/doctrust/AIChatWidget';
import Toast from '../components/doctrust/Toast';
import { useLanguage } from '../context/LanguageContext';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-white">
      {/* Subtle Liquid/Fluid Mesh using Framer Motion */}
      <motion.div
        animate={{
          x: ['-5%', '15%', '-5%'],
          y: ['-10%', '10%', '-10%'],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/60 blur-[120px]"
      />
      <motion.div
        animate={{
          x: ['10%', '-15%', '10%'],
          y: ['15%', '-10%', '15%'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-100/50 blur-[120px]"
      />
      <motion.div
        animate={{
          x: ['-10%', '20%', '-10%'],
          y: ['20%', '-5%', '20%'],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute bottom-[-20%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-teal-50/60 blur-[100px]"
      />

      {/* Abstract Paper/Document Animations */}
      {/* Document 1 */}
      <motion.div
        animate={{
          y: ['110vh', '-20vh'],
          x: ['10vw', '15vw'],
          rotate: [0, 45],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute left-[15%] opacity-[0.03] text-blue-900"
      >
        <svg width="120" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      </motion.div>

      {/* Document 2 */}
      <motion.div
        animate={{
          y: ['110vh', '-20vh'],
          x: ['70vw', '65vw'],
          rotate: [-15, -60],
        }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear', delay: 5 }}
        className="absolute right-[20%] opacity-[0.04] text-blue-800"
      >
        <svg width="180" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </motion.div>

      {/* Document 3 */}
      <motion.div
        animate={{
          y: ['-20vh', '110vh'],
          x: ['40vw', '45vw'],
          rotate: [180, 220],
        }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear', delay: 15 }}
        className="absolute left-[45%] opacity-[0.02] text-indigo-900"
      >
        <svg width="150" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </motion.div>
    </div>
  );
};

const Navbar = ({ onOpenUpload }) => {
  const [langOpen, setLangOpen] = useState(false);
  const { currentLang, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100/50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 flex items-center">
            DocTrust <span className="ml-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100/50 relative -top-1">AI</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#sandbox" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            Live Sandbox
          </a>
          <a href="#forensic" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            Forensic AI
          </a>
          <a href="#security" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            Security & Trust
          </a>
          <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            Audits & POs
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-500" />
              {languages.find((l) => l.code === currentLang?.code)?.name || 'English'}
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="py-1">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l);
                          setLangOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/login" className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-gray-900 mr-2">
            Sign In
          </Link>
          <button
            type="button"
            onClick={onOpenUpload}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
          >
            Start Verifying <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = ({ onOpenUpload, onOpenApiModal }) => {
  return (
    <section className="relative z-10 pt-36 pb-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 text-blue-600 text-sm font-semibold mb-8 shadow-sm"
      >
        <Sparkles className="w-4 h-4" />
        DocTrust Engine 4.2 • Next-Gen AI Verification
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-[4rem] sm:text-[5.5rem] leading-[1.05] font-extrabold tracking-tight text-gray-900 mb-6"
      >
        Read. Verify. Trust.<br />
        <span className="text-blue-600">instantly.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl sm:text-2xl text-gray-500 font-medium max-w-3xl mb-12"
      >
        Upload your documents and let our AI extract, verify, and process data securely in milliseconds.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <button
          type="button"
          onClick={onOpenUpload}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <UploadCloud className="w-5 h-5" />
          Upload a Document <ChevronRight className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onOpenApiModal}
          className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer"
        >
          <Code className="w-5 h-5" />
          View API Docs
        </button>
      </motion.div>
    </section>
  );
};

const LiveSandbox = ({ onOpenUpload }) => {
  const [activeTab, setActiveTab] = useState('identity');

  const tabData = {
    identity: {
      label: 'Identity & ID',
      title: 'Awaiting Document Upload: Identity & ID',
      description: 'Drop a sample ID card, passport, or driver license to see instant AI extraction & fraud checks.',
      sample: 'Sample_Passport_DE_4910.pdf',
      confidence: '99.8%',
      icon: ScanFace,
    },
    invoice: {
      label: 'Invoice & PO',
      title: 'Awaiting Document Upload: Invoice & PO',
      description: 'Drop vendor invoices, purchase orders, or delivery receipts for automated 3-way match reconciliation.',
      sample: 'Acme_Supplies_Invoice_INV-9042.pdf',
      confidence: '99.4%',
      icon: FileSpreadsheet,
    },
    legal: {
      label: 'Legal Contracts',
      title: 'Awaiting Document Upload: Legal Contracts',
      description: 'Drop NDAs, commercial agreements, or master service agreements for clause verification and audit trails.',
      sample: 'Enterprise_Service_Agreement_v3.pdf',
      confidence: '99.1%',
      icon: Scale,
    },
  };

  const current = tabData[activeTab];
  const IconComponent = current.icon;

  return (
    <motion.section
      id="sandbox"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      className="relative z-10 max-w-5xl mx-auto px-6 mb-32"
    >
      {/* Decorative Speed Badge */}
      <div className="absolute -top-4 left-10 md:left-20 z-20 bg-white shadow-lg border border-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-bold text-gray-800">0.4s Verification Speed</span>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-200/60 overflow-hidden backdrop-blur-xl">
        {/* Mock OS Header */}
        <div className="bg-gray-50/80 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest absolute left-1/2 -translate-x-1/2 hidden sm:block">
            DocTrust AI Verification Console • Live Sandbox
          </div>
        </div>

        {/* Sandbox Content */}
        <div className="p-8">
          <div className="flex justify-end mb-6">
            <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-xl">
              {Object.keys(tabData).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    activeTab === key
                      ? 'bg-white shadow-sm border border-gray-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tabData[key].label}
                </button>
              ))}
            </div>
          </div>

          <div
            onClick={onOpenUpload}
            className="w-full border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-12 flex flex-col items-center justify-center transition-all hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 border border-gray-100 group-hover:scale-110 transition-transform">
              <IconComponent className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{current.title}</h3>
            <p className="text-gray-500 text-sm font-medium mb-8 text-center max-w-md">
              {current.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Sample: {current.sample}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full shadow-sm text-emerald-700 font-bold text-sm">
                Confidence: {current.confidence}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const UserAvatarIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-3.353 0-10 1.671-10 5v3h20v-3c0-3.329-6.647-5-10-5z" />
  </svg>
);

const ForensicFeature = ({ onOpenUpload }) => {
  return (
    <section id="forensic" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
            <Shield className="w-3.5 h-3.5" /> AI Document Verification
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Spot forged documents with forensic AI precision
          </h2>
          <p className="text-lg text-gray-600 font-medium mb-10 leading-relaxed">
            Verify passports, national IDs, driver licenses, and legal certificates in real-time. Detect digital splices, font replacements, physical surface tampering, and face liveness anomalies in milliseconds.
          </p>

          <ul className="space-y-4 mb-10">
            {[
              'Hologram, microprint, and UV security pattern recognition',
              'ICAO 9303 MRZ and PDF417 barcode cryptographic checksum validation',
              'Pixel-level font artifact, metadata, and digital splice inspection',
              'Instant liveness and face biometric verification with 99.8% precision',
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-0.5 bg-blue-100 rounded-full p-0.5 text-blue-600">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-gray-700 font-semibold">{text}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onOpenUpload}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Test Document Verification <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Right Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Forensic Inspection</div>
              <div className="text-lg font-bold text-gray-900">Biometric ID & Credential Audit</div>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Scanning Active
            </div>
          </div>

          {/* ID Card Mockup with Scanning Laser */}
          <div className="relative bg-[#0f172a] rounded-2xl p-6 overflow-hidden shadow-2xl mb-4 aspect-[1.6/1]">
            {/* Hologram Overlay subtle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/5 to-purple-400/10 pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white">EU</div>
                <div className="text-white font-bold text-sm tracking-wider">NATIONAL IDENTITY CARD</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-400/90 shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
            </div>

            <div className="flex gap-6">
              <div className="w-24 h-32 rounded-xl bg-slate-800 border border-slate-700 relative overflow-hidden flex items-end justify-center">
                <UserAvatarIcon className="w-20 h-20 text-slate-600 translate-y-2" />
                <div className="absolute bottom-2 left-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 text-[8px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                  MATCH 99%
                </div>
              </div>
              <div className="flex-1 space-y-4 pt-1">
                <div>
                  <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">Name</div>
                  <div className="text-white text-sm font-bold tracking-wide">VANCE, ALEXANDER M.</div>
                </div>
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">Document ID</div>
                    <div className="text-slate-200 text-xs font-mono">D491-U982-A</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">Expiry Date</div>
                    <div className="text-slate-200 text-xs font-mono">2032-08-14</div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-cyan-400/70 text-[10px] font-mono tracking-widest font-bold">
                    I&lt;UTOEIRIKSSON&lt;&lt;ANNA&lt;MARIA&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Scanning Laser */}
            <motion.div
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-10 pointer-events-none"
            >
              <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-cyan-400/20 to-transparent" />
            </motion.div>
          </div>

          {/* Verification Result Card */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-extrabold text-gray-900">Status: VERIFIED & AUTHENTIC</div>
              <div className="text-emerald-700 text-xs font-medium mt-0.5">Forensic security score: 99.8% • Zero forgery signals</div>
            </div>
            <div className="bg-white border border-emerald-200 text-emerald-600 font-bold px-3 py-1 rounded text-xs">
              PASS
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SecuritySection = () => {
  return (
    <section id="security" className="bg-gray-900 py-24 relative z-10 text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-16">Bank-Grade Security for Your Sensitive Data</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">End-to-End Encryption</h3>
            <p className="text-gray-400 font-medium text-sm max-w-xs">Data is encrypted in transit and at rest using AES-256 military-grade standards.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mb-6">
              <Server className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Zero Data Retention</h3>
            <p className="text-gray-400 font-medium text-sm max-w-xs">We do not store your documents permanently. Data is processed in memory and instantly sanitized.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ISO 27001 & GDPR Compliant</h3>
            <p className="text-gray-400 font-medium text-sm max-w-xs">Audited globally to ensure strict adherence to international privacy and security standards.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ApiDocsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">DocTrust AI REST API</h3>
            <p className="text-xs text-slate-400">cURL and SDK integration endpoints</p>
          </div>
        </div>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold">POST</span> /api/documents/upload
            <div className="text-slate-400 text-[11px] mt-1">Accepts multipart/form-data with documents for classification and 3-way match validation.</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-blue-400 font-bold">POST</span> /api/face-auth/verify
            <div className="text-slate-400 text-[11px] mt-1">Accepts live camera capture and challengeId for biometric step-up authentication.</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-purple-400 font-bold">POST</span> /api/validation/compare
            <div className="text-slate-400 text-[11px] mt-1">Performs cross-document purchase order, invoice, and receiving receipt reconciliation.</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function LandingPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  const showToast = (toastObj) => {
    setActiveToast(toastObj);
  };

  const handleDocumentVerified = (doc) => {
    showToast({
      title: 'Document Verified Successfully',
      message: `${doc.name} authenticated with ${doc.securityScore} confidence score. Zero tampering detected.`,
      type: 'success',
      tag: 'AI Verified',
    });
  };

  return (
    <div className="min-h-screen bg-transparent font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden relative flex flex-col">
      <AnimatedBackground />

      <Navbar onOpenUpload={() => setIsUploadModalOpen(true)} />

      <main className="flex-1">
        <HeroSection
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenApiModal={() => setIsApiModalOpen(true)}
        />
        <LiveSandbox onOpenUpload={() => setIsUploadModalOpen(true)} />
        <ForensicFeature onOpenUpload={() => setIsUploadModalOpen(true)} />
        <SecuritySection />
      </main>

      {/* Floating Chat Trigger Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 hover:bg-black transition-all cursor-pointer border-2 border-white/10"
        title="Ask DocTrust AI Assistant"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </motion.button>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onVerified={handleDocumentVerified}
      />

      {/* API Docs Modal */}
      <ApiDocsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      {/* Grounded RAG Chat Assistant */}
      <AIChatWidget
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />

      {/* Floating Toast Notification */}
      <Toast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
      />
    </div>
  );
}
