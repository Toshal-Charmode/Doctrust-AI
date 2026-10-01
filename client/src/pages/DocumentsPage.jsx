import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import documentApi from '../services/documentApi';
import { useToast } from '../context/ToastContext';
import { StatusBadge, DocumentTypeBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import {
  Search,
  Trash2,
  RefreshCw,
  ExternalLink,
  GitCompare,
  UploadCloud,
  CheckSquare,
  Square,
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
      showToast(err.response?.data?.message || 'Failed to load documents', 'error');
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

  const handleToggleSelect = (docId) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map((d) => d.id));
    }
  };

  const handleDelete = async (docId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await documentApi.delete(docId);
      showToast(res.message || 'Document deleted', 'success');
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      setSelectedDocIds((prev) => prev.filter((id) => id !== docId));
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleReprocess = async (docId, name) => {
    try {
      setReprocessingId(docId);
      const res = await documentApi.reprocess(docId);
      showToast(res.message || 'Document re-extracted successfully!', 'success');
      fetchDocuments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Re-extraction failed', 'error');
    } finally {
      setReprocessingId(null);
    }
  };

  const handleCompareSelected = () => {
    if (selectedDocIds.length < 2) {
      showToast('Select at least 2 documents to compare (e.g. PO + Invoice)', 'info');
      return;
    }
    navigate(`/validation?docs=${selectedDocIds.join(',')}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Documents Repository</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Search, filter, manage, and select procurement documents for 3-way match validation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {selectedDocIds.length >= 2 && (
            <button
              onClick={handleCompareSelected}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#EEF8CD] hover:bg-[#e4f0ba] text-slate-800 border border-[#d8e8a8] text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <GitCompare className="w-4 h-4 text-emerald-700" />
              <span>Compare Selected ({selectedDocIds.length})</span>
            </button>
          )}

          <Link
            to="/upload"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 text-xs font-extrabold shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename, vendor name, or document number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#EAE5DC] focus:border-[#FFC5AA] focus:ring-2 focus:ring-[#FFC5AA]/20 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all shadow-2xs"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-white border border-[#EAE5DC] text-xs font-semibold text-slate-700 focus:border-[#FFC5AA] outline-none transition-all shadow-2xs"
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
            className="px-3 py-2.5 rounded-2xl bg-white border border-[#EAE5DC] text-xs font-semibold text-slate-700 focus:border-[#FFC5AA] outline-none transition-all shadow-2xs"
          >
            {DOC_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            onClick={fetchDocuments}
            className="p-2.5 rounded-2xl bg-white border border-[#EAE5DC] text-slate-500 hover:text-slate-800 transition-colors shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Documents Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Loading procurement documents...
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents match your query"
          description="Try adjusting your search terms or filters, or upload a new procurement document."
          actionText="Upload Documents"
          actionLink="/upload"
        />
      ) : (
        <div className="rounded-3xl border border-[#EAE5DC] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#F0EBE1] bg-[#FAF9F6] text-slate-500 font-bold">
                  <th className="py-3.5 pl-4 pr-2 w-10">
                    <button
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Select all"
                    >
                      {selectedDocIds.length === documents.length && documents.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
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
              <tbody className="divide-y divide-[#F0EBE1]">
                {documents.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  const isReprocessing = reprocessingId === doc.id;

                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-[#FAF9F6] transition-colors ${
                        isSelected ? 'bg-[#EEF8CD]/20' : ''
                      }`}
                    >
                      <td className="py-3 pl-4 pr-2">
                        <button
                          onClick={() => handleToggleSelect(doc.id)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <Link
                          to={`/documents/${doc.id}`}
                          className="font-bold text-slate-900 hover:text-[#c25050] transition-colors block truncate max-w-xs"
                          title={doc.original_name}
                        >
                          {doc.original_name}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(doc.created_at).toLocaleDateString()} • {(doc.file_size / 1024).toFixed(0)} KB
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <DocumentTypeBadge type={doc.document_type} />
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-semibold truncate block max-w-[160px]">
                          {doc.vendor_name || '—'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
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
                          <div className="w-12 h-2 rounded-full bg-[#EAE5DC] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                doc.confidence >= 0.85
                                  ? 'bg-[#BBF1D2] border border-[#9ae6b8]'
                                  : doc.confidence >= 0.70
                                  ? 'bg-[#FFC5AA] border border-[#f0af90]'
                                  : 'bg-[#FF9D9D] border border-[#f28585]'
                              }`}
                              style={{ width: `${Math.round(doc.confidence * 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-600">
                            {Math.round(doc.confidence * 100)}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {doc.total ? `$${Number(doc.total).toLocaleString()} ${doc.currency || 'USD'}` : '—'}
                      </td>

                      <td className="py-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-[#FAF9F6] transition-colors"
                            title="View Document Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleReprocess(doc.id, doc.original_name)}
                            disabled={isReprocessing}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-[#FAF9F6] transition-colors disabled:opacity-50 cursor-pointer"
                            title="Reprocess with Gemini AI"
                          >
                            <RefreshCw className={`w-4 h-4 ${isReprocessing ? 'animate-spin' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleDelete(doc.id, doc.original_name)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
