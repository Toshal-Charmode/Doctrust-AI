import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  FileText,
  UploadCloud,
  CheckCircle2,
  Zap,
  ArrowDownUp,
  Minimize2,
  Share2,
  FileSpreadsheet,
  FileImage,
  Layers,
  Lock,
  Download,
  RotateCw,
} from 'lucide-react';

export function HeroSection() {
  const [activeTab, setActiveTab] = useState('convert');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(100);
  const [selectedFormat, setSelectedFormat] = useState('DOCX');

  const handleSimulateAction = () => {
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-28 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10">
        <div className="absolute top-12 left-1/4 w-[480px] h-[360px] bg-blue-100/60 rounded-full blur-[100px] -translate-x-1/2 opacity-70" />
        <div className="absolute top-24 right-1/4 w-[420px] h-[340px] bg-indigo-100/50 rounded-full blur-[90px] translate-x-1/2 opacity-60" />
        <div className="absolute top-48 left-1/2 w-[320px] h-[220px] bg-violet-100/40 rounded-full blur-[80px] -translate-x-1/2 opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Feature Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-blue-700 text-xs font-semibold shadow-xs mb-8 hover:bg-blue-100/80 transition-colors cursor-default"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Documents 4.0 is live • All-in-one file superpower</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111827] leading-[1.08] max-w-4xl mx-auto mb-6"
        >
          One platform.{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Infinite capabilities.
          </span>
        </motion.h1>

        {/* Hero Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Get things done, tools on us — all you need on a single platform.
        </motion.p>

        {/* Centered CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/register"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Get started free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-300 font-semibold text-base shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Sign in</span>
          </Link>
        </motion.div>

        {/* Interactive Documents Platform Workspace Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Floating Callout Badges */}
          <div className="hidden md:flex absolute -top-6 -left-6 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 border border-gray-200/80 shadow-lg shadow-gray-300/40 text-xs font-semibold text-gray-800 backdrop-blur-md animate-bounce duration-1000">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <span>No file size limits</span>
          </div>

          <div className="hidden md:flex absolute -bottom-5 -right-6 z-20 items-center gap-2 px-4 py-2 rounded-xl bg-white/95 border border-gray-200/80 shadow-lg shadow-gray-300/40 text-xs font-semibold text-gray-800 backdrop-blur-md">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>256-Bit TLS Client-side Privacy</span>
          </div>

          {/* Main App Container */}
          <div className="rounded-3xl border border-gray-200/90 bg-white/90 p-3 sm:p-5 shadow-2xl shadow-blue-500/10 backdrop-blur-xl ring-1 ring-gray-100">
            {/* Mockup Window Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-2 text-xs font-medium text-gray-400">
                  Documents.io Workspace
                </span>
              </div>

              {/* Tool Mode Tabs */}
              <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('convert')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'convert'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <ArrowDownUp className="w-3.5 h-3.5" />
                  <span>Convert</span>
                </button>
                <button
                  onClick={() => setActiveTab('compress')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'compress'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Compress</span>
                </button>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'transfer'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Transfer</span>
                </button>
              </div>
            </div>

            {/* Interactive Tool Sandbox Box */}
            <div className="bg-[#F9FAFB] rounded-2xl p-6 sm:p-8 border border-dashed border-gray-200">
              {activeTab === 'convert' && (
                <div className="space-y-6">
                  {/* File preview card */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm shrink-0">
                        PDF
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-[#111827]">
                          Annual_Strategy_Presentation_2026.pdf
                        </div>
                        <div className="text-xs text-gray-500">
                          14.2 MB • 32 Pages • Ready for conversion
                        </div>
                      </div>
                    </div>

                    {/* Target Format Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400">Convert to:</span>
                      <div className="flex items-center gap-1">
                        {['DOCX', 'XLSX', 'PPTX', 'JPG'].map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setSelectedFormat(fmt)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              selectedFormat === fmt
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Processing Status & CTA Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>OCR font matching enabled • 100% formatted fidelity</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleSimulateAction}
                        disabled={isProcessing}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-70"
                      >
                        {isProcessing ? (
                          <>
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Converting ({progress}%)...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>Convert to {selectedFormat}</span>
                          </>
                        )}
                      </button>

                      <Link
                        to="/upload"
                        className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors shrink-0"
                      >
                        Upload Custom File
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'compress' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                        PDF
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-[#111827]">
                          Global_Procurement_Contract_v4.pdf
                        </div>
                        <div className="text-xs text-gray-500">
                          Original size: <span className="font-semibold text-gray-700">28.4 MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          -86% Saved
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Compressed to: <span className="font-bold text-[#111827]">3.9 MB</span>
                        </div>
                      </div>
                      <button
                        onClick={handleSimulateAction}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                      >
                        Compress Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transfer' && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#111827]">
                        Instant Wi-Fi & Cross-Device Beam
                      </div>
                      <div className="text-xs text-gray-500">
                        Transfer files between iPhone, iPad, Mac, and Windows PC instantly.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      3 Devices Connected
                    </span>
                    <button
                      onClick={handleSimulateAction}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                    >
                      Start Transfer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom mini metric footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
              <div>
                <span className="font-bold text-gray-900 block text-sm">40+</span>
                <span>Supported File Formats</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block text-sm">0.8s</span>
                <span>Avg. Processing Time</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block text-sm">132M+</span>
                <span>Active Users Worldwide</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block text-sm">100% Free</span>
                <span>Core File Utilities</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
