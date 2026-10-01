import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import documentApi from '../services/documentApi';
import { useToast } from '../context/ToastContext';
import { StatusBadge, DocumentTypeBadge } from '../components/ui/Badge';
import {
  FileText,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  GitCompare,
  MessageSquareText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  Hash,
  Download,
  Receipt,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export function DocumentDetailsPage() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reprocessing, setReprocessing] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const res = await documentApi.getById(id);
      if (res.success) {
        setDoc(res.data.document);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load document details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const handleReprocess = async () => {
    try {
      setReprocessing(true);
      const res = await documentApi.reprocess(id);
      showToast('Document reprocessed with Gemini AI!', 'success');
      fetchDocument();
    } catch (err) {
      showToast(err.response?.data?.message || 'Reprocessing failed', 'error');
    } finally {
      setReprocessing(false);
    }
  };

  if (loading && !doc) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-slate-900 rounded w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-slate-900 rounded-2xl border border-slate-800"></div>
          <div className="lg:col-span-2 h-96 bg-slate-900 rounded-2xl border border-slate-800"></div>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-400 mb-4">Document not found or access denied.</p>
        <Link to="/documents" className="text-xs text-cyan-400 font-semibold underline">
          Return to Documents Repository
        </Link>
      </div>
    );
  }

  const extracted = doc.extracted || {};
  const lineItems = extracted.lineItems || [];
  const missingFields = extracted.missingFields || [];
  const warnings = doc.warnings || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/documents"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Back to Documents"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white truncate max-w-md">
                {doc.originalName}
              </h1>
              <DocumentTypeBadge type={doc.documentType} />
              <StatusBadge status={doc.status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Uploaded on {new Date(doc.createdAt).toLocaleString()} • {(doc.fileSize / 1024).toFixed(1)} KB • {doc.mimeType}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to={`/validation?docs=${doc.id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>Validate Against Others</span>
          </Link>

          <Link
            to={`/chat?doc=${doc.id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <MessageSquareText className="w-4 h-4 text-indigo-400" />
            <span>Ask AI About Doc</span>
          </Link>

          <button
            onClick={handleReprocess}
            disabled={reprocessing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reprocessing ? 'animate-spin' : ''}`} />
            <span>{reprocessing ? 'Reprocessing...' : 'Reprocess AI'}</span>
          </button>
        </div>
      </div>

      {/* Split Layout: LEFT = Metadata & File Preview, RIGHT = AI Analysis & Extracted Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Document Card & Raw Content */}
        <div className="space-y-6">
          {/* Document Summary Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Document Metadata</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Classification</span>
                <span className="font-semibold text-slate-200">{doc.documentType}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">AI Confidence</span>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400">
                    {Math.round(doc.confidence * 100)}%
                  </span>
                  <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.round(doc.confidence * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Document Number</span>
                <span className="font-mono font-semibold text-slate-200">
                  {extracted.documentNumber || extracted.invoiceNumber || extracted.poNumber || '—'}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Vendor</span>
                <span className="font-medium text-slate-200 text-right truncate max-w-[150px]">
                  {extracted.vendorName || '—'}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Referenced PO</span>
                <span className="font-mono font-semibold text-cyan-400">
                  {extracted.poNumber || 'None'}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Document Date</span>
                <span className="text-slate-200 font-mono">
                  {extracted.documentDate || '—'}
                </span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Grand Total</span>
                <span className="font-mono font-bold text-slate-100 text-sm">
                  {extracted.total ? `$${Number(extracted.total).toLocaleString()} ${extracted.currency || 'USD'}` : '—'}
                </span>
              </div>
            </div>

            {/* Direct File Link */}
            {doc.filename && (
              <a
                href={`/uploads/${doc.filename}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Raw Document File</span>
              </a>
            )}
          </div>

          {/* Raw Text Accordion */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm">
            <button
              onClick={() => setShowRawText(!showRawText)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-300"
            >
              <span>Extracted Raw Text / OCR Layer</span>
              {showRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRawText && (
              <pre className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono overflow-x-auto max-h-64 whitespace-pre-wrap">
                {doc.rawText || 'No raw text available.'}
              </pre>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AI Analysis, Extracted Fields & Line Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Reasoning & Executive Summary Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">AI Classification Reasoning & Summary</h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
              {doc.summary || doc.reason || 'Document extracted and classified by Gemini AI.'}
            </p>

            {doc.reason && doc.reason !== doc.summary && (
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Classification Anchor:</span> {doc.reason}
              </div>
            )}

            {/* Warnings or Discrepancy Alerts */}
            {warnings.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Document Discrepancy Warnings Detected</span>
                </div>
                {warnings.map((warn, wIdx) => (
                  <p key={wIdx} className="text-amber-200/90 text-[11px] pl-5 list-item">
                    {warn}
                  </p>
                ))}
              </div>
            )}

            {/* Missing Fields Notice */}
            {missingFields.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-400">Missing Standard Fields:</span>{' '}
                <span className="text-amber-400 font-mono text-[11px]">{missingFields.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Extracted Fields Matrix */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span>Extracted Structured Fields</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Vendor Name</span>
                <span className="font-semibold text-slate-200">{extracted.vendorName || 'Not found'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Vendor Address</span>
                <span className="text-slate-300 truncate block">{extracted.vendorAddress || 'Not found'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Document / Invoice Number</span>
                <span className="font-mono font-semibold text-cyan-400">
                  {extracted.documentNumber || 'Not found'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">PO Number Reference</span>
                <span className="font-mono font-semibold text-indigo-400">
                  {extracted.poNumber || 'Not referenced'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Document Date</span>
                <span className="font-mono text-slate-200">{extracted.documentDate || 'Not found'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Due Date / Validity</span>
                <span className="font-mono text-slate-200">{extracted.dueDate || 'N/A'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Subtotal</span>
                <span className="font-mono text-slate-200">
                  {extracted.subtotal ? `$${Number(extracted.subtotal).toLocaleString()}` : '—'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Tax</span>
                <span className="font-mono text-slate-200">
                  {extracted.tax !== null && extracted.tax !== undefined ? `$${Number(extracted.tax).toLocaleString()}` : '—'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                <span className="text-[11px] text-cyan-300 block mb-1 font-semibold">Total Amount</span>
                <span className="font-mono font-bold text-white text-sm">
                  {extracted.total ? `$${Number(extracted.total).toLocaleString()} ${extracted.currency || 'USD'}` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>Extracted Line Items ({lineItems.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Currency: {extracted.currency || 'USD'}
              </span>
            </div>

            {lineItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No individual itemized lines were detected in this document.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="pb-3 pl-2">Item Description</th>
                      <th className="pb-3 text-right">Quantity</th>
                      <th className="pb-3 text-right">Unit Price</th>
                      <th className="pb-3 pr-2 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {lineItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-3 pl-2 pr-4 font-sans font-medium text-slate-200">
                          {item.description || `Item #${idx + 1}`}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-300">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-300">
                          ${Number(item.unitPrice || 0).toFixed(2)}
                        </td>
                        <td className="py-3 pr-2 text-right font-bold text-white">
                          ${Number(item.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentDetailsPage;
