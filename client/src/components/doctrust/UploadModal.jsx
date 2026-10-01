import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Lock,
  ArrowRight,
  Eye,
  FileCheck,
} from 'lucide-react';

const SAMPLE_FILES = [
  {
    id: 'passport',
    name: 'Government_Passport_ID.pdf',
    type: 'Identity Document',
    size: '2.4 MB',
    securityScore: '99.8%',
    fields: [
      { label: 'Document Type', value: 'International Passport', status: 'VALID' },
      { label: 'Holder Name', value: 'Sarah Michelle Chen', status: 'MATCHED' },
      { label: 'MRZ Checksum', value: 'ICAO 9303 Verified', status: 'VALID' },
      { label: 'Hologram Integrity', value: 'No Tampering Detected', status: 'CLEAN' },
    ],
  },
  {
    id: 'invoice',
    name: 'Acme_Industrial_INV-9042.pdf',
    type: 'Commercial Invoice',
    size: '1.8 MB',
    securityScore: '98.5%',
    fields: [
      { label: 'Invoice Number', value: 'INV-9042 (PO Ref: PO-1024)', status: 'VALID' },
      { label: 'Vendor Entity', value: 'Acme Industrial Supplies Inc.', status: 'VERIFIED' },
      { label: 'Total Billed', value: '$55,000.00 USD', status: 'AUDITED' },
      { label: 'Tax ID & IBAN', value: 'Validated via Global Registry', status: 'VALID' },
    ],
  },
  {
    id: 'bank-statement',
    name: 'Chase_Business_Statement_Oct.pdf',
    type: 'Bank Financial Audit',
    size: '3.1 MB',
    securityScore: '99.2%',
    fields: [
      { label: 'Institution', value: 'JPMorgan Chase Bank, N.A.', status: 'VERIFIED' },
      { label: 'Account Holder', value: 'DocTrust Technologies LLC', status: 'MATCHED' },
      { label: 'Closing Balance', value: '$184,250.80 USD', status: 'CALCULATED' },
      { label: 'Font/Pixel Artifacts', value: 'Zero Splice or Forgery', status: 'CLEAN' },
    ],
  },
];

export function UploadModal({ isOpen, onClose, onVerified }) {
  const [selectedFile, setSelectedFile] = useState(SAMPLE_FILES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verificationDone, setVerificationDone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Start simulated scan
  const startVerification = (fileToVerify = selectedFile) => {
    setIsScanning(true);
    setVerificationDone(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setVerificationDone(true);
          if (onVerified) {
            onVerified(fileToVerify);
          }
          return 100;
        }
        return prev + 20;
      });
    }, 180);
  };

  const handleSelectSample = (file) => {
    setSelectedFile(file);
    setVerificationDone(false);
    setProgress(0);
    startVerification(file);
  };

  const handleCustomDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const customDoc = {
        id: 'custom-' + Date.now(),
        name: file.name,
        type: 'User Uploaded File',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        securityScore: '99.4%',
        fields: [
          { label: 'File Hash SHA-256', value: '4a9b...f812 (Verified)', status: 'VALID' },
          { label: 'Digital Certificate', value: 'Valid Cryptographic Chain', status: 'CLEAN' },
          { label: 'Metadata Audit', value: 'Consistent Exif & Timestamps', status: 'VALID' },
          { label: 'AI Risk Rating', value: 'LOW_RISK (Safe for Ledger)', status: 'PASSED' },
        ],
      };
      setSelectedFile(customDoc);
      startVerification(customDoc);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Glassmorphism Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Centered Modal Window with Spring Entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-auto"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-[#111827]">
                      DocTrust AI Verification Engine
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      v4.2 Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Drag and drop any business file or select a verified test preset.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleCustomDrop}
                className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-gray-200 bg-[#F9FAFB] hover:border-blue-400 hover:bg-blue-50/20'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="text-sm font-bold text-[#111827] mb-1">
                  Drag and drop your file here, or{' '}
                  <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">
                    browse files
                  </span>
                </div>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-3">
                  Supports PDF, PNG, JPG, TIFF, and DOCX up to 25 MB per document.
                </p>

                <div className="inline-flex items-center gap-2 text-[11px] font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <Lock className="w-3 h-3 text-blue-600" />
                  <span>256-bit TLS encrypted & automatically purged in 2 hours</span>
                </div>
              </div>

              {/* Quick Sample Presets */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Or test with verified realistic sample cases:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_FILES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedFile.id === sample.id
                          ? 'border-blue-500 bg-blue-50/60 shadow-xs ring-1 ring-blue-500/20'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-bold text-[#111827] truncate">
                          {sample.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">{sample.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Verification Card & Scanner Beam */}
              {selectedFile && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 relative overflow-hidden shadow-xs">
                  {/* Animated laser line during scanning */}
                  {isScanning && (
                    <motion.div
                      initial={{ top: '0%' }}
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] z-20 pointer-events-none"
                    />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                        DOC
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111827]">
                          {selectedFile.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedFile.type} • {selectedFile.size}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isScanning ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Auditing ({progress}%)...</span>
                        </span>
                      ) : verificationDone ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Trust Score {selectedFile.securityScore}</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                          Ready to Verify
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Extracted Validated Dimensions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                    {selectedFile.fields.map((field, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#F9FAFB] border border-gray-200/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="text-[10px] text-gray-400 font-medium block">
                            {field.label}
                          </span>
                          <span className="font-semibold text-gray-800 text-xs">
                            {field.value}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800">
                          {field.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-[#F9FAFB] border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                Audited against global compliance databases & tamper registries.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => startVerification()}
                  disabled={isScanning}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isScanning ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run AI Verification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default UploadModal;
