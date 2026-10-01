import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { demoApi } from '../services/dashboardApi';
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
} from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [systemStatus, setSystemStatus] = useState(null);
  const [threshold, setThreshold] = useState(0.75);
  const [savingKey, setSavingKey] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);

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
  }, []);

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
