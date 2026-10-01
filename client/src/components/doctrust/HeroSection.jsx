import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  UploadCloud,
  Code,
  ArrowRight,
  CheckCircle2,
  ScanFace,
  FileText,
  FileCheck2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Framer Motion Variants for reusable animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// Liquid / Fluid Animated Background Component
export const LiquidBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Liquid Mesh Blob 1 - Tech Blue (Top Left to Center) */}
      <motion.div
        animate={{
          x: [0, 90, -50, 0],
          y: [0, -70, 50, 0],
          scale: [1, 1.28, 0.92, 1],
          borderRadius: [
            '45% 55% 65% 35% / 40% 45% 55% 60%',
            '60% 40% 35% 65% / 55% 35% 65% 45%',
            '35% 65% 60% 40% / 45% 60% 40% 55%',
            '45% 55% 65% 35% / 40% 45% 55% 60%',
          ],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-12 left-1/4 w-[480px] h-[480px] bg-blue-400/30 blur-[100px] -translate-x-1/2"
      />

      {/* Liquid Mesh Blob 2 - Ultra-Light Purple / Indigo (Top Right to Center) */}
      <motion.div
        animate={{
          x: [0, -110, 60, 0],
          y: [0, 80, -60, 0],
          scale: [1.1, 0.88, 1.25, 1.1],
          borderRadius: [
            '55% 45% 40% 60% / 50% 65% 35% 50%',
            '35% 65% 60% 40% / 60% 40% 60% 40%',
            '60% 40% 45% 55% / 40% 55% 45% 60%',
            '55% 45% 40% 60% / 50% 65% 35% 50%',
          ],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute top-20 right-1/4 w-[460px] h-[460px] bg-indigo-300/30 blur-[110px] translate-x-1/2"
      />

      {/* Liquid Mesh Blob 3 - Center Cyan / Electric Blue pulsating droplet */}
      <motion.div
        animate={{
          x: [0, 50, -60, 0],
          y: [0, 45, -50, 0],
          scale: [0.92, 1.22, 1, 0.92],
          borderRadius: [
            '60% 40% 50% 50% / 45% 55% 45% 55%',
            '40% 60% 60% 40% / 55% 45% 55% 45%',
            '50% 50% 40% 60% / 40% 60% 40% 60%',
            '60% 40% 50% 50% / 45% 55% 45% 55%',
          ],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-44 left-1/2 w-[380px] h-[380px] bg-cyan-300/25 blur-[95px] -translate-x-1/2"
      />

      {/* Liquid Mesh Blob 4 - Deep Violet Liquid Under-glow for Console Mockup */}
      <motion.div
        animate={{
          x: [0, -70, 40, 0],
          y: [0, -50, 70, 0],
          scale: [1, 1.2, 0.9, 1],
          borderRadius: [
            '50% 50% 60% 40% / 40% 60% 50% 50%',
            '65% 35% 40% 60% / 55% 45% 65% 35%',
            '50% 50% 60% 40% / 40% 60% 50% 50%',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        className="absolute top-96 left-1/3 w-[520px] h-[400px] bg-violet-300/25 blur-[120px] -translate-x-1/2"
      />
    </div>
  );
};

// Background Floating Documents Collage Component (Layered above liquid background)
export const FloatingDocuments = () => {
  return (
    <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none flex justify-center items-center opacity-45">
      {/* Doc 1 - Left Top */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [-5, -2, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-[12%] sm:left-[15%] w-48 h-64 bg-white/90 backdrop-blur-md border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5 p-4 flex flex-col gap-3"
      >
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
          <ScanFace className="text-blue-400 w-6 h-6" />
        </div>
        <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
        <div className="h-2 w-full bg-gray-100 rounded"></div>
        <div className="h-2 w-5/6 bg-gray-100 rounded"></div>
        <div className="mt-auto flex justify-between">
          <div className="h-6 w-16 bg-blue-50 rounded-md"></div>
          <div className="h-6 w-6 bg-emerald-50 rounded-full flex items-center justify-center text-[10px] text-emerald-600 font-bold">
            ✓
          </div>
        </div>
      </motion.div>

      {/* Doc 2 - Right Top */}
      <motion.div
        animate={{ y: [0, 25, 0], rotate: [5, 8, 5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-24 right-[8%] sm:right-[10%] w-56 h-72 bg-white/85 backdrop-blur-md border border-gray-100 rounded-2xl shadow-2xl shadow-gray-900/5 p-5 flex flex-col gap-3 scale-90"
      >
        <div className="flex justify-between items-start mb-4">
          <FileText className="text-blue-400 w-10 h-10" />
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
            PDF
          </div>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
        <div className="h-3 w-4/5 bg-gray-100 rounded mb-1"></div>
        <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
        <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
      </motion.div>

      {/* Doc 3 - Center Bottom (Behind Text) */}
      <motion.div
        animate={{ y: [0, -15, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-64 left-[38%] w-72 h-40 bg-blue-50/60 backdrop-blur-md border border-blue-100 rounded-xl shadow-lg p-6 -z-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xs">
            <FileCheck2 className="text-blue-500 w-6 h-6" />
          </div>
          <div>
            <div className="h-4 w-28 bg-white rounded mb-2"></div>
            <div className="h-2 w-16 bg-white rounded"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function HeroSection({ onOpenUpload, onShowToast }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('identity');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedState, setVerifiedState] = useState(false);

  const tabData = {
    identity: {
      title: t?.hero?.poSample || 'Purchase Order',
      filename: 'Purchase_Order_PO-1024.pdf',
      docType: 'Purchase Order',
      score: '99.8%',
      details: '100 units @ $500.00 = $50,000.00 • Authorized buyer signature valid',
    },
    invoice: {
      title: t?.hero?.invMismatchSample || 'Invoice (Variance)',
      filename: 'Invoice_Acme_INV-9042.pdf',
      docType: 'Commercial Invoice',
      score: '65.2%',
      details: 'Variance detected: Billed $55,000 (110 units) exceeds PO authorization ($50,000 / 100 units)',
    },
    legal: {
      title: t?.hero?.drSample || 'Delivery Receipt',
      filename: 'Delivery_Receipt_DR-5512.pdf',
      docType: 'Delivery Receipt',
      score: '99.4%',
      details: 'Physical count of 100 units intake at Warehouse Bay 4 • Sign-off valid',
    },
  };

  const handleSimulateInspection = () => {
    setIsProcessing(true);
    setVerifiedState(false);
    setTimeout(() => {
      setIsProcessing(false);
      setVerifiedState(true);
      if (onShowToast) {
        onShowToast({
          title: activeTab === 'invoice' ? (t?.hero?.auditResultFlagged || 'Discrepancy Flagged') : (t?.hero?.auditResultPassed || 'Document Verified'),
          message: `${tabData[activeTab].filename} evaluated with ${tabData[activeTab].score} confidence score.`,
          type: activeTab === 'invoice' ? 'error' : 'success',
          tag: 'Verified',
        });
      }
    }, 900);
  };

  return (
    <main className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* 1. Fluid / Liquid Animated Background Mesh Gradient (-z-10) */}
      <LiquidBackground />

      {/* 2. Floating Document Icons Background Collage (-z-5, above liquid, below text) */}
      <FloatingDocuments />

      {/* 3. Hero Content Foreground (relative z-10, 100% crisp and legible) */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full max-w-4xl"
        >
          {/* Top Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 backdrop-blur-md border border-blue-200/80 text-sm font-semibold text-blue-700 shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              {t?.hero?.badge || 'DocTrust Engine 4.2 • Next-Gen AI Verification'}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6"
          >
            {t?.hero?.title1 || 'Read. Verify. Trust.'} <br />
            <span className="text-blue-600">{t?.hero?.titleHighlight || 'instantly.'}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed font-normal"
          >
            {t?.hero?.subtitle || 'Upload your documents and let our AI extract, verify, and process data securely in milliseconds.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenUpload}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 cursor-pointer"
            >
              <UploadCloud className="w-5 h-5" />
              <span>{t?.hero?.ctaPrimary || 'Upload a Document'}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </motion.button>

            <motion.a
              href="#features"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Code className="w-5 h-5 text-gray-400" />
              <span>{t?.hero?.ctaSecondary || 'View API Docs'}</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Mac-style Live Sandbox Console Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-20 w-full max-w-5xl relative text-left"
        >
          {/* Floating Badge above Mockup */}
          <div className="absolute -top-5 left-10 z-20 bg-white border border-gray-100 shadow-lg shadow-gray-900/10 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            0.4s Verification Speed
          </div>

          {/* Mockup Container */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-gray-900/10 border border-gray-200 overflow-hidden flex flex-col relative z-10">
            {/* Mac-style Window Header */}
            <div className="bg-gray-50/80 backdrop-blur border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              {/* Window Controls */}
              <div className="flex gap-2 w-24">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              {/* Title */}
              <div className="text-xs font-medium text-gray-500">
                DocTrust AI Verification Console • Live Sandbox
              </div>

              <div className="w-24"></div>
            </div>

            {/* Mockup Body Content */}
            <div className="p-6 bg-white flex flex-col items-center">
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-gray-50 rounded-lg border border-gray-100 self-end mb-6">
                <button
                  onClick={() => {
                    setActiveTab('identity');
                    setVerifiedState(false);
                  }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeTab === 'identity'
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tabData.identity.title}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('invoice');
                    setVerifiedState(false);
                  }}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'invoice'
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tabData.invoice.title}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('legal');
                    setVerifiedState(false);
                  }}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'legal'
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tabData.legal.title}
                </button>
              </div>

              {/* Awaiting Document Upload Drop Box */}
              <div
                onClick={onOpenUpload}
                className="w-full max-w-3xl border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-8 sm:p-12 flex flex-col items-center justify-center text-center hover:bg-blue-50/40 hover:border-blue-300 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-100 group-hover:scale-105 transition-transform">
                  <ScanFace className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-gray-800 font-medium text-base mb-1">
                  Awaiting Document Upload: {tabData[activeTab].title}
                </h3>
                <p className="text-sm text-gray-500 max-w-md mb-2">
                  {tabData[activeTab].details}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Drop a sample ID card, invoice, or contract here to see instant AI extraction & fraud checks.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-xs">
                    Sample: {tabData[activeTab].filename}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    activeTab === 'invoice'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    Score: {tabData[activeTab].score}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient glow behind mockup */}
          <div className="absolute top-10 inset-0 bg-gradient-to-t from-blue-50/50 to-transparent blur-3xl -z-10"></div>
        </motion.div>
      </div>
    </main>
  );
}

export default HeroSection;
