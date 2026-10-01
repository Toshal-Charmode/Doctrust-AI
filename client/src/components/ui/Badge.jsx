import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  FileText,
  Receipt,
  Truck,
  FileCheck,
} from 'lucide-react';

export function StatusBadge({ status }) {
  switch (status) {
    case 'PROCESSED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>PROCESSED</span>
        </span>
      );
    case 'REVIEW_REQUIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>REVIEW REQUIRED</span>
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/25">
          <XCircle className="w-3.5 h-3.5" />
          <span>FAILED</span>
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/25 animate-pulse">
          <Clock className="w-3.5 h-3.5" />
          <span>PROCESSING</span>
        </span>
      );
    case 'UPLOADED':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25">
          <Clock className="w-3.5 h-3.5" />
          <span>UPLOADED</span>
        </span>
      );
  }
}

export function DocumentTypeBadge({ type }) {
  switch (type) {
    case 'PURCHASE_ORDER':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <FileText className="w-3 h-3" />
          <span>Purchase Order</span>
        </span>
      );
    case 'INVOICE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Receipt className="w-3 h-3" />
          <span>Invoice</span>
        </span>
      );
    case 'DELIVERY_RECEIPT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Truck className="w-3 h-3" />
          <span>Delivery Receipt</span>
        </span>
      );
    case 'QUOTATION':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <FileCheck className="w-3 h-3" />
          <span>Quotation</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
          <HelpCircle className="w-3 h-3" />
          <span>{type || 'Other'}</span>
        </span>
      );
  }
}

export function ValidationStatusBadge({ status }) {
  switch (status) {
    case 'MATCH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>MATCH</span>
        </span>
      );
    case 'MISMATCH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3.5 h-3.5" />
          <span>MISMATCH</span>
        </span>
      );
    case 'MISSING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>MISSING</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
          <span>N/A</span>
        </span>
      );
  }
}

export function SeverityBadge({ severity }) {
  switch (severity?.toUpperCase()) {
    case 'HIGH':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
          LOW
        </span>
      );
    default:
      return null;
  }
}

export default {
  StatusBadge,
  DocumentTypeBadge,
  ValidationStatusBadge,
  SeverityBadge,
};
