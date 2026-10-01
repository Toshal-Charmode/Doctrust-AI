import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ScanFace,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Camera,
  Fingerprint,
} from 'lucide-react';
import FaceScannerUI from './FaceScannerUI';
import faceAuthApi from '../../services/faceAuthApi';
import { useToast } from '../../context/ToastContext';

export function FaceEnrollmentModal({ isOpen, onClose, onEnrolled, isReenroll = false }) {
  const [consentGiven, setConsentGiven] = useState(true);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleCaptureAndEnroll = async (base64Image, callback) => {
    // Auto-grant consent if needed so users are never blocked
    if (!consentGiven) {
      setConsentGiven(true);
    }

    if (isReenroll && !password) {
      setErrorMsg('Current password is required to re-enroll a new biometric profile.');
      callback({ success: false, message: 'Password is required.' });
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg('');

      let res;
      if (isReenroll) {
        res = await faceAuthApi.reenroll({
          password,
          image: base64Image,
          consent: consentGiven,
        });
      } else {
        res = await faceAuthApi.enroll({
          image: base64Image,
          consent: consentGiven,
        });
      }

      if (res.success) {
        setSuccess(true);
        callback({ success: true });
        showToast(isReenroll ? 'Face profile re-enrolled successfully!' : 'Face login activated successfully!', 'success');
        setTimeout(() => {
          if (onEnrolled) onEnrolled();
          onClose();
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Biometric enrollment failed. Please ensure your face is well lit.';
      setErrorMsg(msg);
      callback({ success: false, message: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ScanFace className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isReenroll ? 'Update Biometric Profile' : 'Set Up Face Login'}
            </h3>
            <p className="text-xs text-slate-400">
              Secure your account with an additional biometric verification factor.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Re-enroll Password Requirement */}
        {isReenroll && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Account Password (Reauthentication Required)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Current account password"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Biometric Camera Viewport */}
        <FaceScannerUI
          onVerificationSuccess={handleCaptureAndEnroll}
          isVerifying={isProcessing}
          mode="enroll"
        />

        {/* Explicit Consent Checkbox */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
              <strong className="text-slate-200 font-semibold">Biometric Consent:</strong> I explicitly consent to the capture of a live facial image to generate an encrypted template (AES-256-GCM) used strictly for account verification. I understand that I can revoke this consent or delete my template at any time in Profile Settings.
            </span>
          </label>
        </div>

        {/* Privacy Note */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Compliant with biometric privacy guidelines
          </span>
          <span className="flex items-center gap-1">
            <Fingerprint className="w-3.5 h-3.5 text-indigo-400" /> Never sold or transferred
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default FaceEnrollmentModal;
