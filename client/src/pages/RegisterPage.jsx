import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck2,
  ArrowRight,
  Loader2,
  User,
  Mail,
  Lock,
  ScanFace,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import faceAuthApi from '../services/faceAuthApi';
import LiquidBackground from '../components/biometrics/LiquidBackground';
import FaceScannerUI from '../components/biometrics/FaceScannerUI';

export function RegisterPage() {
  const [step, setStep] = useState('form'); // 'form' | 'biometrics'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Biometrics onboarding state
  const [consentGiven, setConsentGiven] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      showToast('Account registered successfully!', 'success');
      // Advance to optional biometric enrollment onboarding
      setStep('biometrics');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceEnrollment = async (capturedImageBase64, callback) => {
    if (!consentGiven) {
      setErrorMsg('Please confirm your informed biometric consent before enrolling.');
      callback({ success: false, message: 'Consent is required.' });
      return;
    }

    try {
      setEnrolling(true);
      setErrorMsg('');

      const res = await faceAuthApi.enroll({
        image: capturedImageBase64,
        consent: consentGiven,
      });

      if (res.success) {
        setEnrollSuccess(true);
        callback({ success: true });
        showToast('Face recognized! Welcome to DocuTrust AI.', 'success');
        setTimeout(() => {
          navigate('/');
        }, 900);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Biometric enrollment failed. Please hold still.';
      setErrorMsg(msg);
      callback({ success: false, message: msg });
    } finally {
      setEnrolling(false);
    }
  };

  const handleSkipToDashboard = () => {
    showToast('Welcome to DocuTrust AI!', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#FAF9F6] px-4 sm:px-6 lg:px-8 py-12 selection:bg-[#FFC5AA]/40 selection:text-slate-900">
      {/* Warm Pastel Ambient Liquid Background */}
      <LiquidBackground variant="pastel" />

      {/* Brand logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center gap-1.5"
      >
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF9D9D] via-[#FFC5AA] to-[#EEF8CD] p-[1.5px] shadow-sm group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-[#e06d6d]" />
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            DocuTrust <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-[#EEF8CD] text-emerald-900 border border-[#d8e8a8]">AI</span>
          </span>
        </Link>
        <p className="text-xs text-slate-500 font-medium">
          {step === 'form' ? 'Create your account to automate procurement audits' : 'Optional Biometric Security Setup'}
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl border border-[#EAE5DC] p-6 sm:p-8 relative z-10"
      >
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.form
              key="reg-form"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] focus:border-[#FF9D9D] focus:ring-1 focus:ring-[#FF9D9D] text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@enterprise.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] focus:border-[#FF9D9D] focus:ring-1 focus:ring-[#FF9D9D] text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] focus:border-[#FF9D9D] focus:ring-1 focus:ring-[#FF9D9D] text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 font-bold text-xs tracking-wide shadow-sm border border-[#fca99d] transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-6 pt-5 border-t border-[#EAE5DC] text-center">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#e06d6d] hover:underline font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="biometrics-step"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="space-y-4"
            >
              <div className="text-center mb-3">
                <div className="w-11 h-11 rounded-2xl bg-[#EEF8CD] border border-[#d8e8a8] text-[#e06d6d] flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <ScanFace className="w-6 h-6 text-slate-800" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Set Up Face Login</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secure your account with an additional biometric verification step.
                </p>
              </div>

              <FaceScannerUI
                onVerificationSuccess={handleFaceEnrollment}
                isVerifying={enrolling}
                mode="enroll"
              />

              {/* Informed Consent */}
              <div className="pt-2 border-t border-[#EAE5DC]">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded border-[#EAE5DC] bg-white text-[#FF9D9D] focus:ring-[#FF9D9D] cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-800 font-semibold">Biometric Consent:</strong> I agree to enroll my face for fast authentication. My data will be encrypted (AES-256-GCM) and can be deleted at any time.
                  </span>
                </label>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSkipToDashboard}
                  className="w-full py-2.5 rounded-xl border border-[#EAE5DC] hover:bg-[#FAF9F6] text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all cursor-pointer"
                >
                  Skip for Now & Go to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
