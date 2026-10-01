import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBackground = ({ variant = 'dark' }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`absolute inset-0 overflow-hidden -z-10 ${isDark ? 'bg-slate-950' : 'bg-gray-50'} pointer-events-none transition-colors duration-700`}>
      {/* Orb 1: Tech Blue */}
      <motion.div
        animate={{
          x: ['-10%', '20%', '-10%'],
          y: ['-20%', '10%', '-20%'],
          rotate: [0, 90, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-[8%] left-[18%] w-[65vw] h-[65vw] rounded-full ${
          isDark ? 'bg-blue-600/15 blur-[140px]' : 'bg-blue-500/20 blur-[120px]'
        }`}
      />
      {/* Orb 2: Light Indigo/Purple */}
      <motion.div
        animate={{
          x: ['10%', '-30%', '10%'],
          y: ['10%', '-20%', '10%'],
          rotate: [0, -90, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className={`absolute top-[28%] right-[8%] w-[55vw] h-[55vw] rounded-full ${
          isDark ? 'bg-indigo-600/15 blur-[140px]' : 'bg-indigo-400/20 blur-[120px]'
        }`}
      />
      {/* Orb 3: Cyan Accent */}
      <motion.div
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['30%', '0%', '30%'],
          scale: [0.8, 1.15, 0.8],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className={`absolute bottom-[-10%] left-[35%] w-[45vw] h-[45vw] rounded-full ${
          isDark ? 'bg-cyan-500/15 blur-[120px]' : 'bg-cyan-300/20 blur-[100px]'
        }`}
      />
    </div>
  );
};

export default LiquidBackground;
