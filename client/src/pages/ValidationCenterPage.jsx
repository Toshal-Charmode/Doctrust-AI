import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import documentApi from '../services/documentApi';
import validationApi from '../services/validationApi';
import { useToast } from '../context/ToastContext';
import { ValidationStatusBadge, SeverityBadge, DocumentTypeBadge } from '../components/ui/Badge';
import {
  GitCompare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  RefreshCw,
  FileText,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export function ValidationCenterPage() {
  const [availableDocs, setAvailableDocs] = useState([]);
  const [selectedDocA, setSelectedDocA] = useState('');
  const [selectedDocB, setSelectedDocB] = useState('');
  const [selectedDocC, setSelectedDocC] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [validationResult, setValidationResult] = useState(null);
  const [pastValidations, setPastValidations] = useState([]);
  const [activeTab, setActiveTab] = useState('compare'); // 'compare' | 'history'

  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setInitialLoading(true);
        const [docsRes, valRes] = await Promise.all([
          documentApi.getAll(),
          validationApi.getAll(),
        ]);

        if (docsRes.success) {
          const docs = docsRes.data.documents || [];
          setAvailableDocs(docs);

          // Check if pre-selected documents were passed in query
          const params = new URLSearchParams(location.search);
          const docParam = params.get('docs');
          if (docParam) {
            const ids = docParam.split(',').map((id) => parseInt(id.trim(), 10));
            if (ids[0]) setSelectedDocA(ids[0].toString());
            if (ids[1]) setSelectedDocB(ids[1].toString());
            if (ids[2]) setSelectedDocC(ids[2].toString());
          } else {
            // Smart auto-select: choose a PO and an Invoice if present
            const po = docs.find((d) => d.document_type === 'PURCHASE_ORDER');
            const inv = docs.find((d) => d.document_type === 'INVOICE');
            const dr = docs.find((d) => d.document_type === 'DELIVERY_RECEIPT');

            if (po) setSelectedDocA(po.id.toString());
            if (inv) setSelectedDocB(inv.id.toString());
            if (dr) setSelectedDocC(dr.id.toString());
          }
        }

        if (valRes.success) {
          setPastValidations(valRes.data.validations || []);
          // If there's an existing validation, load the latest as preview
          if (valRes.data.validations?.length > 0 && !location.search.includes('docs')) {
            const latest = valRes.data.validations[0];
            setValidationResult(latest);
          }
        }
      } catch (err) {
        showToast('Failed to load validation workspace data', 'error');
      } finally {
        setInitialLoading(false);
      }
    }
    loadData();
  }, [location.search]);

  const handleRunValidation = async () => {
    const selectedIds = [selectedDocA, selectedDocB, selectedDocC]
      .filter(Boolean)
      .map((id) => parseInt(id, 10));

    if (selectedIds.length < 2) {
      showToast('Please select at least Document A and Document B to compare.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await validationApi.compare(selectedIds);
      if (res.success) {
        setValidationResult(res.data);
        showToast('Cross-document validation completed successfully!', 'success');
        // Refresh past validations
        const updatedHistory = await validationApi.getAll();
        if (updatedHistory.success) {
          setPastValidations(updatedHistory.data.validations || []);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Validation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPastValidation = async (valId) => {
    try {
      const res = await validationApi.getById(valId);
      if (res.success) {
        setValidationResult(res.data.validation);
        setActiveTab('compare');
      }
    } catch (err) {
      showToast('Failed to load validation record', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-cyan-400" />
            <span>Cross-Document Validation Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated 2-way and 3-way match reconciliation between Purchase Orders, Invoices, and Delivery Receipts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'compare'
                ? 'bg-blue-600/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Run Validation
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Past Validations ({pastValidations.length})
          </button>
        </div>
      </div>

      {activeTab === 'compare' ? (
        <div className="space-y-6">
          {/* Document Selectors Workspace */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span>Select Documents for 3-Way Match Audit</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Document A Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Document A (e.g. Purchase Order) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedDocA}
                  onChange={(e) => setSelectedDocA(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 outline-none transition-all"
                >
                  <option value="">Select Document A...</option>
                  {availableDocs.map((d) => (
                    <option key={d.id} value={d.id} disabled={d.id.toString() === selectedDocB || d.id.toString() === selectedDocC}>
                      [{d.document_type}] {d.original_name} (${d.total || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Document B Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Document B (e.g. Vendor Invoice) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedDocB}
                  onChange={(e) => setSelectedDocB(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 outline-none transition-all"
                >
                  <option value="">Select Document B...</option>
                  {availableDocs.map((d) => (
                    <option key={d.id} value={d.id} disabled={d.id.toString() === selectedDocA || d.id.toString() === selectedDocC}>
                      [{d.document_type}] {d.original_name} (${d.total || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Document C Selector (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Document C (e.g. Delivery Receipt) <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <select
                  value={selectedDocC}
                  onChange={(e) => setSelectedDocC(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 outline-none transition-all"
                >
                  <option value="">Select Document C (Optional)...</option>
                  {availableDocs.map((d) => (
                    <option key={d.id} value={d.id} disabled={d.id.toString() === selectedDocA || d.id.toString() === selectedDocB}>
                      [{d.document_type}] {d.original_name} (${d.total || 0})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleRunValidation}
                disabled={loading || !selectedDocA || !selectedDocB}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs tracking-wide shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Scale className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Analyzing Discrepancies...' : 'Run Cross-Document Validation'}</span>
              </button>
            </div>
          </div>

          {/* Validation Results Display */}
          {validationResult && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Overall Status Banner */}
              <div
                className={`p-6 rounded-2xl border backdrop-blur-md shadow-lg ${
                  validationResult.overallStatus === 'MATCH'
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                    : validationResult.overallStatus === 'CRITICAL_MISMATCH'
                    ? 'bg-rose-950/25 border-rose-500/40 text-rose-100'
                    : 'bg-amber-950/25 border-amber-500/40 text-amber-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      {validationResult.overallStatus === 'MATCH' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : validationResult.overallStatus === 'CRITICAL_MISMATCH' ? (
                        <XCircle className="w-6 h-6 text-rose-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Overall Validation Result
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                          {validationResult.overallStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        {validationResult.title || 'Cross-Document Reconciliation'}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        {validationResult.discrepancyCount === 0
                          ? 'All cross-document checks verified with 100% agreement.'
                          : `${validationResult.discrepancyCount} discrepancy(ies) detected across audited documents.`}
                      </p>
                    </div>
                  </div>

                  {validationResult.recommendedAction && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs max-w-sm sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block mb-1">
                        Recommended Operational Action:
                      </span>
                      <span className="font-semibold text-slate-200">
                        {validationResult.recommendedAction}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Auditor Explanation Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">AI Procurement Auditor Explanation</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  {validationResult.aiExplanation}
                </p>
              </div>

              {/* Discrepancies Table (if any) */}
              {validationResult.discrepancies?.length > 0 && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Itemized Discrepancy Breakdown ({validationResult.discrepancies.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {validationResult.discrepancies.map((disc, dIdx) => (
                      <div
                        key={dIdx}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 uppercase tracking-wide">
                            {disc.field}
                          </span>
                          <SeverityBadge severity={disc.severity} />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 block mb-0.5">Expected:</span>
                            <span className="font-mono font-semibold text-emerald-400">
                              {String(disc.expectedValue)}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 block mb-0.5">Actual:</span>
                            <span className="font-mono font-semibold text-rose-400">
                              {String(disc.actualValue)}
                            </span>
                          </div>
                        </div>

                        {disc.difference && (
                          <div className="text-[11px] text-amber-300 font-semibold">
                            Variance: {disc.difference}
                          </div>
                        )}

                        <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-1.5">
                          {disc.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Checks Matrix Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Cross-Document Verification Matrix</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="pb-3 pl-2">Field Tested</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Severity</th>
                        <th className="pb-3 pr-2">Reconciliation Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {validationResult.checks?.map((check, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-800/30">
                          <td className="py-3 pl-2 pr-4 font-semibold text-slate-200">
                            {check.label || check.field}
                          </td>
                          <td className="py-3 pr-4">
                            <ValidationStatusBadge status={check.status} />
                          </td>
                          <td className="py-3 pr-4">
                            <SeverityBadge severity={check.severity} />
                          </td>
                          <td className="py-3 pr-2 text-slate-300 leading-relaxed">
                            {check.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Past Validations History Tab */
        <div className="space-y-4">
          {pastValidations.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No validation runs recorded yet. Use the 'Run Validation' tab above to test documents.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastValidations.map((val) => (
                <div
                  key={val.id}
                  onClick={() => handleSelectPastValidation(val.id)}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/60 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{val.title}</h4>
                      <span className="text-[11px] text-slate-500">
                        {new Date(val.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <ValidationStatusBadge status={val.overallStatus} />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {val.aiExplanation}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>{val.discrepancyCount} discrepancy(ies) detected</span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <span>View Full Matrix</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ValidationCenterPage;
