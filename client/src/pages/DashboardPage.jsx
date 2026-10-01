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
        <div className="h-8 bg-slate-900 rounded-lg w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-2xl border border-slate-800"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-900 rounded-2xl border border-slate-800"></div>
          <div className="h-72 bg-slate-900 rounded-2xl border border-slate-800"></div>
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
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Procurement Intelligence Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time document verification, extraction metrics, and discrepancy monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboard}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {!hasDocuments && (
            <button
              onClick={handleSeedDemo}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 text-xs font-semibold shadow-sm transition-all"
            >
              <Zap className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : 'text-amber-400'}`} />
              <span>{isSeeding ? 'Loading Demo...' : 'Load Sample Documents'}</span>
            </button>
          )}

          <Link
            to="/upload"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Documents</span>
          </Link>
        </div>
      </div>

      {/* 5 Real Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Total Documents */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700/80 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Documents</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Files className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats.totalDocuments}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">In repository</span>
        </div>

        {/* Metric 2: Processed Documents */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700/80 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Processed</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats.processedDocuments}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Analyzed by AI</span>
        </div>

        {/* Metric 3: Verified Documents */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700/80 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Verified</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {stats.verifiedDocuments}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">High confidence (≥80%)</span>
        </div>

        {/* Metric 4: Documents Needing Review */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700/80 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Need Review</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            {stats.documentsNeedingReview}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Attention required</span>
        </div>

        {/* Metric 5: Discrepancies Detected */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700/80 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Discrepancies</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">
            {stats.discrepanciesDetected}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Identified variances</span>
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
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900/50 to-slate-900/50 border border-amber-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Attention Required ({attentionRequired.length} documents)
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Documents with quantity variances, amount discrepancies, missing fields, or low extraction confidence
                    </p>
                  </div>
                </div>

                <Link
                  to="/validation"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
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
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/70 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate block">
                          {doc.originalName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {doc.vendorName || 'Vendor not detected'} • Doc #{doc.documentNumber || 'N/A'}
                        </span>
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>

                    <div className="space-y-1 mt-2.5 pt-2.5 border-t border-slate-800/80">
                      {doc.reasons?.map((reason, rIdx) => (
                        <p key={rIdx} className="text-[11px] text-amber-400/90 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
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
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Recent Documents</h3>
                  <p className="text-[11px] text-slate-400">
                    Latest procurement files processed by DocuTrust AI
                  </p>
                </div>
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  <span>View All ({stats.totalDocuments})</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="pb-3 pl-2">Filename</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Confidence</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3 pr-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {recentDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 pl-2 pr-4 font-medium text-slate-200">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="hover:text-cyan-400 transition-colors truncate max-w-[180px] sm:max-w-[240px] block"
                            title={doc.originalName}
                          >
                            {doc.originalName}
                          </Link>
                          <span className="text-[10px] text-slate-500 block">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <DocumentTypeBadge type={doc.documentType} />
                        </td>
                        <td className="py-3 pr-4">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1.5">
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
                            <span className="text-[11px] text-slate-400 font-mono">
                              {Math.round(doc.confidence * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 font-mono font-medium text-slate-200">
                          {doc.total ? `$${Number(doc.total).toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-medium transition-colors"
                          >
                            <span>Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 1 Col: Processing Activity Timeline */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Processing Activity</h3>
                    <p className="text-[11px] text-slate-400">Audit logs & AI runs</p>
                  </div>
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>

                <div className="space-y-4">
                  {processingActivity.length === 0 ? (
                    <p className="text-xs text-slate-500">No activity logged yet.</p>
                  ) : (
                    processingActivity.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-sm shadow-cyan-400/50" />
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-slate-200 truncate block">
                            {act.title}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
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
              <div className="mt-6 pt-4 border-t border-slate-800">
                <Link
                  to="/chat"
                  className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-xs"
                >
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Ask AI About Your Documents</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
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
