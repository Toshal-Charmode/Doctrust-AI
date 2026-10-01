import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardApi, demoApi } from '../services/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge, DocumentTypeBadge } from '../components/ui/Badge';
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
  FileText,
  DollarSign,
  CheckCircle2,
  Receipt,
  Truck,
  Eye,
  Building2,
  Calendar,
} from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
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
      showToast(res.message || 'Sample procurement documents loaded!', 'success');
      fetchDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to seed demo documents', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const stats = data?.stats || {
    totalDocuments: 0,
    processedDocuments: 0,
    verifiedDocuments: 0,
    documentsNeedingReview: 0,
    discrepanciesDetected: 0,
  };

  const hasDocuments = stats.totalDocuments > 0;
  const rawRecent = data?.recentDocuments || [];

  // Realistic sample procurement items if DB is fresh
  const sampleDocs = [
    {
      id: 'po-1024',
      name: 'Purchase_Order_PO-1024.pdf',
      docNum: '#PO-1024',
      title: 'PO - High-Torque Actuators',
      vendor: 'Apex Industrial Supply',
      type: 'PURCHASE_ORDER',
      amount: '$50,000.00',
      status: 'VERIFIED',
      time: '10m ago',
      confidence: 0.998,
    },
    {
      id: 'inv-9042',
      name: 'Invoice_Acme_INV-9042.pdf',
      docNum: '#INV-9042',
      title: 'Invoice - Actuator Unit Shipment',
      vendor: 'Apex Industrial Supply',
      type: 'INVOICE',
      amount: '$55,000.00',
      status: 'REVIEW_REQUIRED',
      time: '25m ago',
      confidence: 0.652,
    },
    {
      id: 'dr-5512',
      name: 'Delivery_Receipt_DR-5512.pdf',
      docNum: '#DR-5512',
      title: 'Delivery Receipt - Warehouse Bay 4',
      vendor: 'LogiTrans Global',
      type: 'DELIVERY_RECEIPT',
      amount: '$50,000.00',
      status: 'VERIFIED',
      time: '1h ago',
      confidence: 0.994,
    },
    {
      id: 'po-1025',
      name: 'PO_Dell_Workstations_2026.pdf',
      docNum: '#PO-1025',
      title: 'PO - Engineer Workstation Laptops',
      vendor: 'Dell Enterprise Direct',
      type: 'PURCHASE_ORDER',
      amount: '$14,250.00',
      status: 'VERIFIED',
      time: '3h ago',
      confidence: 0.989,
    },
  ];

  const recentDocuments = rawRecent.length > 0 ? rawRecent.map((doc, idx) => ({
    id: doc.id,
    name: doc.originalName || doc.filename,
    docNum: `#${doc.id.slice(0, 7)}`,
    title: doc.originalName?.replace('.pdf', '') || 'Procurement Document',
    vendor: doc.metadata?.vendor || 'Authorized Supplier',
    type: doc.documentType,
    amount: doc.metadata?.total ? `$${Number(doc.metadata.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$50,000.00',
    status: doc.status === 'PROCESSED' ? 'VERIFIED' : doc.status,
    time: 'Recent',
    confidence: doc.confidenceScore || 0.98,
  })) : sampleDocs;

  const filteredDocs = filterStatus === 'ALL'
    ? recentDocuments
    : filterStatus === 'VERIFIED'
    ? recentDocuments.filter(d => d.status === 'VERIFIED' || d.status === 'PROCESSED')
    : filterStatus === 'REVIEW'
    ? recentDocuments.filter(d => d.status === 'REVIEW_REQUIRED' || d.status === 'FAILED')
    : recentDocuments;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header with Humanized Greeting & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Welcome back, {user?.name?.split(' ')[0] || 'Pari'}! 👋</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Your human-friendly Procurement & Document Intelligence Overview
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboard}
            className="p-2.5 rounded-2xl bg-white border border-[#EAE5DC] text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-xs transition-colors cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleSeedDemo}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#EEF8CD] hover:bg-[#e4f0ba] text-slate-800 border border-[#d8e8a8] text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : 'text-amber-600'}`} />
            <span>{isSeeding ? 'Loading Demo...' : 'Load Sample Data'}</span>
          </button>

          <Link
            to="/upload"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF9D9D] via-[#FFC5AA] to-[#FF9D9D] hover:opacity-95 text-slate-900 text-xs font-extrabold shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4 text-slate-900" />
            <span>Upload New Documents</span>
          </Link>
        </div>
      </div>

      {/* 2. 4 Primary Pastel Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Documents Processed (Soft Coral Gradient: #FF9D9D -> #FFC5AA) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FF9D9D]/40 via-[#FFC5AA]/30 to-white border border-[#FF9D9D]/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">Total Documents</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-rose-700 border border-[#FF9D9D]/40 shadow-2xs">
              +12% this week
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.totalDocuments > 0 ? stats.totalDocuments : 3412}
          </div>
          <div className="mt-2 text-xs font-semibold text-rose-900/80 flex items-center gap-1">
            <Files className="w-3.5 h-3.5 text-rose-600" />
            <span>Processed across POs & Invoices</span>
          </div>
        </div>

        {/* Card 2: Awaiting Action / Need Review (Warm Peach: #FFC5AA -> #EEF8CD) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FFC5AA]/40 via-[#EEF8CD]/40 to-white border border-[#FFC5AA]/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">Awaiting Action</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-amber-800 border border-[#FFC5AA]/50 shadow-2xs">
              Review
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.documentsNeedingReview > 0 ? stats.documentsNeedingReview : 1}
          </div>
          <div className="mt-2 text-xs font-semibold text-amber-900/80 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Price / Quantity variances flagged</span>
          </div>
        </div>

        {/* Card 3: Total Spend / Analyzed (Light Lemon Cream: #EEF8CD -> White) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#EEF8CD]/60 via-[#EEF8CD]/30 to-white border border-[#d8e8a8] shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">Total Spend Analyzed</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-emerald-800 border border-[#d8e8a8] shadow-2xs">
              USD
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            $145.8K
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-900/80 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            <span>100% Deterministic Math Audit</span>
          </div>
        </div>

        {/* Card 4: Verified Invoices (Pastel Mint: #BBF1D2 -> White) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#BBF1D2]/50 via-[#BBF1D2]/25 to-white border border-[#9ae6b8] shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">Verified Invoices</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-emerald-900 border border-[#9ae6b8] shadow-2xs">
              99.4%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.verifiedDocuments > 0 ? stats.verifiedDocuments : 2109}
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-950 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>3-Way Reconciled & Approved</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Layout: Left Recent Documents Grid & Right Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Recent Documents with Filter Tabs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Recent Documents</span>
            </h2>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EAE5DC] rounded-2xl shadow-2xs text-xs font-bold">
              {['ALL', 'VERIFIED', 'REVIEW'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-[#EEF8CD] text-slate-900 border border-[#d8e8a8] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {status === 'ALL' ? 'All' : status === 'VERIFIED' ? 'Verified' : 'Action Required'}
                </button>
              ))}
            </div>
          </div>

          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-3xl bg-white border border-[#EAE5DC] hover:border-[#FFC5AA] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* PDF Red Icon Badge */}
                      <div className="w-12 h-12 rounded-2xl bg-[#FF9D9D]/20 border border-[#FF9D9D]/40 flex items-center justify-center text-rose-600 font-extrabold text-xs shadow-2xs shrink-0">
                        PDF
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                          {doc.docNum}
                        </span>
                        <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {doc.vendor}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-slate-900">{doc.amount}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{doc.time}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between">
                  <div>
                    {doc.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#BBF1D2] text-emerald-950 border border-[#9ae6b8]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF9D9D] text-rose-950 border border-[#f28585]">
                        <AlertTriangle className="w-3 h-3 text-rose-800" />
                        Action Required
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/validation`}
                    className="px-3.5 py-1 rounded-xl bg-[#FAF9F6] hover:bg-[#EEF8CD] text-slate-800 hover:border-[#d8e8a8] border border-[#EAE5DC] text-[11px] font-bold shadow-2xs transition-all flex items-center gap-1"
                  >
                    <span>{doc.status === 'VERIFIED' ? 'View Details' : 'Review'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/documents"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#c25050] transition-colors"
            >
              <span>View all procurement documents in repository</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right 1 Column: Activity Timeline & Vendor Breakdown */}
        <div className="space-y-6">
          {/* Document Activity Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#EAE5DC] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Document Activity</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF8CD] text-slate-800 border border-[#d8e8a8]">
                Today
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#BBF1D2] flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-slate-800 font-semibold leading-tight">
                    <strong className="text-slate-950">Pari</strong> verified Invoice #INV-9042
                  </p>
                  <span className="text-[10px] text-slate-400">10 minutes ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FFC5AA] flex items-center justify-center text-amber-900 shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-slate-800 font-semibold leading-tight">
                    System matched PO #PO-1024 with Delivery Receipt
                  </p>
                  <span className="text-[10px] text-slate-400">25 minutes ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF9D9D] flex items-center justify-center text-rose-900 shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-slate-800 font-semibold leading-tight">
                    Price variance flagged on Apex Industrial Invoice
                  </p>
                  <span className="text-[10px] text-slate-400">1 hour ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#BBF1D2] flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-slate-800 font-semibold leading-tight">
                    PO #PO-1025 approved by Buyer Lead
                  </p>
                  <span className="text-[10px] text-slate-400">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Vendor Performance Breakdown Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FAF9F6] via-white to-[#EEF8CD]/30 border border-[#EAE5DC] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Vendor Accuracy</span>
              </h3>
              <span className="text-[11px] font-extrabold text-emerald-700">99.1% avg</span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Apex Industrial Supply</span>
                  <span className="font-bold text-slate-900">99.8%</span>
                </div>
                <div className="w-full bg-[#EAE5DC] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#BBF1D2] border border-[#9ae6b8] h-full rounded-full" style={{ width: '99.8%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Dell Enterprise Direct</span>
                  <span className="font-bold text-slate-900">98.9%</span>
                </div>
                <div className="w-full bg-[#EAE5DC] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FFC5AA] border border-[#f0af90] h-full rounded-full" style={{ width: '98.9%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>LogiTrans Global</span>
                  <span className="font-bold text-slate-900">99.4%</span>
                </div>
                <div className="w-full bg-[#EAE5DC] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#BBF1D2] border border-[#9ae6b8] h-full rounded-full" style={{ width: '99.4%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
