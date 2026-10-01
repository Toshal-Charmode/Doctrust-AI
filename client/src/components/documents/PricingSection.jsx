import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
            Plans built for everyday speed and scale
          </h2>

          <p className="text-base sm:text-lg text-gray-500 font-normal">
            Start completely free. Upgrade whenever you need unlimited batch processing, cloud sync, or advanced AI capabilities.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-[#111827]' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-13 h-7 rounded-full bg-gray-200 p-0.5 relative transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle annual or monthly pricing"
            >
              <div
                className={`w-6 h-6 rounded-full bg-blue-600 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-semibold ${isAnnual ? 'text-[#111827]' : 'text-gray-400'}`}>
                Annual
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Save 25%
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Plan 1: Free */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#F9FAFB] border border-gray-200/90 flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Free Forever
              </div>
              <h3 className="text-xl font-extrabold text-[#111827] mb-2">Basic Tools</h3>
              <p className="text-xs text-gray-500 mb-6">
                Essential document tools for everyday conversion and quick compression.
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-[#111827]">$0</span>
                <span className="text-xs text-gray-500">/ forever free</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>All 40+ Core File Converters</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Standard File Compression</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Direct Wi-Fi Device Transfer</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Files up to 50 MB each</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-[#111827] font-semibold text-xs text-center shadow-xs transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Plan 2: Pro (Highlighted) */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] tracking-wider uppercase shadow-sm">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                Documents Plus
              </div>
              <h3 className="text-xl font-extrabold text-[#111827] mb-2">Pro Individual</h3>
              <p className="text-xs text-gray-500 mb-6">
                Unlimited batch conversions, AI summary, OCR, and premium mobile features.
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-[#111827]">
                  ${isAnnual ? '8' : '11'}
                </span>
                <span className="text-xs text-gray-500">/ month, billed annually</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700 mb-8 font-medium">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Unlimited Batch Processing (up to 100 files)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>AI Document Assistant & Summarizer</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Full OCR Text Extraction (48 languages)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Extreme Compression engine (-90%)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Full access to Documents iOS & iPad App</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs text-center shadow-md shadow-blue-500/25 transition-all"
            >
              Start 7-Day Free Trial
            </Link>
          </div>

          {/* Plan 3: Team / Business */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#F9FAFB] border border-gray-200/90 flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Team & Business
              </div>
              <h3 className="text-xl font-extrabold text-[#111827] mb-2">Organizations</h3>
              <p className="text-xs text-gray-500 mb-6">
                Centralized billing, shared team libraries, and priority developer API access.
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-[#111827]">
                  ${isAnnual ? '24' : '30'}
                </span>
                <span className="text-xs text-gray-500">/ user / month</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Everything in Plus for all team members</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Centralized Admin & Single Sign-On (SSO)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>REST API & Webhooks Access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Dedicated Support Manager & 99.9% SLA</span>
                </li>
              </ul>
            </div>

            <Link
              to="/login"
              className="w-full py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-[#111827] font-semibold text-xs text-center shadow-xs transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
