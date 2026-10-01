import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  Receipt,
  Truck,
  FileCheck,
} from 'lucide-react';

export function StatusBadge({ status }) {
  switch (status) {
    case 'PROCESSED':
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#BBF1D2] text-emerald-900 border border-[#9ae6b8] shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>PROCESSED</span>
        </span>
      );
    case 'REVIEW_REQUIRED':
    case 'CRITICAL_MISMATCH':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF9D9D]/40 text-rose-900 border border-[#FF9D9D] shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
          <span>REVIEW REQUIRED</span>
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF9D9D]/60 text-rose-950 border border-[#FF9D9D] shadow-xs">
          <XCircle className="w-3.5 h-3.5 text-rose-700" />
          <span>FAILED</span>
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFC5AA]/40 text-amber-900 border border-[#FFC5AA] animate-pulse">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>PROCESSING</span>
        </span>
      );
    case 'UPLOADED':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EEF8CD] text-slate-800 border border-[#d8e8a8]">
          <Clock className="w-3.5 h-3.5 text-slate-600" />
          <span>UPLOADED</span>
        </span>
      );
  }
}

export function DocumentTypeBadge({ type }) {
  switch (type) {
    case 'PURCHASE_ORDER':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#EEF8CD] text-slate-800 border border-[#d8e8a8]">
          <FileText className="w-3.5 h-3.5 text-emerald-800" />
          <span>Purchase Order</span>
        </span>
      );
    case 'INVOICE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#FFC5AA]/30 text-slate-800 border border-[#FFC5AA]/60">
          <Receipt className="w-3.5 h-3.5 text-amber-800" />
          <span>Commercial Invoice</span>
        </span>
      );
    case 'DELIVERY_RECEIPT':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#BBF1D2]/50 text-slate-800 border border-[#BBF1D2]">
          <Truck className="w-3.5 h-3.5 text-teal-800" />
          <span>Delivery Receipt</span>
        </span>
      );
    case 'QUOTATION':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#FF9D9D]/30 text-slate-800 border border-[#FF9D9D]/50">
          <FileCheck className="w-3.5 h-3.5 text-rose-800" />
          <span>Quotation</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>{type ? type.replace('_', ' ') : 'Document'}</span>
        </span>
      );
  }
}

export function ValidationStatusBadge({ status }) {
  switch (status) {
    case 'MATCH':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#BBF1D2] text-emerald-950 border border-[#8ce3ad] shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>MATCH VERIFIED</span>
        </span>
      );
    case 'CRITICAL_MISMATCH':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF9D9D] text-rose-950 border border-[#f28585] shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-800" />
          <span>CRITICAL VARIANCE</span>
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFC5AA] text-amber-950 border border-[#f0af90] shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
          <span>WARNING</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EEF8CD] text-slate-800 border border-[#d8e8a8]">
          <Clock className="w-3.5 h-3.5 text-slate-600" />
          <span>PENDING</span>
        </span>
      );
  }
}

export function SeverityBadge({ severity }) {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FF9D9D] text-rose-950 border border-[#f28585]">
          CRITICAL
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFC5AA] text-amber-950 border border-[#f0af90]">
          WARNING
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EEF8CD] text-slate-800 border border-[#d8e8a8]">
          INFO
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
