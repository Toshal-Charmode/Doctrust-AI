import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import documentApi from '../services/documentApi';
import { useToast } from '../context/ToastContext';
import { StatusBadge, DocumentTypeBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import {
  Search,
  Filter,
  Trash2,
  RefreshCw,
  ExternalLink,
  GitCompare,
  UploadCloud,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';

const DOC_TYPES = [
  { value: 'ALL', label: 'All Document Types' },
  { value: 'PURCHASE_ORDER', label: 'Purchase Orders' },
  { value: 'INVOICE', label: 'Invoices' },
  { value: 'DELIVERY_RECEIPT', label: 'Delivery Receipts' },
  { value: 'QUOTATION', label: 'Quotations' },
  { value: 'OTHER', label: 'Other Documents' },
];

const DOC_STATUSES = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PROCESSED', label: 'Processed' },
  { value: 'REVIEW_REQUIRED', label: 'Review Required' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'UPLOADED', label: 'Uploaded' },
];

export function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDocIds, setSelectedDocIds] = useState([]);
  const [reprocessingId, setReprocessingId] = useState(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentApi.getAll({
        type: selectedType,
        status: selectedStatus,
        search: search.trim() || undefined,
      });
      if (res.success) {
        setDocuments(res.data.documents || []);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedType, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleToggleSelect = (id) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map((d) => d.id));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await documentApi.delete(id);
      showToast('Document deleted successfully', 'success');
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setSelectedDocIds((prev) => prev.filter((dId) => dId !== id));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete document', 'error');
    }
  };

  const handleReprocess = async (id, name) => {
    try {
      setReprocessingId(id);
      await documentApi.reprocess(id);
      showToast(`Document "${name}" reprocessed with Gemini AI`, 'success');
      fetchDocuments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Reprocessing failed', 'error');
    } finally {
      setReprocessingId(null);
    }
  };

  const handleCompareSelected = () => {
    if (selectedDocIds.length < 2) {
      showToast('Please select at least 2 documents to compare.', 'warning');
      return;
    }
    navigate(`/validation?docs=${selectedDocIds.join(',')}`);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Documents Repository</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Search, filter, manage, and select procurement documents for 3-way match validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedDocIds.length >= 2 && (
            <button
              onClick={handleCompareSelected}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer animate-in fade-in"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Selected ({selectedDocIds.length})</span>
            </button>
          )}

          <Link
            to="/upload"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload</span>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename, vendor name, or document/PO number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 focus:border-cyan-500 outline-none transition-all"
          >
            {DOC_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 focus:border-cyan-500 outline-none transition-all"
          >
            {DOC_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            onClick={fetchDocuments}
            className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Documents Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 animate-pulse">
          Loading documents...
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents match your query"
          description="Try adjusting your search terms or filters, or upload a new procurement document."
          actionText="Upload Documents"
          actionLink="/upload"
        />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                  <th className="py-3.5 pl-4 pr-2 w-10">
                    <button
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-white"
                      title="Select all"
                    >
                      {selectedDocIds.length === documents.length && documents.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-3">Document Name</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Vendor / Identifier</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Confidence</th>
                  <th className="py-3.5 px-3">Total Amount</th>
                  <th className="py-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {documents.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  const isReprocessing = reprocessingId === doc.id;

                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-slate-800/30 transition-colors ${
                        isSelected ? 'bg-blue-950/15' : ''
                      }`}
                    >
                      <td className="py-3 pl-4 pr-2">
                        <button
                          onClick={() => handleToggleSelect(doc.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <Link
                          to={`/documents/${doc.id}`}
                          className="font-medium text-slate-100 hover:text-cyan-400 transition-colors block truncate max-w-xs"
                          title={doc.original_name}
                        >
                          {doc.original_name}
                        </Link>
                        <span className="text-[10px] text-slate-500">
                          {new Date(doc.created_at).toLocaleDateString()} • {(doc.file_size / 1024).toFixed(0)} KB
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <DocumentTypeBadge type={doc.document_type} />
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-300 font-medium truncate block max-w-[160px]">
                          {doc.vendor_name || '—'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {doc.document_number ? `Doc #${doc.document_number}` : ''}
                          {doc.po_number && doc.po_number !== doc.document_number
                            ? ` (PO: ${doc.po_number})`
                            : ''}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <StatusBadge status={doc.status} />
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-mono">
                          <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                doc.confidence >= 0.85
                                  ? 'bg-emerald-500'
                                  : doc.confidence >= 0.70
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.round(doc.confidence * 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {Math.round(doc.confidence * 100)}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-semibold text-slate-200">
                        {doc.total ? `$${Number(doc.total).toLocaleString()} ${doc.currency || 'USD'}` : '—'}
                      </td>

                      <td className="py-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                            title="View Document Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleReprocess(doc.id, doc.original_name)}
                            disabled={isReprocessing}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors disabled:opacity-50"
                            title="Reprocess with Gemini AI"
                          >
                            <RefreshCw className={`w-4 h-4 ${isReprocessing ? 'animate-spin' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleDelete(doc.id, doc.original_name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentsPage;
