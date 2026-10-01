import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowDownUp,
  Minimize2,
  Share2,
  FileText,
  CheckCircle2,
  Sparkles,
  Zap,
  Sliders,
  Layers,
  Laptop,
  Smartphone,
  Tablet,
  HardDrive,
  Download,
  Check,
  RefreshCw,
} from 'lucide-react';

export function FeaturesShowcase() {
  // Feature 1 Converter State
  const [selectedFormat, setSelectedFormat] = useState('Word to PDF');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionDone, setConversionDone] = useState(true);

  // Feature 2 Compressor State
  const [compressionMode, setCompressionMode] = useState('recommended'); // 'extreme' | 'recommended' | 'low'
  const compressionStats = {
    extreme: { original: '45.0 MB', compressed: '4.5 MB', ratio: '-90%', quality: 'Standard (Ideal for Email)' },
    recommended: { original: '45.0 MB', compressed: '8.2 MB', ratio: '-82%', quality: 'High (Best balance)' },
    low: { original: '45.0 MB', compressed: '18.0 MB', ratio: '-60%', quality: 'Maximum (Studio Quality)' },
  };

  // Feature 3 Transfer State
  const [transferring, setTransferring] = useState(false);
  const [transferProgress, setTransferProgress] = useState(100);

  const triggerTransfer = () => {
    setTransferring(true);
    setTransferProgress(0);
    const interval = setInterval(() => {
      setTransferProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTransferring(false);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  return (
    <div className="space-y-0">
      {/* ======================================================== */}
      {/* 1. FILE CONVERTER (Split Layout: Text Left, Mockup Right) */}
      {/* ======================================================== */}
      <section id="converter" className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Column (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase">
                <ArrowDownUp className="w-3.5 h-3.5 text-blue-600" />
                <span>File Converter</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Easily convert your content to and from PDF
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                Transform documents, spreadsheets, presentations, and images without sacrificing formatting, fonts, or structural integrity. Effortlessly convert in both directions in under a second.
              </p>

              {/* Bullet Features */}
              <div className="space-y-3 pt-2">
                {[
                  'Preserve complex tables, graphics, and vector fonts flawlessly',
                  'Bidirectional conversion: Word, Excel, PowerPoint, JPG, PNG & ePub',
                  'Batch conversion of up to 50 documents simultaneously',
                  'Integrated OCR recognizes scanned text in 48+ languages',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <span>Convert Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* UI Mockup Column (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6"
            >
              <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                {/* Accent top gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Conversion Engine
                    </span>
                    <span className="text-base font-bold text-[#111827]">
                      Select Format & Convert
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                    Fast Engine 4.0
                  </span>
                </div>

                {/* Conversion pills selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  {['Word to PDF', 'PDF to Word', 'Excel to PDF', 'JPG to PDF'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                        selectedFormat === fmt
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                {/* Active conversion file box */}
                <div className="p-5 rounded-2xl bg-[#F9FAFB] border border-gray-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center">
                        DOC
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111827]">
                          Business_Proposal_2026.docx
                        </div>
                        <div className="text-xs text-gray-500">8.4 MB • Microsoft Word Document</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center">
                      PDF
                    </div>
                  </div>

                  {/* Conversion result status */}
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Converted with 100% vector font match</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600">0.6s</span>
                  </div>
                </div>

                {/* Simulated Download button */}
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    to="/upload"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Converted PDF</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsConverting(true);
                      setTimeout(() => setIsConverting(false), 600);
                    }}
                    className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600"
                    title="Retry Conversion"
                  >
                    <RefreshCw className={`w-4 h-4 ${isConverting ? 'animate-spin text-blue-600' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. FILE COMPRESSOR (Reversed Layout: Mockup Left, Text Right) */}
      {/* ======================================================== */}
      <section id="compressor" className="py-20 sm:py-28 bg-[#F9FAFB] border-t border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* UI Mockup Column (Left - Reversed) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 order-2 lg:order-1"
            >
              <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/60 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Compressor Engine
                    </span>
                    <span className="text-base font-bold text-[#111827]">
                      Reduce File Weight
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    {compressionStats[compressionMode].ratio} Reduced
                  </span>
                </div>

                {/* Compression Level Selector Tabs */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-semibold text-gray-500 block">
                    Choose Compression Preset:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'extreme', name: 'Extreme', discount: '-90%' },
                      { id: 'recommended', name: 'Recommended', discount: '-82%' },
                      { id: 'low', name: 'High Quality', discount: '-60%' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setCompressionMode(mode.id)}
                        className={`p-3 rounded-xl text-center border transition-all ${
                          compressionMode === mode.id
                            ? 'bg-blue-50/70 border-blue-500 text-blue-700 shadow-xs'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{mode.name}</div>
                        <div className="text-[11px] font-semibold text-emerald-600">
                          {mode.discount}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Before / After visual bar */}
                <div className="p-5 rounded-2xl bg-[#F9FAFB] border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Original Size: {compressionStats[compressionMode].original}</span>
                    <span className="text-blue-600">
                      New Size: {compressionStats[compressionMode].compressed}
                    </span>
                  </div>

                  {/* Size comparison progress bar */}
                  <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden p-0.5 flex">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                      style={{
                        width:
                          compressionMode === 'extreme'
                            ? '10%'
                            : compressionMode === 'recommended'
                            ? '18%'
                            : '40%',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>Quality profile: {compressionStats[compressionMode].quality}</span>
                    <span className="font-semibold text-emerald-600">Email attachment ready</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-6">
                  <Link
                    to="/upload"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all"
                  >
                    <Minimize2 className="w-4 h-4" />
                    <span>Compress Document Now</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Text Column (Right - Reversed) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6 order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide uppercase">
                <Minimize2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>File Compressor</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Quickly reduce the size of your PDFs, images, audio, and videos
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                Shrink heavy documents without compromising on reading clarity or pixel quality. Share via email, post to websites, or save disk space with our intelligent adaptive compression algorithm.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Reduce file footprints by up to 90% without visible blur',
                  'Support for PDFs, JPEG, PNG, MP4 video, and MP3 audio',
                  'Instant download ready — zero watermark or quality degradation',
                  'Client-side privacy: your files are never retained or trained on',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <span>Compress Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FILE TRANSFER (Split Layout: Text Left, Mockup Right)  */}
      {/* ======================================================== */}
      <section id="transfer" className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Column (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold tracking-wide uppercase">
                <Share2 className="w-3.5 h-3.5 text-purple-600" />
                <span>File Transfer</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Transfer files wirelessly with any device instantly
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                No cables, no cloud drive sign-ups, and no upload limits. Beam documents, 4K videos, and large archives directly between your iPhone, iPad, Mac, and Windows PC at local Wi-Fi speeds.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Lightning-fast direct local network transfer (up to 85 MB/s)',
                  'Universal compatibility: iOS, macOS, Windows, Android, and Web',
                  'Point-to-point end-to-end encryption without intermediate servers',
                  'Scan a simple QR code to connect any device in 2 seconds',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <span>Transfer Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* UI Mockup Column (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6"
            >
              <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Local Beam Network
                    </span>
                    <span className="text-base font-bold text-[#111827]">
                      Wireless AirDrop-Style Beam
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Wi-Fi Ready
                  </span>
                </div>

                {/* Connected Devices Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xs">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-[#111827]">iPhone 16 Pro</div>
                    <div className="text-[10px] text-blue-600 font-medium">Source Device</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center mx-auto">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-[#111827]">MacBook Pro</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Ready to Receive</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center mx-auto">
                      <Tablet className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-[#111827]">iPad Pro</div>
                    <div className="text-[10px] text-gray-400 font-medium">Nearby</div>
                  </div>
                </div>

                {/* Transferring file simulation */}
                <div className="p-5 rounded-2xl bg-[#F9FAFB] border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                        RAW
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111827]">
                          Cinema_Footage_4K_Reel.mov
                        </div>
                        <div className="text-xs text-gray-500">1.84 GB • Direct P2P Stream</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-600">82 MB/s</span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 transition-all duration-300"
                      style={{ width: `${transferProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Encrypted with TLS 1.3</span>
                    <span>{transferring ? 'Streaming...' : 'Transfer Completed'}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={triggerTransfer}
                    disabled={transferring}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-75"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{transferring ? 'Transferring File...' : 'Send File Wirelessly'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FeaturesShowcase;
