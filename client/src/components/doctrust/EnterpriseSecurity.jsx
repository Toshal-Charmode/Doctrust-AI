import React from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Trash2,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Shield,
  FileCheck2,
} from 'lucide-react';

export function EnterpriseSecurity({ onOpenUpload }) {
  return (
    <section id="security" className="py-24 sm:py-32 bg-gray-900 text-white relative overflow-hidden">
      {/* Subtle background ambient radial blue glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Enterprise Compliance</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Bank-Grade Security for Your Sensitive Data.
          </h2>

          <p className="text-base sm:text-lg text-gray-400 font-normal leading-relaxed">
            Built with defense-in-depth principles to satisfy strict regulatory audits across multinational banks, healthcare providers, and government agencies.
          </p>
        </div>

        {/* 3 Minimal Icon Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Column 1: End-to-End Encryption */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-3xl bg-gray-950/60 border border-gray-800 hover:border-blue-500/40 transition-colors space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">End-to-End Encryption</h3>

            <p className="text-sm text-gray-400 leading-relaxed font-normal">
              All documents in transit are guarded by TLS 1.3 and encrypted at rest with 256-bit AES cryptographic keys managed in hardware security modules (HSM).
            </p>

            <div className="pt-2 text-xs font-mono text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>SHA-256 checksum verification</span>
            </div>
          </motion.div>

          {/* Column 2: Zero Data Retention */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-8 rounded-3xl bg-gray-950/60 border border-gray-800 hover:border-blue-500/40 transition-colors space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">Zero Data Retention</h3>

            <p className="text-sm text-gray-400 leading-relaxed font-normal">
              Files are evaluated inside volatile, ephemeral in-memory sandboxes. Documents are permanently shredded immediately after verification completes.
            </p>

            <div className="pt-2 text-xs font-mono text-rose-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Zero AI training on customer files</span>
            </div>
          </motion.div>

          {/* Column 3: ISO 27001 Compliant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-8 rounded-3xl bg-gray-950/60 border border-gray-800 hover:border-blue-500/40 transition-colors space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">ISO 27001 Compliant</h3>

            <p className="text-sm text-gray-400 leading-relaxed font-normal">
              Certified under ISO/IEC 27001:2022 standards and independently audited for SOC-2 Type II, HIPAA, and complete EU GDPR data privacy sovereignty.
            </p>

            <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Continuous 3rd-party red team audits</span>
            </div>
          </motion.div>
        </div>

        {/* Security Trust Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gray-950 border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Require a signed Business Associate Agreement (BAA) or SOC-2 Report?
              </h4>
              <p className="text-xs text-gray-400">
                Our compliance team provides on-demand security packets and compliance attestations.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold text-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>Request Security Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default EnterpriseSecurity;
