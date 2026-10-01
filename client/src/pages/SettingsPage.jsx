import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { demoApi } from '../services/dashboardApi';
import faceAuthApi from '../services/faceAuthApi';
import FaceEnrollmentModal from '../components/biometrics/FaceEnrollmentModal';
import {
  Settings,
  Key,
  ShieldCheck,
  User,
  Sliders,
  Database,
  Trash2,
  Zap,
  Save,
  CheckCircle2,
  Cpu,
  ScanFace,
  Lock,
  RefreshCw,
  AlertTriangle,
  Fingerprint,
  ShieldAlert,
} from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [systemStatus, setSystemStatus] = useState(null);
  const [threshold, setThreshold] = useState(0.75);
  const [savingKey, setSavingKey] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);

  // Biometric Face Auth state
  const [faceStatus, setFaceStatus] = useState(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [isReenroll, setIsReenroll] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDisablePrompt, setShowDisablePrompt] = useState(false);
  const [showRevokePrompt, setShowRevokePrompt] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadFaceStatus = async () => {
    try {
      const res = await faceAuthApi.getStatus();
      if (res.success) {
        setFaceStatus(res.data);
      }
    } catch (err) {
      console.warn('Failed to load biometric status:', err.message);
    }
  };

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await demoApi.getStatus();
        if (res.success) {
          setSystemStatus(res.data);
          if (res.data.confidenceThreshold) {
            setThreshold(res.data.confidenceThreshold);
          }
        }
      } catch (err) {
        console.warn('Failed to load system status:', err.message);
      }
    }
    loadStatus();
    loadFaceStatus();
  }, []);

  const handleDisableFace = async (e) => {
    e.preventDefault();
    if (!confirmPassword) return;

    try {
      setActionLoading(true);
      const res = await faceAuthApi.disable({ password: confirmPassword });
      if (res.success) {
        showToast('Face authentication disabled successfully.', 'success');
        setShowDisablePrompt(false);
        setConfirmPassword('');
        loadFaceStatus();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to disable face authentication', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeConsent = async (e) => {
    e.preventDefault();
    if (!confirmPassword) return;

    try {
      setActionLoading(true);
      const res = await faceAuthApi.revokeConsent({ password: confirmPassword });
      if (res.success) {
        showToast('Biometric consent revoked and facial templates permanently purged.', 'success');
        setShowRevokePrompt(false);
        setConfirmPassword('');
        loadFaceStatus();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to revoke biometric consent', 'error');
    } finally {
      setActionLoading(false);
    }
  };


  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      showToast('Please enter a valid Gemini API key.', 'warning');
      return;
    }

    try {
      setSavingKey(true);
      const res = await demoApi.updateApiKey(apiKey.trim());
      showToast('Gemini API key updated for current session!', 'success');
      setApiKey('');
      // Refresh status
      const updated = await demoApi.getStatus();
      if (updated.success) setSystemStatus(updated.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update API key', 'error');
    } finally {
      setSavingKey(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      setSeedingDemo(true);
      const res = await demoApi.seedDemo();
      showToast('Sample procurement documents seeded successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to seed sample documents', 'error');
    } finally {
      setSeedingDemo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>Platform Settings & AI Configuration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your account profile, Gemini API connection, confidence thresholds, and demo data.
        </p>
      </div>

      {/* Account Profile Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          <span>User Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Name</span>
            <span className="font-semibold text-slate-200">{user?.name}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Work Email</span>
            <span className="font-semibold text-slate-200">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Role / Permissions</span>
            <span className="font-semibold text-cyan-400 capitalize">{user?.role || 'Procurement Auditor'}</span>
          </div>
        </div>
      </div>

      {/* Biometric Face Authentication Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ScanFace className="w-4 h-4 text-cyan-400" />
              <span>AI Face Recognition & Biometric Login</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure your account with an AI-powered face verification challenge during login.
            </p>
          </div>

          <div>
            {faceStatus?.isEnrolled ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Face ID Active</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 font-semibold text-xs border border-slate-700">
                Not Enrolled
              </span>
            )}
          </div>
        </div>

        {/* Status Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Face Auth Status</span>
            <span className={`font-semibold ${faceStatus?.isEnrolled ? 'text-emerald-400' : 'text-slate-300'}`}>
              {faceStatus?.isEnrolled ? 'Enabled (Required on Login)' : 'Disabled / Standby'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Enrollment Date</span>
            <span className="font-semibold text-slate-200">
              {faceStatus?.enrolledAt ? new Date(faceStatus.enrolledAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Last Biometric Auth</span>
            <span className="font-semibold text-cyan-400">
              {faceStatus?.lastAuthAt ? new Date(faceStatus.lastAuthAt).toLocaleString() : 'No recent login'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {faceStatus?.isEnrolled ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsReenroll(true);
                  setEnrollModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Re-enroll Face Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDisablePrompt(true)}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Disable Face Login</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRevokePrompt(true)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Revoke Consent & Purge Templates</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsReenroll(false);
                setEnrollModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ScanFace className="w-4 h-4" />
              <span>Set Up Face Login</span>
            </button>
          )}
        </div>

        {/* Biometric Privacy & Architecture Notice */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
          <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-300 font-semibold">Biometric Privacy Commitment:</strong> DocTrust AI processes facial images using client-edge video capture and our server-side OpenCV computer vision engine. Raw facial photos are discarded immediately after feature extraction; only a 128-dimensional mathematical vector encrypted with AES-256-GCM is retained. Biometric verification is used strictly for authentication continuity and may be disabled or purged at any time.
          </div>
        </div>

        {/* Disable Confirmation Prompt */}
        {showDisablePrompt && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Confirm Disabling Face Authentication</span>
            </div>
            <p className="text-slate-400">
              Please enter your account password to confirm disabling face authentication. You will be able to log in with your password only.
            </p>
            <form onSubmit={handleDisableFace} className="flex gap-2">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Account password"
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? 'Disabling...' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDisablePrompt(false);
                  setConfirmPassword('');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Revoke Consent Prompt */}
        {showRevokePrompt && (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Permanently Revoke Biometric Consent & Purge Templates</span>
            </div>
            <p className="text-slate-400">
              This will permanently delete your encrypted facial templates and biometric audit associations from our database. To re-enable, you will need to re-enroll with fresh consent.
            </p>
            <form onSubmit={handleRevokeConsent} className="flex gap-2">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? 'Purging...' : 'Permanently Delete'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRevokePrompt(false);
                  setConfirmPassword('');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Face Enrollment Modal */}
      <FaceEnrollmentModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        onEnrolled={() => {
          loadFaceStatus();
          setEnrollModalOpen(false);
        }}
        isReenroll={isReenroll}
      />


      {/* Gemini AI Configuration Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Google Gemini AI Integration</span>
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Current Status:</span>
            {systemStatus?.geminiConfigured ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Connected (Gemini 2.5 Flash)</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30">
                Fallback / Demo Mode Active
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          DocuTrust AI uses the official Google <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-400 font-mono">@google/genai</code> SDK on the backend. The API key is never exposed to client-side code.
        </p>

        <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-300">
            Set or Update Gemini API Key (Backend Session)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 outline-none transition-all font-mono"
            />
            <button
              type="submit"
              disabled={savingKey || !apiKey.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey ? 'Saving...' : 'Update Key'}</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-500 block">
            Tip: You can also specify <code className="text-slate-400">GEMINI_API_KEY</code> in your <code className="text-slate-400">server/.env</code> file.
          </span>
        </form>
      </div>

      {/* Extraction & Confidence Rules */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Extraction Confidence Threshold</span>
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          Documents with AI extraction confidence below this threshold will automatically be flagged with status <span className="font-semibold text-amber-400 font-mono">REVIEW_REQUIRED</span> for manual supervisor inspection.
        </p>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono font-semibold">
            <span className="text-slate-400">Confidence Threshold:</span>
            <span className="text-cyan-400 font-bold">{Math.round(threshold * 100)}%</span>
          </div>

          <input
            type="range"
            min="0.50"
            max="0.95"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500">
            <span>50% (Permissive)</span>
            <span>75% (Recommended Default)</span>
            <span>95% (Strict Enterprise)</span>
          </div>
        </div>
      </div>

      {/* Demo Data & Workspace Management */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Sample Procurement Dataset</span>
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          Load a pre-configured procurement package including Purchase Order PO-1024, Invoice INV-9042 (with quantity discrepancy), Delivery Receipt DR-5512, and Quotation Q-4401 for instant evaluation.
        </p>

        <div className="pt-2">
          <button
            onClick={handleSeedDemo}
            disabled={seedingDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <Zap className={`w-4 h-4 ${seedingDemo ? 'animate-spin' : 'text-amber-400'}`} />
            <span>{seedingDemo ? 'Seeding Dataset...' : 'Seed Sample Procurement Documents'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
