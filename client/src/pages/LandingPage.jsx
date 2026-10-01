import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Cpu,
  Receipt,
  Truck,
  FileCheck,
  Scale,
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-cyan-400 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Intelligent Document Processing Hackathon 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Turn documents into{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            decisions.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          DocuTrust AI understands business documents, extracts critical information, detects inconsistencies, and turns document-heavy workflows into actionable insights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
          >
            <span>Start Analyzing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login?demo=true"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm shadow-sm transition-all duration-200"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>View Demo</span>
          </Link>
        </div>

        {/* Live Visual Workflow Diagram */}
        <div className="max-w-5xl mx-auto bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            The Autonomous DocuTrust AI Pipeline
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white mb-1">1. Upload</span>
              <span className="text-[11px] text-slate-400">PDF, PNG, JPG procurement files</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white mb-1">2. AI Understanding</span>
              <span className="text-[11px] text-slate-400">Classification & confidence score</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white mb-1">3. Extraction</span>
              <span className="text-[11px] text-slate-400">Zod-validated line items & totals</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Scale className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white mb-1">4. Validation</span>
              <span className="text-[11px] text-slate-400">3-Way Match & discrepancy engine</span>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white mb-1">5. Insights</span>
              <span className="text-[11px] text-slate-400">Human AI explanations & chat RAG</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
            Engineered for Modern Procurement Integrity
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            DocuTrust AI replaces error-prone manual document matching with strict AI intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">AI Document Classification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically identifies Purchase Orders, Vendor Invoices, Delivery Receipts, and Quotations with confidence scores and transparent reasoning.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Structured Information Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deep table extraction captures vendor addresses, invoice dates, PO references, itemized line items, unit rates, tax amounts, and payment terms into clean JSON.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Cross-Document Validation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Performs 2-way and 3-way match validation between Purchase Orders, Invoices, and Delivery Receipts to verify quantities, rates, and authorized totals.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Discrepancy Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects over-invoicing, quantity mismatches, price creep, vendor mismatches, missing numbers, and date chronology errors classified by severity.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">AI Knowledge Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conversational RAG interface lets you ask natural questions across your document library with strictly grounded answers and zero hallucinations.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Actionable AI Insights</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates executive explanations and recommends definitive operational actions such as payment holds, credit note requests, or approval routing.
            </p>
          </div>
        </div>
      </section>

      {/* Live Preview Simulation Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Live 3-Way Match Audit Example
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Purchase Order PO-1024 vs Invoice INV-9042
              </h3>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              CRITICAL MISMATCH
            </span>
          </div>

          <div className="py-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Vendor Identity</span>
                <p className="text-sm font-semibold text-white mt-1">Acme Industrial Supplies Inc.</p>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Match verified
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Authorized PO Quantity</span>
                <p className="text-sm font-semibold text-white mt-1">100 units @ $500.00</p>
                <span className="text-[11px] text-slate-400 mt-1 block">Approved in PO-1024</span>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="text-rose-300">Billed Invoice Quantity</span>
                <p className="text-sm font-semibold text-rose-200 mt-1">110 units @ $500.00 (+10 units)</p>
                <span className="text-[11px] text-rose-400 flex items-center gap-1 mt-1 font-semibold">
                  <AlertTriangle className="w-3 h-3" /> Discrepancy: +$5,000.00
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mt-4">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI Auditor Explanation:
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Invoice INV-9042 requires review because the invoice contains 110 units while the purchase order authorizes 100 units. The invoice also exceeds the purchase order amount by $5,000.00. Recommended action: Place payment hold immediately and request a corrected invoice."
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Explore full dashboard & interactive test workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
