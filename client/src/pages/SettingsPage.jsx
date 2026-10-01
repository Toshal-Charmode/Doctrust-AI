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
    try {
      setActionLoading(true);
      const res = await faceAuthApi.disable({ password: confirmPassword });
      if (res.success) {
        showToast(res.message || 'Face login disabled', 'success');
        setShowDisablePrompt(false);
        setConfirmPassword('');
        loadFaceStatus();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to disable face login', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeConsent = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await faceAuthApi.revokeConsent({ password: confirmPassword });
      if (res.success) {
        showToast('Biometric templates purged and consent revoked.', 'success');
        setShowRevokePrompt(false);
        setConfirmPassword('');
        loadFaceStatus();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to revoke consent', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    try {
      setSavingKey(true);
      const res = await demoApi.updateApiKey(apiKey.trim());
      if (res.success) {
        showToast('Gemini API key updated for the active server session!', 'success');
        setApiKey('');
        const statusRes = await demoApi.getStatus();
        if (statusRes.success) setSystemStatus(statusRes.data);
      }
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
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#c25050]" />
          <span>Platform Settings & AI Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage your account profile, Gemini API connection, confidence thresholds, and demo data.
        </p>
      </div>

      {/* Account Profile Card */}
      <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-[#c25050]" />
          <span>User Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC]">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Name</span>
            <span className="font-bold text-slate-800">{user?.name || 'Pari Gupta'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC]">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Work Email</span>
            <span className="font-bold text-slate-800">{user?.email || 'admin@docutrust.ai'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC]">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Role / Permissions</span>
            <span className="font-bold text-[#c25050] capitalize">{user?.role || 'Procurement Auditor'}</span>
          </div>
        </div>
      </div>

      {/* Biometric Face Authentication Card */}
      <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ScanFace className="w-4 h-4 text-[#c25050]" />
              <span>AI Face Recognition & Biometric Login</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Secure your account with an AI-powered face verification challenge during login.
            </p>
          </div>

          <div>
            {faceStatus?.enrolled ? (
              <span className="px-3 py-1 rounded-full bg-[#BBF1D2] text-emerald-950 font-bold text-xs border border-[#9ae6b8] flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Face ID Active</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs border border-slate-200">
                Not Enrolled
              </span>
            )}
          </div>
        </div>

        {/* Status Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC]">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Face Auth Status</span>
            <span className={`font-bold ${faceStatus?.enrolled ? 'text-emerald-800' : 'text-slate-700'}`}>
              {faceStatus?.enrolled ? 'Enabled (Universal Pass Active)' : 'Disabled / Standby'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC]">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Enrollment Date</span>
            <span className="font-bold text-slate-800">
              {faceStatus?.enrollmentDate ? new Date(faceStatus.enrollmentDate).toLocaleDateString() : 'Active'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC]">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Anti-Spoofing</span>
            <span className="font-bold text-emerald-800">
              Active (SFace + YuNet)
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              setIsReenroll(true);
              setEnrollModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <ScanFace className="w-4 h-4" />
            <span>Set Up / Update Face Login</span>
          </button>
        </div>

        {/* Biometric Privacy Notice */}
        <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC] text-[11px] text-slate-600 leading-relaxed flex items-start gap-2.5">
          <Fingerprint className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 font-bold">Biometric Privacy Commitment:</strong> DocTrust AI processes facial images using client-edge video capture and our server-side OpenCV computer vision engine. Raw facial photos are discarded immediately after feature extraction; only a 128-dimensional mathematical vector encrypted with AES-256-GCM is retained.
          </div>
        </div>
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
      <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-[#c25050]" />
            <span>Google Gemini AI Integration</span>
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Current Status:</span>
            {systemStatus?.geminiConfigured ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#BBF1D2] text-emerald-950 font-bold border border-[#9ae6b8] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>Connected (Gemini 2.5 Flash)</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-[#EEF8CD] text-slate-800 font-bold border border-[#d8e8a8]">
                Deterministic Engine Active
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          DocuTrust AI uses the official Google <code className="bg-[#FAF9F6] px-1.5 py-0.5 rounded-md text-[#c25050] font-mono font-semibold border border-[#EAE5DC]">@google/genai</code> SDK on the backend. The API key is never exposed to client-side code.
        </p>

        <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-700">
            Set or Update Gemini API Key (Backend Session)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3.5 py-2 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC] focus:border-[#FFC5AA] text-xs text-slate-800 outline-none transition-all font-mono"
            />
            <button
              type="submit"
              disabled={savingKey || !apiKey.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey ? 'Saving...' : 'Update Key'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Extraction & Confidence Rules */}
      <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#c25050]" />
          <span>Extraction Confidence Threshold</span>
        </h2>

        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Documents with AI extraction confidence below this threshold will automatically be flagged with status <span className="font-bold text-amber-800 font-mono">REVIEW_REQUIRED</span> for supervisor inspection.
        </p>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-slate-500">Confidence Threshold:</span>
            <span className="text-[#c25050]">{Math.round(threshold * 100)}%</span>
          </div>

          <input
            type="range"
            min="0.50"
            max="0.95"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#EAE5DC] rounded-lg appearance-none cursor-pointer accent-[#FF9D9D]"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>50% (Permissive)</span>
            <span>75% (Recommended Default)</span>
            <span>95% (Strict Enterprise)</span>
          </div>
        </div>
      </div>

      {/* Demo Data & Workspace Management */}
      <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#c25050]" />
          <span>Sample Procurement Dataset</span>
        </h2>

        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Load a pre-configured procurement package including Purchase Order PO-1024, Invoice INV-9042 (with variance), Delivery Receipt DR-5512, and Quotation Q-4401 for instant evaluation.
        </p>

        <div className="pt-2">
          <button
            onClick={handleSeedDemo}
            disabled={seedingDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#EEF8CD] hover:bg-[#e4f0ba] text-slate-800 border border-[#d8e8a8] font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Zap className={`w-4 h-4 ${seedingDemo ? 'animate-spin' : 'text-amber-600'}`} />
            <span>{seedingDemo ? 'Seeding Dataset...' : 'Seed Sample Procurement Documents'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
