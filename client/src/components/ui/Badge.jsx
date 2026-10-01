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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#BBF1D2] text-emerald-950 border border-[#9ae6b8]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
          <span>PROCESSED</span>
        </span>
      );
    case 'REVIEW_REQUIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EEF8CD] text-amber-950 border border-[#d8e8a8]">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
          <span>REVIEW REQUIRED</span>
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF9D9D]/30 text-rose-950 border border-[#FF9D9D]">
          <XCircle className="w-3.5 h-3.5 text-rose-700" />
          <span>FAILED</span>
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFC5AA]/40 text-orange-950 border border-[#FFC5AA] animate-pulse">
          <Clock className="w-3.5 h-3.5 text-orange-800" />
          <span>PROCESSING</span>
        </span>
      );
    case 'UPLOADED':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF9F6] text-slate-800 border border-[#EAE5DC]">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>UPLOADED</span>
        </span>
      );
  }
}

export function DocumentTypeBadge({ type }) {
  switch (type) {
    case 'PURCHASE_ORDER':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FFC5AA]/30 text-slate-800 border border-[#FFC5AA]">
          <FileText className="w-3 h-3 text-[#e06d6d]" />
          <span>Purchase Order</span>
        </span>
      );
    case 'INVOICE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EEF8CD] text-emerald-950 border border-[#d8e8a8]">
          <Receipt className="w-3 h-3 text-emerald-800" />
          <span>Invoice</span>
        </span>
      );
    case 'DELIVERY_RECEIPT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#BBF1D2] text-emerald-950 border border-[#9ae6b8]">
          <Truck className="w-3 h-3 text-emerald-800" />
          <span>Delivery Receipt</span>
        </span>
      );
    case 'QUOTATION':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FF9D9D]/25 text-rose-950 border border-[#FF9D9D]">
          <FileCheck className="w-3 h-3 text-rose-700" />
          <span>Quotation</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-[#EAE5DC]">
          <HelpCircle className="w-3 h-3 text-slate-400" />
          <span>{type || 'Other'}</span>
        </span>
      );
  }
}

export function ValidationStatusBadge({ status }) {
  switch (status) {
    case 'MATCH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#BBF1D2] text-emerald-950 border border-[#9ae6b8]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
          <span>MATCH</span>
        </span>
      );
    case 'MISMATCH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF9D9D]/30 text-rose-950 border border-[#FF9D9D]">
          <XCircle className="w-3.5 h-3.5 text-rose-700" />
          <span>MISMATCH</span>
        </span>
      );
    case 'MISSING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF8CD] text-amber-950 border border-[#d8e8a8]">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
          <span>MISSING</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF9F6] text-slate-500 border border-[#EAE5DC]">
          <span>N/A</span>
        </span>
      );
  }
}

export function SeverityBadge({ severity }) {
  switch (severity?.toUpperCase()) {
    case 'HIGH':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-[#FF9D9D]/30 text-rose-950 border border-[#FF9D9D]">
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-[#EEF8CD] text-amber-950 border border-[#d8e8a8]">
          MEDIUM
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-[#BBF1D2] text-emerald-950 border border-[#9ae6b8]">
          LOW
        </span>
      );
  }
}

export default {
  StatusBadge,
  DocumentTypeBadge,
  ValidationStatusBadge,
  SeverityBadge,
};
