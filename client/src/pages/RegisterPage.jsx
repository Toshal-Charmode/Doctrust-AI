import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  User,
  Mail,
  Lock,
  ScanFace,
  Fingerprint,
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
        showToast('Face login successfully enabled for your account!', 'success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
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
    showToast('You can set up Face Login at any time in Profile Settings.', 'info');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative selection:bg-cyan-500/20 selection:text-cyan-300">
      <LiquidBackground variant="dark" />

      {/* Brand logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">DOCUTRUST AI</span>
        </Link>
        <p className="text-xs text-slate-400">
          {step === 'form' ? 'Create your account to automate procurement audits' : 'Optional Biometric Security Setup'}
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10"
      >
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
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
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@enterprise.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-cyan-500/20 transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
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
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                  <ScanFace className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Set Up Face Login</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Secure your account with an additional face verification step.
                </p>
              </div>

              <FaceScannerUI
                onVerificationSuccess={handleFaceEnrollment}
                isVerifying={enrolling}
                mode="enroll"
              />

              {/* Informed Consent */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    <strong className="text-slate-200 font-semibold">Biometric Consent:</strong> I agree to enroll my face for fast authentication. My data will be encrypted (AES-256-GCM) and can be deleted at any time.
                  </span>
                </label>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSkipToDashboard}
                  className="w-full py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
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
