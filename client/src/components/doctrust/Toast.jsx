import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xl shadow-blue-500/10 ring-1 ring-black/5 backdrop-blur-xl">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-blue-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5">
                <h5 className="text-xs font-bold text-[#111827]">
                  {toast.title || 'DocTrust AI Notification'}
                </h5>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-600">
                  {toast.tag || 'AI Verified'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed font-normal">
                {toast.message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;
