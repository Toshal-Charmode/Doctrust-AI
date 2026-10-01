import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Receipt,
  Truck,
  Scale,
  Cpu,
  Layers,
  Check,
  HelpCircle,
  ChevronRight,
  Database,
  Lock,
  Globe,
  Bot,
  Code2,
} from 'lucide-react';

// Live Demo Sample Cases for interactive on-page test
const DEMO_CASES = [
  {
    id: 'quantity-mismatch',
    name: '3-Way Match: Quantity Overbill',
    badge: 'Quantity Variance',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    poName: 'PO-1024 (Acme Industrial)',
    poDetails: '100 units @ $500.00 = $50,000.00',
    invName: 'Invoice INV-9042',
    invDetails: '110 units @ $500.00 = $55,000.00',
    drName: 'Delivery DR-5512',
    drDetails: '100 units received by Bay 4',
    status: 'CRITICAL_MISMATCH',
    variance: '+10 units / +$5,000.00 overbilled',
    explanation:
      'Invoice INV-9042 bills for 110 units while approved Purchase Order PO-1024 authorizes only 100 units. Warehouse intake receipt confirms receipt of only 100 units. Recommended action: Place payment hold and request a revised invoice.',
    action: 'HOLD PAYMENT',
    extractedJson: {
      documentType: 'INVOICE',
      confidence: 0.96,
      vendor: 'Acme Industrial Supplies Inc.',
      invoiceNumber: 'INV-9042',
      poReference: 'PO-1024',
      total: 55000.0,
      lineItems: [{ item: 'Industrial Precision Bearings', qty: 110, rate: 500.0, total: 55000.0 }],
      discrepancy: { field: 'quantity', variance: '+10 units', risk: 'HIGH' },
    },
  },
  {
    id: 'price-creep',
    name: 'Price Creep: Rate Variance',
    badge: 'Unit Rate Mismatch',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
    poName: 'PO-8820 (Apex Hydraulics)',
    poDetails: '50 units @ $400.00 = $20,000.00',
    invName: 'Invoice INV-6610',
    invDetails: '50 units @ $440.00 = $22,000.00',
    drName: 'Delivery DR-9901',
    drDetails: '50 units received and verified',
    status: 'REVIEW_REQUIRED',
    variance: '+$40.00/unit / +$2,000.00 rate creep',
    explanation:
      'The billed unit price of $440.00 deviates from the contracted purchase order rate of $400.00 (+10% variance). Quantity is accurate. Recommended action: Route to category manager for unapproved price increase sign-off.',
    action: 'VARIANCE APPROVAL REQUIRED',
    extractedJson: {
      documentType: 'INVOICE',
      confidence: 0.95,
      vendor: 'Apex Hydraulics Corp.',
      invoiceNumber: 'INV-6610',
      poReference: 'PO-8820',
      total: 22000.0,
      lineItems: [{ item: 'Hydraulic Cylinder Pump Pro', qty: 50, rate: 440.0, total: 22000.0 }],
      discrepancy: { field: 'unitPrice', variance: '+$40.00/unit', risk: 'MEDIUM' },
    },
  },
  {
    id: 'clean-match',
    name: 'Clean Audit: 100% Agreement',
    badge: 'Perfect 3-Way Match',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    poName: 'PO-4401 (Global Tech)',
    poDetails: '4 units @ $3,000.00 = $12,000.00',
    invName: 'Invoice INV-3301',
    invDetails: '4 units @ $3,000.00 + $960 tax = $12,960.00',
    drName: 'Delivery DR-1120',
    drDetails: '4 units received and verified',
    status: 'MATCH',
    variance: '$0.00 variance • 100% verified',
    explanation:
      'All 11 verification dimensions passed with 100% concordance. Purchase order, invoice, and warehouse intake receipt match across vendor, quantities, unit prices, and tax computations.',
    action: 'AUTO-APPROVE FOR ERP POSTING',
    extractedJson: {
      documentType: 'INVOICE',
      confidence: 0.98,
      vendor: 'Global Tech Solutions',
      invoiceNumber: 'INV-3301',
      poReference: 'PO-4401',
      total: 12960.0,
      lineItems: [{ item: 'Enterprise Server Node Rack Pro', qty: 4, rate: 3000.0, total: 12000.0 }],
      discrepancy: null,
    },
  },
];

