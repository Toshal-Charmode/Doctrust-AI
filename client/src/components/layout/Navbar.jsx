import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { demoApi } from '../../services/dashboardApi';
import {
  Sparkles,
  Zap,
  LogOut,
  ShieldCheck,
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
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE5DC] bg-white/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Warm Pastel Style */}
        <div className="flex items-center gap-3">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF9D9D] via-[#FFC5AA] to-[#EEF8CD] p-[1.5px] shadow-sm group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5 text-[#e06d6d]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  DOCUTRUST
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EEF8CD] text-emerald-950 border border-[#d8e8a8]">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wide font-medium hidden sm:block">
                Turn documents into decisions
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Navigation Links for Public Pages */}
        {!isAuthenticated ? (
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#demo" className="hover:text-slate-900 transition-colors">
              Live Demo
            </a>
            <a href="#use-cases" className="hover:text-slate-900 transition-colors">
              Use Cases
            </a>
            <a href="#integrations" className="hover:text-slate-900 transition-colors">
              Integrations
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing Plans
            </a>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-600">
            <Link to="/" className="hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-[#FAF9F6] transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-slate-900 font-bold px-2 py-1 rounded-lg bg-[#FFC5AA]/30 border border-[#FFC5AA]/50 transition-colors">
              Dashboard
            </Link>
            <Link to="/documents" className="hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-[#FAF9F6] transition-colors">
              Documents
            </Link>
            <Link to="/upload" className="hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-[#FAF9F6] transition-colors">
              Upload
            </Link>
            <Link to="/validation" className="hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-[#FAF9F6] transition-colors">
              Validation
            </Link>
            <Link to="/settings" className="hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-[#FAF9F6] transition-colors">
              Settings
            </Link>
          </div>
        )}

        {/* Right side navigation */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900">{user?.name}</span>
                <span className="text-[11px] text-slate-500 font-medium">{user?.email}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF9D9D] to-[#FFC5AA] flex items-center justify-center text-xs font-extrabold text-slate-900 shadow-sm border border-[#fca99d]">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 text-xs font-bold shadow-sm border border-[#fca99d] transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-[#FAF9F6] border border-[#EAE5DC]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EAE5DC] bg-white/95 backdrop-blur-xl px-4 py-4 space-y-3 text-xs">
          {!isAuthenticated ? (
            <div className="space-y-2 pb-2">
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-slate-900 py-1"
              >
                Live Demo
              </a>
              <a
                href="#use-cases"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-slate-900 py-1"
              >
                Use Cases
              </a>
              <a
                href="#integrations"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-slate-900 py-1"
              >
                Integrations
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-slate-900 py-1"
              >
                Pricing Plans
              </a>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EAE5DC]">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-slate-800 font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] text-slate-900 font-bold"
                >
                  Get Started
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-800 font-bold py-1"
              >
                Dashboard
              </Link>
              <Link
                to="/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-600 hover:text-slate-900 py-1"
              >
                Documents
              </Link>
              <Link
                to="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-600 hover:text-slate-900 py-1"
              >
                Upload Documents
              </Link>
              <Link
                to="/validation"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-600 hover:text-slate-900 py-1"
              >
                Validation Center
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-600 hover:text-slate-900 py-1"
              >
                AI Knowledge Chat
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-rose-600 hover:text-rose-700 py-1 pt-2 border-t border-[#EAE5DC] font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
