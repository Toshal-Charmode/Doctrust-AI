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
    <main className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-transparent">
      {/* Hero Content Foreground (relative z-10, 100% crisp and legible over anti-gravity backdrop) */}
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
