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
    if (e.dataTransfer.files?.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const handleRemoveFile = (index) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAndProcess = async () => {
    if (stagedFiles.length === 0) {
      showToast('Please select at least one document to upload.', 'warning');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const formData = new FormData();
      stagedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const res = await documentApi.upload(formData, (progress) => {
        setUploadProgress(progress);
      });

      if (res.success) {
        setUploadResults(res.data.results);
        setStagedFiles([]);
        showToast('All documents uploaded and processed by Gemini AI!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload documents', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      setIsSeedingDemo(true);
      const res = await demoApi.seedDemo();
      showToast('Demo procurement files loaded into your workspace!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to seed demo documents', 'error');
    } finally {
      setIsSeedingDemo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Upload Procurement Documents</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload Invoices, Purchase Orders, Delivery Receipts, or Quotations for automated AI extraction.
          </p>
        </div>

        <button
          onClick={handleSeedDemo}
          disabled={isSeedingDemo}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 text-xs font-semibold shadow-sm transition-all"
        >
          <Zap className={`w-3.5 h-3.5 ${isSeedingDemo ? 'animate-spin' : 'text-amber-400'}`} />
          <span>{isSeedingDemo ? 'Loading Sample Docs...' : 'Test with Sample Docs'}</span>
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-10 rounded-2xl border-2 border-dashed text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'
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

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="text-sm font-bold text-slate-100 mb-1">
          Drag and drop your procurement documents here
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          or <span className="text-cyan-400 font-semibold underline">browse files</span> from your computer
        </p>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
          <span>Supported: PDF, PNG, JPG, JPEG</span>
          <span>•</span>
          <span>Max 15MB per file</span>
          <span>•</span>
          <span>Multi-file supported</span>
        </div>
      </div>

      {/* Staged Files Ready for Upload */}
      {stagedFiles.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Selected Documents ({stagedFiles.length})
            </h3>
            <button
              onClick={() => setStagedFiles([])}
              className="text-xs text-slate-400 hover:text-rose-400"
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
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-cyan-400">
                      {isPdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-200 truncate block">
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
                      handleRemoveFile(idx);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2 text-cyan-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing through Gemini Vision & Extraction Pipeline...</span>
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Upload CTA */}
          <div className="pt-2">
            <button
              onClick={handleUploadAndProcess}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with DocuTrust AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Extraction & Classification ({stagedFiles.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Upload Results Summary Card */}
      {uploadResults && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Successfully Processed {uploadResults.length} Document(s)</span>
            </div>

            <Link
              to="/documents"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              <span>View in Repository</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {uploadResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs"
              >
                <div className="min-w-0 pr-4">
                  <span className="font-semibold text-slate-200 block truncate">
                    {result.originalName}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {result.document && (
                      <DocumentTypeBadge type={result.document.document_type} />
                    )}
                    <span className="text-[11px] text-slate-400">
                      Confidence: {Math.round((result.document?.confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {result.document && <StatusBadge status={result.document.status} />}
                  <Link
                    to={`/documents/${result.id}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
