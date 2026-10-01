import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Presentation,
  Music,
  Video,
  Layers,
  Scissors,
  ScanLine,
  PenTool,
  Lock,
  Unlock,
  Volume2,
  Stamp,
  BookOpen,
  RotateCw,
  LayoutGrid,
  Wand2,
  Sparkles,
  FileCode,
  Film,
  Camera,
  Sliders,
  GitCompare,
  ArrowRight,
  ArrowDownUp,
  Minimize2,
  Search,
  CheckCircle2,
} from 'lucide-react';

const TOOLS = [
  { name: 'Word to PDF', category: 'pdf', icon: FileText, color: 'text-blue-600 bg-blue-50', popular: true },
  { name: 'PDF to Word', category: 'pdf', icon: FileText, color: 'text-indigo-600 bg-indigo-50', popular: true },
  { name: 'Image to PDF', category: 'pdf', icon: FileImage, color: 'text-emerald-600 bg-emerald-50', popular: true },
  { name: 'PPT to PDF', category: 'pdf', icon: Presentation, color: 'text-orange-600 bg-orange-50' },
  { name: 'Excel to PDF', category: 'pdf', icon: FileSpreadsheet, color: 'text-green-600 bg-green-50' },
  { name: 'Merge PDF', category: 'pdf', icon: Layers, color: 'text-purple-600 bg-purple-50', popular: true },
  { name: 'Split PDF', category: 'pdf', icon: Scissors, color: 'text-rose-600 bg-rose-50' },
  { name: 'Compress Video', category: 'video', icon: Video, color: 'text-violet-600 bg-violet-50', popular: true },
  { name: 'Convert Audio', category: 'audio', icon: Music, color: 'text-amber-600 bg-amber-50', popular: true },
  { name: 'Video to GIF', category: 'video', icon: Film, color: 'text-fuchsia-600 bg-fuchsia-50' },
  { name: 'OCR Text Scanner', category: 'ai', icon: ScanLine, color: 'text-cyan-600 bg-cyan-50', popular: true },
  { name: 'Sign PDF', category: 'security', icon: PenTool, color: 'text-blue-600 bg-blue-50' },
  { name: 'Protect PDF', category: 'security', icon: Lock, color: 'text-red-600 bg-red-50' },
  { name: 'Unlock PDF', category: 'security', icon: Unlock, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Extract Audio', category: 'audio', icon: Volume2, color: 'text-amber-600 bg-amber-50' },
  { name: 'Watermark PDF', category: 'security', icon: Stamp, color: 'text-teal-600 bg-teal-50' },
  { name: 'ePub to PDF', category: 'pdf', icon: BookOpen, color: 'text-sky-600 bg-sky-50' },
  { name: 'Rotate PDF', category: 'pdf', icon: RotateCw, color: 'text-indigo-600 bg-indigo-50' },
  { name: 'Organize Pages', category: 'pdf', icon: LayoutGrid, color: 'text-purple-600 bg-purple-50' },
  { name: 'Remove Background', category: 'ai', icon: Wand2, color: 'text-pink-600 bg-pink-50', popular: true },
  { name: 'AI PDF Summarizer', category: 'ai', icon: Sparkles, color: 'text-violet-600 bg-violet-50', popular: true },
  { name: 'PDF to Markdown', category: 'pdf', icon: FileCode, color: 'text-slate-700 bg-slate-100' },
  { name: 'HEIC to JPG', category: 'video', icon: Camera, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Audio Cutter', category: 'audio', icon: Sliders, color: 'text-amber-600 bg-amber-50' },
  { name: 'Compare Documents', category: 'ai', icon: GitCompare, color: 'text-blue-600 bg-blue-50' },
  { name: 'PDF Page Numbers', category: 'pdf', icon: Layers, color: 'text-slate-600 bg-slate-50' },
  { name: 'MP4 to MP3', category: 'audio', icon: Music, color: 'text-rose-600 bg-rose-50' },
  { name: 'Crop PDF', category: 'pdf', icon: Scissors, color: 'text-indigo-600 bg-indigo-50' },
];

export function ExploreToolsGrid() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'pdf', name: 'PDF & Office' },
    { id: 'video', name: 'Image & Video' },
    { id: 'audio', name: 'Audio & Media' },
    { id: 'ai', name: 'AI Tools' },
    { id: 'security', name: 'Security & Sign' },
  ];

  return (
    <section id="tools" className="py-20 sm:py-28 bg-[#F9FAFB] border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase mb-4">
            <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
            <span>Comprehensive Suite</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight mb-4">
            Explore more file tools
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            Everything you need to convert, compress, edit, annotate, and secure any document format in one high-performance interface.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#111827] hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick Filter Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 40+ tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Responsive Pill-Shaped Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link
                key={idx}
                to="/upload"
                className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white border border-gray-200/90 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10 hover:text-blue-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${tool.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#111827] group-hover:text-blue-600 truncate">
                  {tool.name}
                </span>

                {tool.popular && (
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-500 ml-auto" />
                )}
              </Link>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-500">
            No tools found matching &quot;{searchQuery}&quot;. Try another search term.
          </div>
        )}

        {/* Bottom Marquee / Teaser */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Need automated batch processing or developer API?
              </h3>
              <p className="text-xs text-gray-500">
                Integrate Documents.io file engine directly into your enterprise ERP, cloud drive, or internal apps.
              </p>
            </div>
          </div>

          <Link
            to="/register"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <span>Explore Developer API</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ExploreToolsGrid;
