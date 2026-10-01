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
    <header className="sticky top-0 z-40 w-full border-b border-slate-900 bg-[#08090d]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with AI Purple Glow */}
        <div className="flex items-center gap-3">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-500 p-[1px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#08090d] rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  DOCUTRUST
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium hidden sm:block">
                Turn documents into decisions
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Navigation Links for Public Pages */}
        {!isAuthenticated ? (
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#demo" className="hover:text-purple-300 transition-colors">
              Live Demo
            </a>
            <a href="#use-cases" className="hover:text-purple-300 transition-colors">
              Use Cases
            </a>
            <a href="#integrations" className="hover:text-purple-300 transition-colors">
              Integrations
            </a>
            <a href="#pricing" className="hover:text-purple-300 transition-colors">
              Pricing Plans
            </a>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-300">
            <Link to="/" className="hover:text-purple-300 transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-purple-300 transition-colors">
              Dashboard
            </Link>
            <Link to="/documents" className="hover:text-purple-300 transition-colors">
              Documents
            </Link>
            <Link to="/upload" className="hover:text-purple-300 transition-colors">
              Upload
            </Link>
            <Link to="/validation" className="hover:text-purple-300 transition-colors">
              Validation
            </Link>
            <Link to="/settings" className="hover:text-purple-300 transition-colors">
              Settings
            </Link>
          </div>
        )}

        {/* Right side navigation */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">{user?.name}</span>
                <span className="text-[11px] text-slate-400">{user?.email}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
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
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all duration-200"
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
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3 text-xs">
          {!isAuthenticated ? (
            <div className="space-y-2 pb-2">
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-purple-300 py-1"
              >
                Live Demo
              </a>
              <a
                href="#use-cases"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-purple-300 py-1"
              >
                Use Cases
              </a>
              <a
                href="#integrations"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-purple-300 py-1"
              >
                Integrations
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-purple-300 py-1"
              >
                Pricing Plans
              </a>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg bg-purple-600 text-white font-semibold"
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
                className="block text-slate-300 hover:text-white py-1"
              >
                Dashboard
              </Link>
              <Link
                to="/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1"
              >
                Documents
              </Link>
              <Link
                to="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1"
              >
                Upload Documents
              </Link>
              <Link
                to="/validation"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1"
              >
                Validation Center
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-1"
              >
                AI Knowledge Chat
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-rose-400 hover:text-rose-300 py-1 pt-2 border-t border-slate-800"
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