const INTEGRATIONS = [
  { name: 'SAP S/4HANA', category: 'ERP & Finance', icon: '💎' },
  { name: 'Oracle NetSuite', category: 'Cloud ERP', icon: '⚡' },
  { name: 'QuickBooks Online', category: 'Accounting', icon: '📊' },
  { name: 'Xero Accounting', category: 'SME Ledger', icon: '🔷' },
  { name: 'Workday Financials', category: 'Enterprise ERP', icon: '🌐' },
  { name: 'Microsoft Dynamics 365', category: 'Operations', icon: '🟦' },
  { name: 'Google Drive & Cloud', category: 'Storage', icon: '📁' },
  { name: 'REST API & Webhooks', category: 'Developer API', icon: '🔌' },
];

export function LandingPage() {
  const [activeDemo, setActiveDemo] = useState(DEMO_CASES[0]);
  const [demoViewMode, setDemoViewMode] = useState('reconciliation'); // 'reconciliation' | 'json'
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Sleek AI Purple Background Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-purple-600/15 via-violet-600/20 to-fuchsia-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Top Minimal Chrome Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-8 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Next-Gen Intelligent Document Processing</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6">
          Turn documents into{' '}
          <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
            decisions.
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          DocuTrust AI understands business documents, extracts critical information, detects inconsistencies, and turns document-heavy procurement workflows into actionable insights.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200"
          >
            <span>Start Analyzing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login?demo=true"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-800 hover:border-purple-500/30 font-semibold text-sm shadow-sm transition-all duration-200"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>View Demo</span>
          </Link>
        </div>

        {/* Minimal Chrome Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-medium text-slate-400 max-w-3xl mx-auto pt-2 pb-6 border-y border-slate-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Gemini 2.5 Vision Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Automated 3-Way Match</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Zero Data Hallucination</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>PostgreSQL Relational Storage</span>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE DEMO SHOWCASE SECTION */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-3">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Live Interactive Demo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            See the AI Reconciliation Engine in Action
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mt-2">
            Select a real procurement scenario below to observe how DocuTrust AI extracts data, identifies mathematical variances, and recommends immediate action.
          </p>
        </div>

        {/* Demo Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {DEMO_CASES.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeDemo.id === demo.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {demo.name}
            </button>
          ))}
        </div>

        {/* Interactive Demo View Window (Minimal Chrome Style) */}
        <div className="rounded-2xl border border-purple-500/30 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle Top Glow Accent */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

          {/* Window Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 inline-block" />
              </div>
              <span className="text-xs font-mono font-semibold text-slate-300">
                Audit Workspace • {activeDemo.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeDemo.badgeColor}`}>
                {activeDemo.badge}
              </span>

              <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
                <button
                  onClick={() => setDemoViewMode('reconciliation')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    demoViewMode === 'reconciliation'
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3-Way Match Matrix
                </button>
                <button
                  onClick={() => setDemoViewMode('json')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    demoViewMode === 'json'
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Extracted JSON
                </button>
              </div>
            </div>
          </div>

          {/* Window Body */}
          {demoViewMode === 'reconciliation' ? (
            <div className="pt-6 space-y-6">
              {/* Document 3-Way Pill Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* PO Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-400 font-semibold text-[11px] uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Authorized Purchase Order</span>
                  </div>
                  <p className="font-bold text-white text-sm">{activeDemo.poName}</p>
                  <span className="text-slate-400 font-mono text-[11px] block">{activeDemo.poDetails}</span>
                </div>

                {/* Invoice Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px] uppercase tracking-wider">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Vendor Invoice Billed</span>
                  </div>
                  <p className="font-bold text-white text-sm">{activeDemo.invName}</p>
                  <span className="text-slate-400 font-mono text-[11px] block">{activeDemo.invDetails}</span>
                </div>

                {/* Delivery Receipt Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Warehouse Intake Receipt</span>
                  </div>
                  <p className="font-bold text-white text-sm">{activeDemo.drName}</p>
                  <span className="text-slate-400 font-mono text-[11px] block">{activeDemo.drDetails}</span>
                </div>
              </div>

              {/* Finding & Variance Alert Bar */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  activeDemo.status === 'MATCH'
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {activeDemo.status === 'MATCH' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-purple-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-white block">
                      Reconciliation Result: {activeDemo.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-300">{activeDemo.variance}</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-purple-300">
                  ACTION: {activeDemo.action}
                </div>
              </div>

              {/* AI Explanation Box */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 text-xs leading-relaxed space-y-1">
                <span className="text-[11px] font-semibold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  AI Auditor Executive Explanation:
                </span>
                <p className="text-slate-300 font-sans">{activeDemo.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="pt-6">
              <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-purple-300 overflow-x-auto">
                {JSON.stringify(activeDemo.extractedJson, null, 2)}
              </pre>
            </div>
          )}

          {/* Quick CTA inside demo */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Ready to test with your own procurement documents?
            </span>
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Upload your files to analyze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* USE CASE SHOWCASES */}
      <section id="use-cases" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-3">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Procurement & Finance Use Cases</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Built for High-Volume Document Workflows
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            Solve real operational bottlenecks across finance, supply chain, and procurement operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Showcase 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">3-Way Match Reconciliation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly correlates POs, vendor invoices, and goods delivery notes to catch over-billing and missing shipments before payment release.
            </p>
          </div>

          {/* Showcase 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Accounts Payable Automation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts line items, tax computations, and payment terms in seconds, routing invoices straight into your ERP with high confidence.
            </p>
          </div>

          {/* Showcase 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Vendor Compliance & Fraud Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies uncontracted price creep, duplicate invoice numbers, rogue suppliers, and suspicious payment remit discrepancies.
            </p>
          </div>

          {/* Showcase 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Grounded Knowledge Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Natural conversational RAG allows procurement managers to query vendor history, invoice totals, and audit flags with zero hallucinations.
            </p>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS SHOWCASE */}
      <section id="integrations" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-10 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-3">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Enterprise Ecosystem</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Connect Directly into Your ERP & Financial Stack
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamlessly ingest procurement documents from cloud drives and sync verified extraction outputs directly into your general ledger and ERP systems.
              </p>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
              {INTEGRATIONS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/30 transition-colors text-xs"
                >
                  <div className="text-xl mb-1.5">{item.icon}</div>
                  <span className="font-bold text-slate-200 block truncate">{item.name}</span>
                  <span className="text-[10px] text-slate-500 block">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION TIERS / PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Transparent Pricing Plans</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Predictable Plans for Modern Finance Teams
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2">
            Choose the plan that fits your procurement document volume. All plans include full Gemini AI extraction.
          </p>

          {/* Billing Toggle (Monthly / Annual) */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs ${!isAnnual ? 'text-white font-bold' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-slate-800 p-0.5 relative transition-colors focus:outline-none"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs ${isAnnual ? 'text-white font-bold' : 'text-slate-400'}`}>
                Annual
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1: Starter */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Starter Tier
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Small Teams</h3>
              <p className="text-xs text-slate-400 mb-6">
                For emerging teams automating initial invoice parsing and 2-way checks.
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-white">
                  ${isAnnual ? '39' : '49'}
                </span>
                <span className="text-xs text-slate-400">/month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Up to 500 documents / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>2-Way Match Reconciliation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Standard Structured JSON Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>PDF, PNG, JPG ingestion</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs text-center transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Tier 2: Professional (Highlighted with AI Purple Glow) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-purple-950/30 to-slate-950 border-2 border-purple-500/60 shadow-xl shadow-purple-500/10 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] tracking-wider uppercase shadow-md">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                Professional
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Growing Enterprises</h3>
              <p className="text-xs text-slate-400 mb-6">
                Automated 3-way matching, discrepancy alarms, and conversational RAG.
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-white">
                  ${isAnnual ? '159' : '199'}
                </span>
                <span className="text-xs text-slate-400">/month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Up to 5,000 documents / month</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Full 3-Way Match (PO + Inv + Receipt)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Grounded AI Knowledge Discovery Chat</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Multi-Currency & Tax Audit</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>ERP Webhook Connectors</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs text-center shadow-lg shadow-purple-600/30 transition-all"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Enterprise
              </div>
              <h3 className="text-lg font-bold text-white mb-2">High Volume & Custom</h3>
              <p className="text-xs text-slate-400 mb-6">
                Dedicated database VPC, on-premise deployments, and custom LLM tuning.
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-white">Custom</span>
                <span className="text-xs text-slate-400">/annual</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Unlimited Document Processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Custom LLM Extraction Schema Tuning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Dedicated Private VPC / On-Prem Database</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>SAML / Single Sign-On (SSO) & 99.9% SLA</span>
                </li>
              </ul>
            </div>

            <Link
              to="/login?demo=true"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs text-center transition-colors"
            >
              Contact Enterprise Sales
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full mb-12">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 p-8 sm:p-12 text-center backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Ready to Automate Your Procurement Audit?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Join modern finance leaders saving hundreds of hours on manual document verification. Get started today in under 2 minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login?demo=true"
              className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 font-semibold text-xs transition-all"
            >
              Explore Sample Workspace
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
