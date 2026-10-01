import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { demoApi } from '../../services/dashboardApi';
import {
  ShieldCheck,
  Zap,
  LogOut,
  Menu,
  X,
  FileCheck2,
  Sparkles,
  User,
  Search,
  Bell,
  HelpCircle,
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await demoApi.getStatus();
        if (res.success) {
          setSystemStatus(res.data);
        }
      } catch (err) {
        // quiet catch
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
    <header className="sticky top-0 z-40 w-full border-b border-[#F0EBE1] bg-white/90 backdrop-blur-xl shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Soft Warm Coral & Peach Gradient */}
        <div className="flex items-center gap-6">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF9D9D] via-[#FFC5AA] to-[#EEF8CD] p-[1.5px] shadow-sm group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <FileCheck2 className="w-4.5 h-4.5 text-[#e06d6d]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-800">
                  DocuTrust
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#EEF8CD] text-emerald-800 border border-[#d8e8a8]">
                  AI
                </span>
              </div>
            </div>
          </Link>

          {/* Search Bar for Documents & Vendors */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF9F6] border border-[#EAE5DC] rounded-full text-xs text-slate-500 w-72 focus-within:border-[#FFC5AA] focus-within:ring-2 focus-within:ring-[#FFC5AA]/20 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search documents or vendors..."
                className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder:text-slate-400 w-full"
              />
            </div>
          )}
        </div>

        {/* Center / Navigation Links */}
        {!isAuthenticated ? (
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <a href="#demo" className="hover:text-slate-900 transition-colors">
              Live Demo
            </a>
            <a href="#use-cases" className="hover:text-slate-900 transition-colors">
              Use Cases
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing Plans
            </a>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <Link to="/" className="hover:text-[#e06d6d] transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-slate-900 font-bold hover:text-[#e06d6d] transition-colors">
              Dashboard
            </Link>
            <Link to="/documents" className="hover:text-[#e06d6d] transition-colors">
              Documents
            </Link>
            <Link to="/upload" className="hover:text-[#e06d6d] transition-colors">
              Upload
            </Link>
            <Link to="/validation" className="hover:text-[#e06d6d] transition-colors">
              Validation
            </Link>
            <Link to="/settings" className="hover:text-[#e06d6d] transition-colors">
              Settings
            </Link>
          </div>
        )}

        {/* Right side user actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Notifications & Help Icons */}
              <button
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* Seed Demo Action Button */}
              <button
                onClick={handleSeedDemo}
                disabled={isDemoLoading}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF8CD] hover:bg-[#e4f0ba] text-slate-800 border border-[#d8e8a8] text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                title="Load realistic sample procurement documents"
              >
                <Zap className={`w-3.5 h-3.5 ${isDemoLoading ? 'animate-spin' : 'text-amber-500'}`} />
                <span>{isDemoLoading ? 'Loading...' : 'Sample Data'}</span>
              </button>

              {/* User Avatar with Warm Pastel Glow */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-[#F0EBE1]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF9D9D] to-[#FFC5AA] flex items-center justify-center text-xs font-bold text-slate-800 shadow-sm border border-white">
                  {user?.name?.[0]?.toUpperCase() || 'P'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Pari Gupta'}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Admin</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] hover:opacity-95 text-slate-900 text-xs font-bold shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#F0EBE1] bg-white px-4 py-4 space-y-3 text-xs">
          {!isAuthenticated ? (
            <div className="space-y-2 pb-2">
              <Link to="/" className="block py-1.5 text-slate-600 hover:text-slate-900 font-medium">
                Home
              </Link>
              <a href="#demo" className="block py-1.5 text-slate-600 hover:text-slate-900 font-medium">
                Live Demo
              </a>
              <a href="#pricing" className="block py-1.5 text-slate-600 hover:text-slate-900 font-medium">
                Pricing Plans
              </a>
              <div className="pt-2 flex gap-2">
                <Link to="/login" className="flex-1 py-2 text-center rounded-xl bg-[#FAF9F6] text-slate-700 font-semibold border border-[#EAE5DC]">
                  Sign In
                </Link>
                <Link to="/register" className="flex-1 py-2 text-center rounded-xl bg-gradient-to-r from-[#FF9D9D] to-[#FFC5AA] text-slate-900 font-bold">
                  Get Started
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/" className="block py-1.5 text-slate-700 font-semibold">
                Home
              </Link>
              <Link to="/dashboard" className="block py-1.5 text-slate-900 font-bold">
                Dashboard
              </Link>
              <Link to="/documents" className="block py-1.5 text-slate-700 font-semibold">
                Documents
              </Link>
              <Link to="/upload" className="block py-1.5 text-slate-700 font-semibold">
                Upload
              </Link>
              <Link to="/validation" className="block py-1.5 text-slate-700 font-semibold">
                Validation Center
              </Link>
              <Link to="/settings" className="block py-1.5 text-slate-700 font-semibold">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-1.5 text-rose-500 font-semibold flex items-center gap-2 pt-2 border-t border-[#F0EBE1]"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
