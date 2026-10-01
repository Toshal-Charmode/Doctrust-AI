import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBackground = ({ variant = 'pastel' }) => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 bg-[#FAF9F6] pointer-events-none transition-colors duration-700">
      {/* Orb 1: Pastel Coral (#FF9D9D) */}
      <motion.div
        animate={{
          x: ['-10%', '20%', '-10%'],
          y: ['-20%', '10%', '-20%'],
          rotate: [0, 90, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[5%] left-[15%] w-[55vw] h-[55vw] rounded-full bg-[#FF9D9D]/30 blur-[120px]"
      />

      {/* Orb 2: Warm Peach (#FFC5AA) */}
      <motion.div
        animate={{
          x: ['10%', '-30%', '10%'],
          y: ['10%', '-20%', '10%'],
          rotate: [0, -90, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[25%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#FFC5AA]/35 blur-[120px]"
      />

      {/* Orb 3: Light Lemon Cream (#EEF8CD) */}
      <motion.div
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['30%', '0%', '30%'],
          scale: [0.8, 1.15, 0.8],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute bottom-[-10%] left-[30%] w-[45vw] h-[45vw] rounded-full bg-[#EEF8CD]/50 blur-[100px]"
      />

      {/* Orb 4: Soft Pastel Mint (#BBF1D2) */}
      <motion.div
        animate={{
          x: ['15%', '-15%', '15%'],
          y: ['-10%', '20%', '-10%'],
          scale: [0.9, 1.2, 0.9],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute top-[50%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[#BBF1D2]/40 blur-[110px]"
      />
    </div>
  );
};

export default LiquidBackground;
