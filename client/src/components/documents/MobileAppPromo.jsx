import React from 'react';
import { motion } from 'framer-motion';
import {
  Apple,
  Star,
  Download,
  Smartphone,
  Tablet,
  CheckCircle2,
  Folder,
  FileText,
  Music,
  Cloud,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Play,
} from 'lucide-react';

export function MobileAppPromo() {
  return (
    <section id="app" className="py-24 sm:py-32 bg-[#0B0F19] text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide uppercase">
              <Apple className="w-3.5 h-3.5" />
              <span>Apple Design Award Winner</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              The must-have Documents iOS app
            </h2>

            {/* Rating & Downloads Stats Row */}
            <div className="flex flex-wrap items-center gap-6 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-extrabold text-white text-base">4.7</span>
                <span className="text-xs text-gray-400 font-medium">App Store rating</span>
              </div>

              <div className="h-4 w-[1px] bg-gray-800 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  ↓
                </div>
                <div>
                  <span className="font-extrabold text-white text-base block sm:inline">132M+</span>{' '}
                  <span className="text-xs text-gray-400 font-medium">Downloads worldwide</span>
                </div>
              </div>
            </div>

            {/* Descriptive Paragraph */}
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-normal">
              Your central file hub for iPhone and iPad. Open, read, annotate, edit PDFs, stream movies, listen to high-res music, and browse the web — all inside one seamless native application.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-gray-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Full Apple Pencil markup support</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Sync with iCloud, Drive & Dropbox</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Offline background media player</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Face ID & biometrics privacy lock</span>
              </div>
            </div>

            {/* App Store Buttons & QR Code */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#app"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white text-gray-950 hover:bg-gray-100 font-semibold text-xs shadow-lg shadow-white/5 transition-all hover:-translate-y-0.5"
              >
                <Apple className="w-6 h-6 fill-current" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-gray-500 leading-none">
                    Download on the
                  </div>
                  <div className="text-sm font-bold leading-tight">App Store</div>
                </div>
              </a>

              {/* QR Code Quick Scan Pill */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-900 border border-gray-800 text-xs text-gray-300">
                <QrCode className="w-7 h-7 text-blue-400 shrink-0" />
                <div className="text-left leading-tight">
                  <span className="font-semibold text-white block">Scan to Install</span>
                  <span className="text-[10px] text-gray-400">iOS 17+ or iPadOS</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating iPhone / iPad App UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex justify-center relative"
          >
            {/* Floating feature pills around device */}
            <div className="hidden sm:flex absolute -top-4 -left-4 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900/90 border border-gray-700/80 text-xs font-semibold text-white backdrop-blur-md shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>All files in one place</span>
            </div>

            <div className="hidden sm:flex absolute -bottom-4 -right-4 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900/90 border border-gray-700/80 text-xs font-semibold text-white backdrop-blur-md shadow-xl">
              <Music className="w-3.5 h-3.5 text-indigo-400" />
              <span>Offline media playback</span>
            </div>

            {/* Realistic iPhone Chassis Mockup */}
            <div className="w-[300px] sm:w-[330px] rounded-[48px] p-3.5 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-[0_0_60px_-15px_rgba(37,99,235,0.3)] border border-gray-700">
              <div className="w-full rounded-[40px] bg-gray-950 p-4 pt-3 overflow-hidden border border-gray-800 relative">
                {/* Dynamic Island Notch */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-end pr-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500/40 inline-block" />
                </div>

                {/* iPhone Status Header */}
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-1 mb-4">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <span className="w-4 h-2 rounded-sm border border-gray-400 flex items-center p-0.5">
                      <span className="w-full h-full bg-white rounded-2xs" />
                    </span>
                  </div>
                </div>

                {/* Documents App Internal UI */}
                <div className="space-y-4">
                  {/* App Appbar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                        My Files
                      </span>
                      <h4 className="text-base font-extrabold text-white">Documents</h4>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                      +
                    </div>
                  </div>

                  {/* App Folders Grid */}
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="p-3 rounded-2xl bg-gray-900 border border-gray-800 space-y-1">
                      <Folder className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                      <div className="text-xs font-bold text-white">Work Projects</div>
                      <div className="text-[10px] text-gray-500">24 files • 1.2 GB</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-900 border border-gray-800 space-y-1">
                      <Folder className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                      <div className="text-xs font-bold text-white">PDF Invoices</div>
                      <div className="text-[10px] text-gray-500">18 files • 42 MB</div>
                    </div>
                  </div>

                  {/* Recent Files List inside Mockup */}
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Recent Documents
                    </span>

                    <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        PDF
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-200 truncate">
                          Q3_Strategy_Deck.pdf
                        </div>
                        <div className="text-[10px] text-gray-500">Opened 12m ago • 8.4 MB</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        XLS
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-200 truncate">
                          Financial_Model_2026.xlsx
                        </div>
                        <div className="text-[10px] text-gray-500">Synced with iCloud</div>
                      </div>
                    </div>
                  </div>

                  {/* Built-in Audio / Media Player Bar */}
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Play className="w-3 h-3 fill-white" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white">Executive Audio Note</div>
                        <div className="text-[9px] text-blue-300">01:42 / 04:30</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-gray-400">FLAC</span>
                  </div>

                  {/* App Tab Bar */}
                  <div className="pt-2 border-t border-gray-800 flex items-center justify-around text-gray-500 text-[10px]">
                    <span className="text-blue-400 font-bold">Files</span>
                    <span>Recent</span>
                    <span>Transfer</span>
                    <span>Settings</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default MobileAppPromo;
