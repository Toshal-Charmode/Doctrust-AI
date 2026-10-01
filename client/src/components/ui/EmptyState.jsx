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
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 backdrop-blur-sm">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center text-cyan-400 mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs shadow-md shadow-blue-600/20 transition-all duration-200"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{actionText}</span>
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs shadow-md shadow-blue-600/20 transition-all duration-200"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        )}

        {onSeedDemo && (
          <button
            onClick={onSeedDemo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/20 font-medium text-xs transition-all duration-200"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Demo Procurement Docs</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
