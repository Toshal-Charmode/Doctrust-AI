import React from 'react';
import { FileQuestion, UploadCloud, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyState({
  title = 'No documents found',
  description = 'Upload your first invoice, purchase order, or delivery receipt to begin AI analysis.',
  actionText = 'Upload Documents',
  actionLink = '/upload',
  onAction,
  onSeedDemo,
  icon: Icon = FileQuestion,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-[#EAE5DC] bg-white/80 backdrop-blur-xl shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-[#FFC5AA]/25 border border-[#FFC5AA]/50 flex items-center justify-center text-[#e06d6d] mb-4 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-extrabold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed font-medium">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 font-extrabold text-xs shadow-sm border border-[#fca99d] transition-all duration-200 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-slate-900" />
            <span>{actionText}</span>
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 font-extrabold text-xs shadow-sm border border-[#fca99d] transition-all duration-200 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-slate-900" />
            <span>{actionText}</span>
          </button>
        )}

        {onSeedDemo && (
          <button
            onClick={onSeedDemo}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EEF8CD] hover:bg-[#e4f0bc] text-emerald-950 font-bold border border-[#d8e8a8] text-xs transition-all duration-200 cursor-pointer shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Load Demo Procurement Docs</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
