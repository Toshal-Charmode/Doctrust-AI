import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Globe,
  ChevronDown,
  UploadCloud,
  Code,
  Sparkles,
  ChevronRight,
  FileCheck,
  ScanFace,
  CheckCircle2,
  Lock,
  ArrowRight,
  Activity,
  X,
  MessageSquare,
} from 'lucide-react';
import UploadModal from '../components/doctrust/UploadModal';
import AIChatWidget from '../components/doctrust/AIChatWidget';
import Toast from '../components/doctrust/Toast';
import { useLanguage } from '../context/LanguageContext';

const LiquidBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-white">
      {/* 
        Using mix-blend-multiply on a white background with highly saturated colors 
        creates that deep, rich, fluid ink/liquid effect when they overlap.
      */}
      <motion.div
        animate={{
          x: ['-10%', '20%', '-10%'],
          y: ['-10%', '10%', '-10%'],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-blue-500 opacity-60 mix-blend-multiply filter blur-[120px]"
      />

      <motion.div
        animate={{
          x: ['20%', '-15%', '20%'],
          y: ['15%', '-20%', '15%'],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-500 opacity-60 mix-blend-multiply filter blur-[140px]"
      />

      <motion.div
        animate={{
          x: ['-15%', '25%', '-15%'],
          y: ['20%', '-10%', '20%'],
          scale: [0.9, 1.2, 0.9],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute bottom-[-20%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-400 opacity-60 mix-blend-multiply filter blur-[120px]"
      />

      <motion.div
        animate={{
          x: ['15%', '-20%', '15%'],
          y: ['-15%', '25%', '-15%'],
          scale: [1, 1.4, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        className="absolute bottom-[-10%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-violet-500 opacity-60 mix-blend-multiply filter blur-[130px]"
      />

      {/* A subtle noise overlay to give it a premium matte/paper texture over the liquid */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

const Navbar = ({ onOpenUpload, onOpenApiModal }) => {
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentLang, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', label: 'EN' },
    { code: 'es', name: 'Spanish', label: 'ES' },
    { code: 'fr', name: 'French', label: 'FR' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <ShieldCheck className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center">
            DocTrust <span className="ml-1.5 text-[10px] font-black text-gray-900 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200/50 shadow-sm uppercase tracking-wider relative -top-1">AI</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 bg-white/30 backdrop-blur-md border border-white/40 px-8 py-3 rounded-full shadow-sm">
          <a href="#features" className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">
            Solutions
          </a>
          <button
            type="button"
            onClick={onOpenApiModal}
            className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Verification API
          </button>
          <a href="#features" className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">
            Use Cases
          </a>
          <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">
            Biometric Vault
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 hover:bg-white/60 text-sm font-bold text-gray-800 transition-all shadow-sm cursor-pointer"
            >
              <Globe className="w-4 h-4 text-gray-900" />
              {languages.find((l) => l.code === currentLang?.code)?.label || 'EN'}
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-32 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 overflow-hidden z-50"
                >
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setLangOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/login"
            className="hidden sm:block text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            Sign In
          </Link>

          <button
            type="button"
            onClick={onOpenUpload}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black hover:shadow-xl hover:shadow-gray-900/20 transition-all active:scale-95 group cursor-pointer"
          >
            Start Verifying <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = ({ onOpenUpload, onOpenApiModal }) => {
  return (
    <section className="relative z-10 pt-40 pb-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center min-h-[90vh] justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 text-gray-900 text-sm font-bold mb-10 shadow-lg shadow-black/5"
      >
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        DocTrust Engine 4.2 is now live
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        className="text-[4.5rem] sm:text-[6.5rem] leading-[1.05] font-black tracking-tighter text-gray-900 mb-8"
      >
        Read. Verify. Trust.<br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">
          instantly.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="text-xl sm:text-2xl text-gray-800 font-semibold max-w-3xl mb-14 leading-relaxed"
      >
        Upload your documents and let our forensic AI extract, verify, and process data securely in milliseconds.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <button
          type="button"
          onClick={onOpenUpload}
          className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-black shadow-2xl shadow-gray-900/30 transition-all hover:-translate-y-1 cursor-pointer"
        >
          <UploadCloud className="w-6 h-6" />
          Upload a Document
        </button>
        <button
          type="button"
          onClick={onOpenApiModal}
          className="w-full sm:w-auto bg-white/60 backdrop-blur-xl text-gray-900 border-2 border-white/80 px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-white/80 transition-all shadow-lg shadow-black/5 hover:-translate-y-1 cursor-pointer"
        >
          <Code className="w-6 h-6" />
          View API Docs
        </button>
      </motion.div>
    </section>
  );
};

const GlassFeatures = () => {
  return (
    <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 shadow-2xl shadow-blue-900/5 hover:bg-white/50 transition-colors"
        >
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30">
            <ScanFace className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Facial Biometrics</h3>
          <p className="text-gray-700 font-medium">Cross-match ID photos with live selfies using neural embeddings to detect spoofing in real-time.</p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 shadow-2xl shadow-indigo-900/5 hover:bg-white/50 transition-colors"
        >
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30">
            <FileCheck className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Forensic Audit</h3>
          <p className="text-gray-700 font-medium">Detect pixel splices, metadata tampering, and forged font replacements instantly.</p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 shadow-2xl shadow-cyan-900/5 hover:bg-white/50 transition-colors"
        >
          <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Zero Latency</h3>
          <p className="text-gray-700 font-medium">Process and verify highly complex financial and legal documents in under 400 milliseconds.</p>
        </motion.div>
      </div>
    </section>
  );
};

const ApiDocsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 text-gray-900 relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">DocTrust AI API Reference</h3>
            <p className="text-xs text-gray-500 font-semibold">Integrate automated document verification into your pipeline</p>
          </div>
        </div>
        <div className="space-y-3 text-xs font-mono">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-emerald-600 font-bold">POST</span> /api/documents/upload
            <div className="text-gray-600 text-[11px] mt-1 font-sans font-medium">Upload multi-page PDFs, PNGs, and invoices for automated classification and 3-way match audit.</div>
          </div>
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-blue-600 font-bold">POST</span> /api/face-auth/verify
            <div className="text-gray-600 text-[11px] mt-1 font-sans font-medium">Live biometric camera challenge verification using 128-dimensional normalized facial embeddings.</div>
          </div>
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-purple-600 font-bold">POST</span> /api/validation/compare
            <div className="text-gray-600 text-[11px] mt-1 font-sans font-medium">Cross-document reconciliation across Purchase Orders, Invoices, and Delivery Receipts.</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 text-white hover:bg-black rounded-xl text-xs font-bold transition-all cursor-pointer"
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
    <div className="min-h-screen bg-transparent font-sans selection:bg-gray-900 selection:text-white relative flex flex-col overflow-x-hidden">
      <LiquidBackground />

      <Navbar
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      <main className="flex-1">
        <HeroSection
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenApiModal={() => setIsApiModalOpen(true)}
        />
        <GlassFeatures />
      </main>

      {/* Decorative footer hint */}
      <footer className="relative z-10 border-t border-white/40 bg-white/20 backdrop-blur-lg py-8 text-center text-sm font-bold text-gray-600">
        <p>© 2026 DocTrust AI. Hackathon Edition.</p>
      </footer>

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

      {/* Floating Chat Trigger Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 hover:bg-black transition-all cursor-pointer border-2 border-white/20 text-white"
        title="Ask DocTrust AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Grounded RAG Chat Assistant */}
      <AIChatWidget
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />

      {/* Toast Notification */}
      <Toast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
      />
    </div>
  );
}
