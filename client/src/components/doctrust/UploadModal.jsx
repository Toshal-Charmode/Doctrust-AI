import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  RotateCw,
  Sparkles,
  Lock,
  ArrowRight,
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
      { label: 'Holder Name', value: 'Alexander Vance', status: 'MATCHED' },
      { label: 'MRZ Checksum', value: 'ICAO 9303 Verified', status: 'VALID' },
      { label: 'Tamper Analysis', value: 'No Font or Pixel Artifacts', status: 'CLEAN' },
    ],
  },
  {
    id: 'invoice',
    name: 'Acme_Industrial_INV-9042.pdf',
    type: 'Commercial Invoice',
    size: '1.8 MB',
    securityScore: '98.9%',
    fields: [
      { label: 'Invoice Number', value: 'INV-9042 (PO Ref: PO-1024)', status: 'VALID' },
      { label: 'Vendor Entity', value: 'Acme Industrial Supplies Inc.', status: 'VERIFIED' },
      { label: 'Total Billed', value: '$55,000.00 USD (Tax Valid)', status: 'AUDITED' },
      { label: 'Tax ID & IBAN', value: 'Validated via Global SWIFT', status: 'VALID' },
    ],
  },
  {
    id: 'contract',
    name: 'Corporate_Services_Agreement.pdf',
    type: 'Legal Contract',
    size: '3.1 MB',
    securityScore: '99.5%',
    fields: [
      { label: 'Document Status', value: 'Fully Executed Agreement', status: 'VERIFIED' },
      { label: 'Digital Signatures', value: 'Valid Cryptographic PKI Chain', status: 'MATCHED' },
      { label: 'Timestamp RFC 3161', value: 'Authority Qualified Signature', status: 'CLEAN' },
      { label: 'Page Continuity', value: '32/32 Pages Complete', status: 'VALID' },
    ],
  },
];

export function UploadModal({ isOpen, onClose, onVerified }) {
  const [selectedFile, setSelectedFile] = useState(SAMPLE_FILES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verificationDone, setVerificationDone] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
        return prev + 25;
      });
    }, 180);
  };

  const handleSelectSample = (file) => {
    setSelectedFile(file);
    startVerification(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Upload Document</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Drag & Drop Card */}
              <div
                onClick={() => startVerification()}
                className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  Drag & drop your files here
                </p>
                <p className="text-sm text-gray-500 mb-5">
                  Supports PDF, JPG, PNG, DOCX (Max 50MB)
                </p>
                <button
                  type="button"
                  className="bg-white border border-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-xs cursor-pointer"
                >
                  Browse Files
                </button>
              </div>

              {/* Sample Document Quick Test */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Or test with verified realistic samples:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_FILES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedFile.id === sample.id
                          ? 'border-blue-500 bg-blue-50/60 shadow-xs'
                          : 'border-gray-200 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {sample.type}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">
                        {sample.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Verification Status Window */}
              {selectedFile && (
                <div className="rounded-2xl border border-gray-200 bg-[#F9FAFB] p-4 relative overflow-hidden">
                  {isScanning && (
                    <motion.div
                      initial={{ top: '0%' }}
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)] z-20 pointer-events-none"
                    />
                  )}

                  <div className="flex items-center justify-between pb-3 border-b border-gray-200/80 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        AI
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">{selectedFile.name}</div>
                        <div className="text-[10px] text-gray-500">{selectedFile.type}</div>
                      </div>
                    </div>

                    <div>
                      {isScanning ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          <RotateCw className="w-3 h-3 animate-spin" />
                          <span>Auditing ({progress}%)...</span>
                        </span>
                      ) : verificationDone ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Score: {selectedFile.securityScore}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => startVerification()}
                          className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                        >
                          Verify Now
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Verification Checkpoints */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedFile.fields.map((field, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-white border border-gray-200/70 flex items-center justify-between"
                      >
                        <span className="text-[10px] text-gray-500">{field.label}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {field.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UploadModal;
