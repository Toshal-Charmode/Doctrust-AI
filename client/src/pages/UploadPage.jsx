import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import documentApi from '../services/documentApi';
import { demoApi } from '../services/dashboardApi';
import { useToast } from '../context/ToastContext';
import { StatusBadge, DocumentTypeBadge } from '../components/ui/Badge';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  Zap,
  Image as ImageIcon,
} from 'lucide-react';

export function UploadPage() {
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);
  const [isSeedingDemo, setIsSeedingDemo] = useState(false);

  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndAddFiles = (files) => {
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg'];
    const validMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 15 * 1024 * 1024; // 15MB

    const newFiles = [];
    for (const file of files) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!validExts.includes(ext) && !validMimes.includes(file.type)) {
        showToast(`Skipped ${file.name}: only PDF, PNG, and JPG files are supported.`, 'warning');
        continue;
      }
      if (file.size > maxSize) {
        showToast(`Skipped ${file.name}: file exceeds 15MB limit.`, 'warning');
        continue;
      }
      newFiles.push(file);
    }

    setStagedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveStaged = (index) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (stagedFiles.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress(15);

      const res = await documentApi.upload(stagedFiles, (progress) => {
        setUploadProgress(progress);
      });

      if (res.success) {
        setUploadResults(res.data);
        showToast(`Successfully processed ${stagedFiles.length} procurement documents!`, 'success');
        setStagedFiles([]);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Document upload & processing failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      setIsSeedingDemo(true);
      const res = await demoApi.seedDemo();
      showToast(res.message || 'Loaded realistic sample procurement documents!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to seed demo data', 'error');
    } finally {
      setIsSeedingDemo(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Upload Procurement Documents</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Upload Invoices, Purchase Orders, Delivery Receipts, or Quotations for automated AI extraction.
          </p>
        </div>

        <button
          onClick={handleSeedDemo}
          disabled={isSeedingDemo}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#EEF8CD] hover:bg-[#e4f0ba] text-slate-800 border border-[#d8e8a8] text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <Zap className={`w-3.5 h-3.5 ${isSeedingDemo ? 'animate-spin' : 'text-amber-600'}`} />
          <span>{isSeedingDemo ? 'Loading Sample Docs...' : 'Test with Sample Docs'}</span>
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-10 rounded-3xl border-2 border-dashed text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-[#FF9D9D] bg-[#FF9D9D]/15 shadow-md'
            : 'border-[#EAE5DC] hover:border-[#FFC5AA] bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF9D9D]/30 to-[#FFC5AA]/30 text-[#c25050] border border-[#FFC5AA]/60 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-sm font-extrabold text-slate-900 mb-1">
          Drag and drop your procurement documents here
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-medium">
          or <span className="text-[#c25050] font-bold underline">browse files</span> from your computer
        </p>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-semibold">
          <span>Supported: PDF, PNG, JPG, JPEG</span>
          <span>•</span>
          <span>Max 15MB per file</span>
          <span>•</span>
          <span>Multi-file supported</span>
        </div>
      </div>

      {/* Staged Files Ready for Upload */}
      {stagedFiles.length > 0 && (
        <div className="rounded-3xl border border-[#EAE5DC] bg-white p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Selected Documents ({stagedFiles.length})
            </h3>
            <button
              onClick={() => setStagedFiles([])}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {stagedFiles.map((file, idx) => {
              const isPdf = file.name.endsWith('.pdf');
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-[#FF9D9D]/20 text-rose-700">
                      {isPdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 truncate block">
                        {file.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {(file.size / 1024).toFixed(1)} KB • {file.type || 'Document'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveStaged(idx);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total payload: {(stagedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
            </span>

            <button
              onClick={handleUploadSubmit}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                  <span>Processing with Gemini AI ({uploadProgress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-800" />
                  <span>Start AI Extraction & Audit</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Upload Processing Results */}
      {uploadResults && (
        <div className="rounded-3xl border border-[#9ae6b8] bg-gradient-to-br from-[#BBF1D2]/30 via-[#EEF8CD]/20 to-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#BBF1D2] flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Extraction & Classification Complete
              </h3>
              <p className="text-xs text-slate-600">
                Document parsed with structured entity extraction and deterministic arithmetic reconciliation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-all"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/validation"
              className="px-4 py-2 rounded-2xl bg-white border border-[#EAE5DC] text-slate-800 text-xs font-bold shadow-2xs hover:bg-[#EEF8CD] transition-all"
            >
              Run 3-Way Reconciliation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
