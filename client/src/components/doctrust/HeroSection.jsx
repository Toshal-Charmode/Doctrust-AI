import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Lock,
  Code2,
  FileText,
  ScanLine,
  Zap,
  Check,
  RotateCw,
} from 'lucide-react';

export function HeroSection({ onOpenUpload, onShowToast }) {
  const [activePreset, setActivePreset] = useState('identity');
  const [isScanning, setIsScanning] = useState(false);
  const [score, setScore] = useState(99.8);

  const presets = {
    identity: {
      type: 'National Identity / Passport',
      filename: 'EU_Identity_Card_Scan.pdf',
      score: '99.8%',
      fields: [
        { label: 'Holder Full Name', val: 'Alexander Vance', status: 'MATCHED' },
        { label: 'Document Number', val: 'P4882190-DE', status: 'AUTHENTIC' },
        { label: 'Facial Biometrics', val: '99.4% Liveness Confidence', status: 'VERIFIED' },
        { label: 'Tamper Analysis', val: 'No Font or Pixel Artifacts', status: 'CLEAN' },
      ],
    },
    financial: {
      type: 'Corporate Invoice / PO Match',
      filename: 'Acme_Industrial_INV-9042.pdf',
      score: '98.9%',
      fields: [
        { label: 'Entity Registry', val: 'Acme Industrial Supplies Inc.', status: 'VERIFIED' },
        { label: '3-Way Match PO', val: 'Matched with PO-1024', status: 'MATCHED' },
        { label: 'Invoice Total', val: '$55,000.00 USD (Math Clean)', status: 'VALID' },
        { label: 'Bank Account & Tax', val: 'Validated via Global SWIFT', status: 'AUTHENTIC' },
      ],
    },
    legal: {
      type: 'Corporate Legal Agreement',
      filename: 'Master_Services_Contract_2026.pdf',
      score: '99.5%',
      fields: [
        { label: 'Digital Signatures', val: 'Valid Cryptographic PKI Chain', status: 'SECURE' },
        { label: 'Clause Verification', val: 'Governing Law: Delaware', status: 'VERIFIED' },
        { label: 'Timestamp Authority', val: 'RFC 3161 Qualified Timestamp', status: 'VALID' },
        { label: 'Page Continuity', val: '32/32 Pages Complete', status: 'CLEAN' },
      ],
    },
  };

  const current = presets[activePreset];

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (onShowToast) {
        onShowToast({
          title: 'Document Verified',
          message: `${current.filename} verified with ${current.score} authenticity confidence.`,
          type: 'success',
          tag: 'Verified',
        });
      }
    }, 1200);
  };

  return (
    <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-28 overflow-hidden">
      {/* Background Soft Glow Radial Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[640px] pointer-events-none -z-10">
        <div className="absolute top-12 left-1/3 w-[450px] h-[340px] bg-blue-100/60 rounded-full blur-[110px] -translate-x-1/2 opacity-70" />
        <div className="absolute top-28 right-1/4 w-[400px] h-[320px] bg-indigo-100/50 rounded-full blur-[90px] translate-x-1/2 opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Product Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-blue-700 text-xs font-semibold shadow-xs mb-8 hover:bg-blue-100/80 transition-colors cursor-default"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>DocTrust Engine 4.2 • Next-Gen AI Verification</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111827] leading-[1.08] max-w-4xl mx-auto mb-6"
        >
          Read. Verify. Trust.{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            instantly.
          </span>
        </motion.h1>

        {/* Hero Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Upload your documents and let our AI extract, verify, and process data securely in milliseconds.
        </motion.p>

        {/* Hero Buttons: Upload a Document & View API Docs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Upload a Document</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <a
            href="#api-preview"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-300 font-semibold text-base shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Code2 className="w-4.5 h-4.5 text-gray-500" />
            <span>View API Docs</span>
          </a>
        </motion.div>

        {/* Documents.io-style Interactive Verification Simulator Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Floating Callout Badges with subtle bounce */}
          <div className="hidden md:flex absolute -top-5 -left-6 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 border border-gray-200/80 shadow-lg shadow-gray-200/50 text-xs font-semibold text-gray-800 backdrop-blur-md">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
              ✓
            </div>
            <span>0.4s Verification Speed</span>
          </div>

          <div className="hidden md:flex absolute -bottom-5 -right-6 z-20 items-center gap-2 px-4 py-2 rounded-xl bg-white/95 border border-gray-200/80 shadow-lg shadow-gray-200/50 text-xs font-semibold text-gray-800 backdrop-blur-md">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>256-Bit TLS Client-side Privacy</span>
          </div>

          {/* Main Card Sandbox Window */}
          <div className="rounded-3xl border border-gray-200/90 bg-white/90 p-3 sm:p-5 shadow-2xl shadow-blue-500/10 backdrop-blur-xl ring-1 ring-gray-100 text-left">
            {/* Window Topbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-2 text-xs font-semibold text-gray-400">
                  DocTrust AI Verification Console • Live Sandbox
                </span>
              </div>

              {/* Document Preset Tabs */}
              <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActivePreset('identity')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activePreset === 'identity'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Identity & ID
                </button>
                <button
                  onClick={() => setActivePreset('financial')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activePreset === 'financial'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Invoice & PO
                </button>
                <button
                  onClick={() => setActivePreset('legal')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activePreset === 'legal'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Legal Contracts
                </button>
              </div>
            </div>

            {/* Sandbox Body Box */}
            <div className="bg-[#F9FAFB] rounded-2xl p-5 sm:p-7 border border-gray-200/80 space-y-5 relative overflow-hidden">
              {/* Laser Scanning Animation */}
              {isScanning && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.9)] z-20 pointer-events-none"
                />
              )}

              {/* Document File Info Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">
                      {current.filename}
                    </div>
                    <div className="text-xs text-gray-500">
                      {current.type} • 2.4 MB • Zero Alterations Detected
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{current.score} Confidence</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Automated Audit Passed</span>
                  </div>

                  <button
                    onClick={handleSimulateScan}
                    disabled={isScanning}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-75"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>{isScanning ? 'Scanning...' : 'Test Verification'}</span>
                  </button>
                </div>
              </div>

              {/* Verified Field Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {current.fields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-gray-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-[10px] text-gray-400 font-medium block">
                        {field.label}
                      </span>
                      <span className="font-semibold text-gray-800 text-xs">
                        {field.val}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {field.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Mini Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
              <div>
                <span className="font-bold text-gray-900 block text-sm">99.8%</span>
                <span>Audit Accuracy</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block text-sm">&lt; 400ms</span>
                <span>Extraction Latency</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block text-sm">180+</span>
                <span>Global Document Types</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block text-sm">ISO 27001</span>
                <span>Certified Security</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
