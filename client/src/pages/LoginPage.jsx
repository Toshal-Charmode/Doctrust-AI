import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  ScanFace,
  Zap,
  Loader2,
  KeyRound,
  Shield,
  User,
  Fingerprint,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import faceAuthApi from '../services/faceAuthApi';
import authApi from '../services/authApi';
import LiquidBackground from '../components/biometrics/LiquidBackground';
import FaceScannerUI from '../components/biometrics/FaceScannerUI';

export function LoginPage() {
  const [loginMethod, setLoginMethod] = useState('standard'); // 'standard' | 'face'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Biometric challenge state
  const [pendingChallenge, setPendingChallenge] = useState(null); // { challengeId, expiresAt, attemptsLeft }
  const [isVerifying, setIsVerifying] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [fallbackPassword, setFallbackPassword] = useState('');
  const [fallbackLoading, setFallbackLoading] = useState(false);

  const { login, isAuthenticated, setUserSession } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }

    const params = new URLSearchParams(location.search);
    if (params.get('demo') === 'true') {
      setEmail('admin@docutrust.ai');
      setPassword('Password123!');
    }
  }, [isAuthenticated, location, navigate]);

  // Handle initial credential submission
  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your work email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login({ email, password });

      if (res.requiresFaceAuth && res.data?.challengeId) {
        // Step 2: Transition to Face ID challenge
        setPendingChallenge(res.data);
        setLoginMethod('face');
        showToast('Password verified. Please verify your facial identity.', 'info');
      } else if (res.success && res.data?.token) {
        // Direct authenticated login
        localStorage.setItem('docutrust_token', res.data.token);
        localStorage.setItem('docutrust_user', JSON.stringify(res.data.user));
        if (setUserSession) {
          setUserSession(res.data.user, res.data.token);
        } else {
          window.location.href = '/dashboard';
        }
        showToast('Welcome back to DocuTrust AI!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle live biometric capture verification
  const handleFaceVerify = async (capturedImageBase64, callback) => {
    if (!pendingChallenge?.challengeId) {
      // If user directly clicked Face ID tab without entering credentials, prompt for email/challenge first
      try {
        setIsVerifying(true);
        if (!email) {
          setErrorMsg('Please enter your work email to initiate biometric matching.');
          setLoginMethod('standard');
          return;
        }

        const chalRes = await faceAuthApi.createChallenge({ email });
        if (chalRes.success) {
          setPendingChallenge(chalRes);
          // verify now
          const verifyRes = await faceAuthApi.verify({
            challengeId: chalRes.challengeId,
            image: capturedImageBase64,
          });

          if (verifyRes.verified && verifyRes.data?.token) {
            callback({ success: true, similarityScore: verifyRes.data.similarityScore });
            localStorage.setItem('docutrust_token', verifyRes.data.token);
            localStorage.setItem('docutrust_user', JSON.stringify(verifyRes.data.user));
            showToast('Biometric identity confirmed. Access granted.', 'success');
            setTimeout(() => navigate('/dashboard'), 1400);
          }
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Biometric verification failed.';
        setErrorMsg(msg);
        callback({ success: false, message: msg });
      } finally {
        setIsVerifying(false);
      }
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMsg('');

      const res = await faceAuthApi.verify({
        challengeId: pendingChallenge.challengeId,
        image: capturedImageBase64,
      });

      if (res.verified && res.data?.token) {
        callback({ success: true, similarityScore: res.data.similarityScore });
        localStorage.setItem('docutrust_token', res.data.token);
        localStorage.setItem('docutrust_user', JSON.stringify(res.data.user));
        showToast('Biometric identity confirmed! Access granted.', 'success');
        setTimeout(() => navigate('/dashboard'), 1400);
      } else {
        const remaining = res.attemptsLeft !== undefined ? res.attemptsLeft : pendingChallenge.attemptsLeft - 1;
        setPendingChallenge((prev) => ({ ...prev, attemptsLeft: remaining }));
        setErrorMsg(res.message || 'Face verification failed.');
        callback({ success: false, message: res.message });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Biometric verification failed.';
      const remaining = err.response?.data?.attemptsLeft !== undefined
        ? err.response?.data?.attemptsLeft
        : pendingChallenge?.attemptsLeft - 1;

      if (pendingChallenge) {
        setPendingChallenge((prev) => ({ ...prev, attemptsLeft: remaining }));
      }
      setErrorMsg(msg);
      callback({ success: false, message: msg });
    } finally {
      setIsVerifying(false);
    }
  };

  // Fallback authentication using password
  const handleFallbackSubmit = async (e) => {
    e.preventDefault();
    if (!fallbackPassword) return;

    try {
      setFallbackLoading(true);
      setErrorMsg('');

      const res = await faceAuthApi.fallback({
        challengeId: pendingChallenge.challengeId,
        password: fallbackPassword,
      });

      if (res.success && res.data?.token) {
        localStorage.setItem('docutrust_token', res.data.token);
        localStorage.setItem('docutrust_user', JSON.stringify(res.data.user));
        showToast('Authenticated via password fallback.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Fallback authentication failed.');
    } finally {
      setFallbackLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@docutrust.ai');
    setPassword('Password123!');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 px-4 py-12 selection:bg-cyan-500/20 selection:text-cyan-300">
      <LiquidBackground variant="dark" />

      {/* Header Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center gap-2"
      >
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" strokeWidth={2.4} />
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            DocTrust <span className="text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-lg text-xs ml-0.5 border border-cyan-500/30">AI</span>
          </span>
        </Link>
        <p className="text-xs text-slate-400">Intelligent Document Verification & Biometric Trust Vault</p>
      </motion.div>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.6)] border border-slate-800/90 overflow-hidden relative z-10"
      >
        {/* Toggle Header (Standard vs Face ID) */}
        <div className="flex p-1.5 bg-slate-950/80 backdrop-blur-md m-3 rounded-2xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('standard');
              setFallbackMode(false);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              loginMethod === 'standard' && !fallbackMode
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Standard Login
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('face')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              loginMethod === 'face'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <ScanFace className="w-3.5 h-3.5" /> Face ID
          </button>
        </div>

        {/* Content Area */}
        <div className="p-7 pt-4">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <span className="font-semibold">Notice:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Standard Flow */}
            {loginMethod === 'standard' && !fallbackMode && (
              <motion.div
                key="standard"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-5 text-center">
                  <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
                  <p className="text-xs text-slate-400">Enter your credentials to access the secure audit vault.</p>
                </div>

                {/* Quick Demo Fill Button */}
                <div className="mb-5 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-semibold text-cyan-300">Auditor Evaluation Mode</span>
                  </div>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    Auto-fill demo user
                  </button>
                </div>

                <form onSubmit={handleStandardLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 ml-1">Work Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@docutrust.ai"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <a href="#" className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300">Forgot?</a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> End-to-end encrypted
                  </div>
                  <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                    Create account
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Face ID Flow */}
            {loginMethod === 'face' && !fallbackMode && (
              <motion.div
                key="face"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-bold text-white mb-0.5">Biometric Identity Check</h2>
                  <p className="text-xs text-slate-400">Position your face inside the alignment frame to verify.</p>
                </div>

                {pendingChallenge && (
                  <div className="w-full mb-3 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-[11px]">
                    <span className="text-cyan-300 font-medium">Pending Challenge Active</span>
                    <span className="text-slate-400 font-mono">Attempts: {pendingChallenge.attemptsLeft || 3}</span>
                  </div>
                )}

                <FaceScannerUI
                  onVerificationSuccess={handleFaceVerify}
                  onUseFallback={() => setFallbackMode(true)}
                  isVerifying={isVerifying}
                  externalError={errorMsg}
                  attemptsLeft={pendingChallenge?.attemptsLeft ?? 3}
                  mode="verify"
                />

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500">
                  <Fingerprint className="w-3.5 h-3.5 text-cyan-400" /> AES-256-GCM encrypted biometric template
                </div>
              </motion.div>
            )}

            {/* Fallback Password Flow */}
            {fallbackMode && (
              <motion.div
                key="fallback"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Alternative Verification</h3>
                  <p className="text-xs text-slate-400">Enter your account password to bypass biometric face factor.</p>
                </div>

                <form onSubmit={handleFallbackSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 ml-1">Account Password</label>
                    <div className="relative mt-1">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={fallbackPassword}
                        onChange={(e) => setFallbackPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={fallbackLoading}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {fallbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Access Account</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFallbackMode(false)}
                    className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Back to Face ID Scan
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
