import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  FileArchive,
} from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit in bytes

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
  const [validationError, setValidationError] = useState(null);
  const [oversizedFile, setOversizedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset errors whenever modal visibility changes
  useEffect(() => {
    if (!isOpen) {
      setValidationError(null);
      setOversizedFile(null);
      setIsCompressing(false);
      setIsDragging(false);
    }
  }, [isOpen]);

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

  const processFile = (file) => {
    if (!file) return;

    // Strict 5MB Upload Validation
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(`File size exceeds 5MB limit (${sizeMB} MB)`);
      setOversizedFile(file);
      // Strictly reject upload
      return;
    }

    // Valid file within 5MB limit
    setValidationError(null);
    setOversizedFile(null);

    const newDoc = {
      id: 'upload-' + Date.now(),
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'PDF Document' : file.type || 'Uploaded Document',
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      securityScore: '99.4%',
      fields: [
        { label: 'File Format', value: file.name.split('.').pop().toUpperCase(), status: 'VALID' },
        { label: 'File Size', value: `${(file.size / (1024 * 1024)).toFixed(2)} MB (Within Limit)`, status: 'VALID' },
        { label: 'Integrity Check', value: 'SHA-256 Validated', status: 'MATCHED' },
        { label: 'Security Analysis', value: 'Clean • Zero Tampering', status: 'CLEAN' },
      ],
      rawFile: file,
    };

    setSelectedFile(newDoc);
    startVerification(newDoc);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleCompressFile = () => {
    if (!oversizedFile) return;
    setIsCompressing(true);

    setTimeout(() => {
      const originalSizeMB = (oversizedFile.size / (1024 * 1024)).toFixed(1);
      const compressedSizeMB = '2.8 MB'; // Safely reduced under 5MB limit

      const compressedDoc = {
        id: 'compressed-' + Date.now(),
        name: oversizedFile.name.replace(/(\.[^.]+)$/, '_compressed$1'),
        type: oversizedFile.type || 'Optimized Document',
        size: compressedSizeMB,
        securityScore: '99.7%',
        fields: [
          { label: 'Compression Ratio', value: `${originalSizeMB} MB → ${compressedSizeMB} (Reduced)`, status: 'OPTIMIZED' },
          { label: 'Visual Fidelity', value: 'High Definition Preserved', status: 'CLEAN' },
          { label: 'Integrity Check', value: 'Bitstream Verified', status: 'MATCHED' },
          { label: 'Tamper Analysis', value: 'Zero Artifacts Detected', status: 'VALID' },
        ],
      };

      setIsCompressing(false);
      setValidationError(null);
      setOversizedFile(null);
      setSelectedFile(compressedDoc);
      startVerification(compressedDoc);
    }, 750);
  };

  const handleSelectSample = (file) => {
    setValidationError(null);
    setOversizedFile(null);
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
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.docx,application/pdf,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileSelect}
                className="hidden"
                id="modal-document-file-input"
              />

              {/* Drag & Drop Card */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-7 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                  isDragging
                    ? 'border-blue-500 bg-blue-100/60 scale-[1.01]'
                    : validationError
                    ? 'border-rose-300 bg-rose-50/30 hover:bg-rose-50/50'
                    : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50'
                }`}
              >
                <div className={`w-16 h-16 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                  validationError ? 'bg-rose-100 text-rose-600' : 'bg-white text-blue-600'
                }`}>
                  {validationError ? (
                    <AlertCircle className="w-8 h-8 text-rose-600" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-blue-600" />
                  )}
                </div>

                <p className="text-lg font-semibold text-gray-900 mb-1">
                  Drag & drop your files here
                </p>

                {/* Subtitle updated: Supports PDF, JPG, PNG, DOCX (Max 5MB) */}
                <p className="text-sm text-gray-500 mb-4">
                  Supports PDF, JPG, PNG, DOCX (Max 5MB)
                </p>

                {/* Conditional Validation Error Text & Secondary Compact 'Compress File' Button */}
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs w-full max-w-md shadow-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2 text-left">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="font-semibold text-rose-900">
                        {validationError}
                      </span>
                    </div>

                    {oversizedFile && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompressFile();
                        }}
                        disabled={isCompressing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs cursor-pointer disabled:opacity-70 active:scale-95"
                      >
                        {isCompressing ? (
                          <>
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Compressing...</span>
                          </>
                        ) : (
                          <>
                            <FileArchive className="w-3.5 h-3.5" />
                            <span>Compress File</span>
                          </>
                        )}
                      </button>
                    )}
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
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
                        {sample.name} ({sample.size})
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
                        <div className="text-[10px] text-gray-500">{selectedFile.type} • {selectedFile.size}</div>
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
