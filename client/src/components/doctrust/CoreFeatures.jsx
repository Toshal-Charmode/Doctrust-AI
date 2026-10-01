import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Check,
  ArrowRight,
  FileText,
  Code2,
  Copy,
  Sparkles,
  Layers,
  Database,
  Lock,
  Cpu,
  RefreshCw,
  FolderLock,
  Globe,
  Zap,
} from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export function CoreFeatures({ onOpenUpload, onShowToast }) {
  const { t } = useLanguage();
  // Feature 2: JSON Copy state
  const [copied, setCopied] = useState(false);

  const sampleJson = {
    document_id: "DOC-2026-9042",
    document_type: "COMMERCIAL_INVOICE",
    verification_status: "VERIFIED",
    confidence_score: 0.998,
    extracted_data: {
      vendor_name: "Acme Industrial Supplies Inc.",
      invoice_number: "INV-9042",
      po_reference: "PO-1024",
      currency: "USD",
      subtotal: 50000.0,
      tax_amount: 5000.0,
      total_amount: 55000.0,
      line_items: [
        { sku: "BB-9902", description: "Precision Ball Bearings", qty: 110, rate: 500.0 }
      ]
    },
    tamper_audit: {
      splice_detected: false,
      font_consistency: "100%",
      mrz_valid: true
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleJson, null, 2));
    setCopied(true);
    if (onShowToast) {
      onShowToast({
        title: 'Copied to Clipboard',
        message: 'Structured JSON payload copied successfully.',
        type: 'info',
        tag: 'Developer JSON',
      });
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="features" className="space-y-0">
      {/* ======================================================== */}
      {/* 1. FEATURE 1: AI DOCUMENT VERIFICATION (Text Left, Mockup Right) */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.features.f1Badge}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
                {t.features.f1Title}
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                {t.features.f1Desc}
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Purchase Orders, Invoices, Delivery Intake Slips & Quotations',
                  'Confidence scoring (0.00 – 1.00) with classification rationale',
                  'Automated anomaly and arithmetic discrepancy detection',
                  'Google Gemini 2.5 Flash with structured Zod schema enforcement',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenUpload}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Mockup Right (ID card being scanned and marked Verified) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6"
            >
              <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                {/* Accent Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Forensic Inspection
                    </span>
                    <span className="text-base font-bold text-[#111827]">
                      Biometric ID & Credential Audit
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Scanning Active
                  </span>
                </div>

                {/* Animated ID Card Mockup with Scanner Line */}
                <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-2xl overflow-hidden border border-slate-800">
                  {/* Laser Beam Animation */}
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 shadow-[0_0_18px_rgba(34,211,238,0.9)] z-20 pointer-events-none"
                  />

                  {/* ID Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-5 rounded bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-[10px] font-bold text-blue-300">
                        EU
                      </div>
                      <span className="text-xs font-bold tracking-wider text-slate-200">
                        NATIONAL IDENTITY CARD
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 opacity-80" />
                  </div>

                  {/* Card Content: Photo + Details */}
                  <div className="pt-4 flex gap-4 items-center">
                    <div className="w-20 h-24 rounded-xl bg-slate-800 border-2 border-cyan-400/40 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                      <div className="w-8 h-8 rounded-full bg-cyan-400/20 mb-1" />
                      <div className="w-12 h-6 rounded-t-full bg-cyan-400/20" />
                      <div className="absolute bottom-1 px-1.5 py-0.2 rounded bg-cyan-500/80 text-[8px] font-bold text-black">
                        MATCH 99%
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Name</span>
                        <span className="text-xs font-bold text-white">VANCE, ALEXANDER M.</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase block">Document ID</span>
                          <span className="font-mono text-cyan-300">D491-0982-A</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase block">Expiry Date</span>
                          <span className="text-slate-300">2032-08-14</span>
                        </div>
                      </div>
                      <div className="font-mono text-[9px] text-slate-400 truncate tracking-widest pt-1">
                        I&lt;UTOERIKSSON&lt;&lt;ANNA&lt;MARIA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Outcome Card */}
                <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-emerald-950">
                        Status: VERIFIED & AUTHENTIC
                      </div>
                      <div className="text-[11px] text-emerald-800 font-medium">
                        Forensic security score: 99.8% • Zero forgery signals
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-700">
                    PASS
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. FEATURE 2: SMART DATA EXTRACTION (Mockup Left, Text Right on #F9FAFB) */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 bg-[#F9FAFB] border-t border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Mockup Left (Invoice converting to JSON data) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 order-2 lg:order-1"
            >
              <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/60 relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-[#111827]">
                      Structured JSON Schema Export
                    </span>
                  </div>

                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Preformatted Syntax Highlighted Code Box */}
                <div className="rounded-2xl bg-[#0B0F19] p-4 text-xs font-mono text-slate-300 overflow-x-auto border border-gray-800 shadow-inner max-h-[340px]">
                  <pre className="leading-relaxed">
                    <code>
                      <span className="text-slate-500">// Auto-extracted by DocTrust AI</span>{'\n'}
                      {'{'}{'\n'}
                      {'  '}<span className="text-indigo-400">&quot;document_id&quot;</span>: <span className="text-emerald-300">&quot;DOC-2026-9042&quot;</span>,{'\n'}
                      {'  '}<span className="text-indigo-400">&quot;document_type&quot;</span>: <span className="text-emerald-300">&quot;COMMERCIAL_INVOICE&quot;</span>,{'\n'}
                      {'  '}<span className="text-indigo-400">&quot;verification_status&quot;</span>: <span className="text-cyan-400">&quot;VERIFIED&quot;</span>,{'\n'}
                      {'  '}<span className="text-indigo-400">&quot;confidence_score&quot;</span>: <span className="text-amber-400">0.998</span>,{'\n'}
                      {'  '}<span className="text-indigo-400">&quot;extracted_data&quot;</span>: {'{'}{'\n'}
                      {'    '}<span className="text-indigo-400">&quot;vendor_name&quot;</span>: <span className="text-emerald-300">&quot;Acme Industrial Supplies Inc.&quot;</span>,{'\n'}
                      {'    '}<span className="text-indigo-400">&quot;invoice_number&quot;</span>: <span className="text-emerald-300">&quot;INV-9042&quot;</span>,{'\n'}
                      {'    '}<span className="text-indigo-400">&quot;po_reference&quot;</span>: <span className="text-emerald-300">&quot;PO-1024&quot;</span>,{'\n'}
                      {'    '}<span className="text-indigo-400">&quot;total_amount&quot;</span>: <span className="text-amber-400">55000.00</span>,{'\n'}
                      {'    '}<span className="text-indigo-400">&quot;line_items&quot;</span>: [{'{\n'}
                      {'      '}<span className="text-indigo-400">&quot;sku&quot;</span>: <span className="text-emerald-300">&quot;BB-9902&quot;</span>,{'\n'}
                      {'      '}<span className="text-indigo-400">&quot;description&quot;</span>: <span className="text-emerald-300">&quot;Precision Ball Bearings&quot;</span>,{'\n'}
                      {'      '}<span className="text-indigo-400">&quot;qty&quot;</span>: <span className="text-amber-400">110</span>{'\n'}
                      {'    '}{'}]'}{'\n'}
                      {'  '}{'}'}{'\n'}
                      {'}'}
                    </code>
                  </pre>
                </div>

                {/* Footer validation check */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 pt-2">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Type-safe Zod & JSON schema validated</span>
                  </span>
                  <span>Latency: 382ms</span>
                </div>
              </div>
            </motion.div>

            {/* Text Right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6 order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Smart Data Extraction</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Turn unformatted documents into clean, structured data
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                Extract tables, nested line items, tax computations, and custom business metadata directly into developer-ready JSON, CSV, or relational SQL in under 400 milliseconds.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Zero-template multi-modal OCR that adapts to any document layout',
                  'Multi-currency, tax code, and arithmetic reconciliation audits',
                  'Automatic 3-way match between PO, invoice, and receiving receipts',
                  'REST webhook pipelines ready to push directly into ERP databases',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenUpload}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <span>Upload Document to Extract</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FEATURE 3: MULTI-PURPOSE WORKFLOWS (Text Left, Visual Right) */}
      {/* ======================================================== */}
      <section id="api-preview" className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide uppercase">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Multi-Purpose Workflows</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Connect directly to your ERP, ledger, and cloud storage
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                Automate high-volume compliance checks from end-to-end. Trigger real-time webhooks, stream extraction payloads into SAP, NetSuite, or PostgreSQL, and auto-route approvals seamlessly.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Native bi-directional connectors for SAP, NetSuite, Workday & QuickBooks',
                  'Event-driven webhooks with HMAC SHA-256 signature verification',
                  'Dedicated private VPC & on-premise air-gapped deployment support',
                  'Audit trails stamped with RFC-compliant cryptographic proof hashes',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenUpload}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <span>Start Workflow Integration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Visual Right (Secure folder connecting to APIs) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6"
            >
              <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Pipeline Architecture
                    </span>
                    <span className="text-base font-bold text-[#111827]">
                      Enterprise Vault & API Dispatcher
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                    99.99% Uptime
                  </span>
                </div>

                {/* Central Vault Connecting to Nodes */}
                <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-gray-200/80 space-y-6">
                  {/* Central Node */}
                  <div className="mx-auto max-w-xs p-4 rounded-2xl bg-white border-2 border-blue-500 shadow-md shadow-blue-500/10 flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                      <FolderLock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#111827]">
                        DocTrust Secure Vault
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        AES-256 In-Memory Bus
                      </div>
                    </div>
                  </div>

                  {/* Connected Endpoints Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white border border-gray-200 text-center space-y-1">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xs font-bold">
                        ERP
                      </div>
                      <span className="text-xs font-bold text-[#111827] block">SAP S/4HANA</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">● Auto-Post</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-gray-200 text-center space-y-1">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xs font-bold">
                        SQL
                      </div>
                      <span className="text-xs font-bold text-[#111827] block">PostgreSQL</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">● Synced</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-gray-200 text-center space-y-1">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-xs font-bold">
                        REST
                      </div>
                      <span className="text-xs font-bold text-[#111827] block">Webhooks API</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">● 200 OK</span>
                    </div>
                  </div>

                  {/* Live Webhook Payload Broadcast Simulator */}
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-gray-700">
                        Event: <code className="text-blue-600 font-mono">document.verified</code>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-600">
                      Dispatched in 42ms
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CoreFeatures;
