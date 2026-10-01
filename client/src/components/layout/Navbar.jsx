import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { demoApi } from '../../services/dashboardApi';
import {
  FileText,
  Sparkles,
  Zap,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle,
  Menu,
  X,
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await demoApi.getStatus();
        if (res.success) {
          setSystemStatus(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch AI system status:', err.message);
      }
    }
    fetchStatus();
  }, []);

  const handleSeedDemo = async () => {
    if (!isAuthenticated) {
      navigate('/login?demo=true');
      return;
    }

    try {
      setIsDemoLoading(true);
      const res = await demoApi.seedDemo();
      showToast(res.message || 'Demo data loaded successfully!', 'success');
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to seed demo data', 'error');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  DOCUTRUST
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-cyan-500/20">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium hidden sm:block">
                Turn documents into decisions
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Gemini 2.5 Flash</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-medium">PostgreSQL</span>
          </div>

          <button
            onClick={handleSeedDemo}
            disabled={isDemoLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
            title="Load realistic sample procurement documents with 3-way match validation"
          >
            <Zap className={`w-3.5 h-3.5 ${isDemoLoading ? 'animate-spin' : 'text-amber-400'}`} />
            <span>{isDemoLoading ? 'Loading Demo...' : 'Load Demo Data'}</span>
          </button>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">{user?.name}</span>
                <span className="text-[11px] text-slate-400">{user?.email}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <button
            onClick={handleSeedDemo}
            disabled={isDemoLoading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Load Demo Data</span>
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-slate-300 hover:text-white py-1"
              >
                Dashboard
              </Link>
              <Link
                to="/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-slate-300 hover:text-white py-1"
              >
                Documents
              </Link>
              <Link
                to="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-slate-300 hover:text-white py-1"
              >
                Upload Documents
              </Link>
              <Link
                to="/validation"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-slate-300 hover:text-white py-1"
              >
                Validation Center
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-slate-300 hover:text-white py-1"
              >
                AI Knowledge Chat
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-rose-400 hover:text-rose-300 py-1"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-lg bg-blue-600 text-xs font-medium text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
