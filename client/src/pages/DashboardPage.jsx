import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardApi, demoApi } from '../services/dashboardApi';
import { useToast } from '../context/ToastContext';
import { StatusBadge, DocumentTypeBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import {
  Files,
  FileCheck,
  ShieldAlert,
  AlertTriangle,
  UploadCloud,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getStats();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSeedDemo = async () => {
    try {
      setIsSeeding(true);
      const res = await demoApi.seedDemo();
      showToast(res.message || 'Demo procurement documents loaded!', 'success');
      fetchDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to seed demo documents', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#EAE5DC] rounded-xl w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-3xl border border-[#EAE5DC]"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-white rounded-3xl border border-[#EAE5DC]"></div>
          <div className="h-72 bg-white rounded-3xl border border-[#EAE5DC]"></div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalDocuments: 0,
    processedDocuments: 0,
    verifiedDocuments: 0,
    documentsNeedingReview: 0,
    discrepanciesDetected: 0,
  };

  const hasDocuments = stats.totalDocuments > 0;
  const recentDocuments = data?.recentDocuments || [];
  const attentionRequired = data?.attentionRequired || [];
  const processingActivity = data?.processingActivity || [];

  return (
    <div className="space-y-8">
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Procurement Intelligence Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time document verification, extraction metrics, and discrepancy monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboard}
            className="p-2.5 rounded-xl bg-white border border-[#EAE5DC] text-slate-500 hover:text-slate-900 hover:border-[#FFC5AA] transition-colors shadow-xs cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {!hasDocuments && (
            <button
              onClick={handleSeedDemo}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EEF8CD] hover:bg-[#e4f0bc] text-emerald-950 font-bold border border-[#d8e8a8] text-xs shadow-xs transition-all cursor-pointer"
            >
              <Zap className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : 'text-amber-600'}`} />
              <span>{isSeeding ? 'Loading Demo...' : 'Load Sample Documents'}</span>
            </button>
          )}

          <Link
            to="/upload"
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 text-xs font-extrabold shadow-sm border border-[#fca99d] transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-slate-900" />
            <span>Upload New Documents</span>
          </Link>
        </div>
      </div>

      {/* 5 Real Metric Cards with Pastel Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Total Documents */}
        <div className="p-4 rounded-3xl bg-white/95 border border-[#EAE5DC] hover:border-[#FF9D9D] shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">Total Documents</span>
            <div className="p-2 rounded-xl bg-[#FF9D9D]/20 text-[#e06d6d] border border-[#FF9D9D]/40">
              <Files className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {stats.totalDocuments}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">In repository</span>
        </div>

        {/* Metric 2: Processed Documents */}
        <div className="p-4 rounded-3xl bg-white/95 border border-[#EAE5DC] hover:border-[#FFC5AA] shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">Processed</span>
            <div className="p-2 rounded-xl bg-[#FFC5AA]/30 text-[#d96e38] border border-[#FFC5AA]/50">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {stats.processedDocuments}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">Analyzed by AI</span>
        </div>

        {/* Metric 3: Verified Documents */}
        <div className="p-4 rounded-3xl bg-white/95 border border-[#EAE5DC] hover:border-[#9ae6b8] shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">Verified</span>
            <div className="p-2 rounded-xl bg-[#BBF1D2] text-emerald-900 border border-[#9ae6b8]">
              <FileCheck className="w-4 h-4 text-emerald-800" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 tracking-tight">
            {stats.verifiedDocuments}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">High confidence (≥80%)</span>
        </div>

        {/* Metric 4: Documents Needing Review */}
        <div className="p-4 rounded-3xl bg-white/95 border border-[#EAE5DC] hover:border-[#d8e8a8] shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">Need Review</span>
            <div className="p-2 rounded-xl bg-[#EEF8CD] text-amber-900 border border-[#d8e8a8]">
              <AlertTriangle className="w-4 h-4 text-amber-800" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-800 tracking-tight">
            {stats.documentsNeedingReview}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">Attention required</span>
        </div>

        {/* Metric 5: Discrepancies Detected */}
        <div className="p-4 rounded-3xl bg-white/95 border border-[#EAE5DC] hover:border-[#FF9D9D] shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">Discrepancies</span>
            <div className="p-2 rounded-xl bg-[#FF9D9D]/25 text-rose-900 border border-[#FF9D9D]">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-800 tracking-tight">
            {stats.discrepanciesDetected}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">Identified variances</span>
        </div>
      </div>

      {!hasDocuments ? (
        <EmptyState
          title="No procurement documents uploaded yet"
          description="Upload commercial invoices, purchase orders, or delivery receipts to begin automated classification, extraction, and 3-way match validation."
          actionText="Upload Documents"
          actionLink="/upload"
          onSeedDemo={handleSeedDemo}
        />
      ) : (
        <>
          {/* Attention Required Banner Section */}
          {attentionRequired.length > 0 && (
            <div className="p-5 rounded-3xl bg-[#EEF8CD]/25 border border-[#d8e8a8] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#EEF8CD] border border-[#d8e8a8] text-amber-900">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">
                      Attention Required ({attentionRequired.length} documents)
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Documents with quantity variances, amount discrepancies, missing fields, or low extraction confidence
                    </p>
                  </div>
                </div>

                <Link
                  to="/validation"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#e06d6d] hover:underline"
                >
                  <span>Go to Validation Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {attentionRequired.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/documents/${doc.id}`}
                    className="p-4 rounded-2xl bg-white border border-[#EAE5DC] hover:border-[#FFC5AA] shadow-xs hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#e06d6d] truncate block transition-colors">
                          {doc.originalName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {doc.vendorName || 'Vendor not detected'} • Doc #{doc.documentNumber || 'N/A'}
                        </span>
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>

                    <div className="space-y-1 mt-2.5 pt-2.5 border-t border-[#EAE5DC]">
                      {doc.reasons?.map((reason, rIdx) => (
                        <p key={rIdx} className="text-[11px] text-amber-900 font-medium flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{reason}</span>
                        </p>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Main Grid: Recent Documents Table + Processing Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recent Documents Table */}
            <div className="lg:col-span-2 rounded-3xl border border-[#EAE5DC] bg-white/95 p-6 shadow-xs backdrop-blur-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Recent Documents</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Latest procurement files processed by DocuTrust AI
                  </p>
                </div>
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#e06d6d] hover:underline"
                >
                  <span>View All ({stats.totalDocuments})</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE5DC] text-slate-400 font-bold">
                      <th className="pb-3 pl-2">Filename</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Confidence</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3 pr-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DC]">
                    {recentDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3.5 pl-2 pr-4 font-semibold text-slate-800">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="hover:text-[#e06d6d] transition-colors truncate max-w-[180px] sm:max-w-[240px] block font-bold"
                            title={doc.originalName}
                          >
                            {doc.originalName}
                          </Link>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <DocumentTypeBadge type={doc.documentType} />
                        </td>
                        <td className="py-3.5 pr-4">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 rounded-full bg-[#EAE5DC] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  doc.confidence >= 0.85
                                    ? 'bg-[#BBF1D2]'
                                    : doc.confidence >= 0.70
                                    ? 'bg-[#EEF8CD]'
                                    : 'bg-[#FF9D9D]'
                                }`}
                                style={{ width: `${Math.round(doc.confidence * 100)}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-slate-600 font-mono font-bold">
                              {Math.round(doc.confidence * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 font-mono font-bold text-slate-800">
                          {doc.total ? `$${Number(doc.total).toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3.5 pr-2 text-right">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-white border border-[#EAE5DC] text-slate-700 hover:text-slate-900 text-[11px] font-bold shadow-2xs transition-all"
                          >
                            <span>Details</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 1 Col: Processing Activity Timeline */}
            <div className="rounded-3xl border border-[#EAE5DC] bg-white/95 p-6 shadow-xs backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Processing Activity</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Audit logs & AI runs</p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-slate-500">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-4">
                  {processingActivity.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium">No activity logged yet.</p>
                  ) : (
                    processingActivity.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#FF9D9D] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-slate-800 truncate block">
                            {act.title}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-[#EEF8CD] text-emerald-950 border border-[#d8e8a8] font-bold">
                              {act.status}
                            </span>
                            <span>{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick AI query callout */}
              <div className="mt-6 pt-4 border-t border-[#EAE5DC]">
                <Link
                  to="/chat"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#FFC5AA]/20 via-[#EEF8CD]/20 to-[#BBF1D2]/20 border border-[#FFC5AA]/40 hover:border-[#FFC5AA] transition-all text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold">
                    <Sparkles className="w-4 h-4 text-[#e06d6d]" />
                    <span>Ask AI About Your Documents</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#e06d6d]" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
