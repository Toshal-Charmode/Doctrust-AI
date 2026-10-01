import React, { useEffect, useRef, useState } from 'react';

/**
 * AntiGravityBackground
 * 
 * An advanced dual-layer ambient interactive background effect:
 * Layer 1: Liquid Flow Gradient — Soft, light, slowly morphing organic fluid gradient.
 * Layer 2: Anti-Gravity Object Animation — Continuous, zero-gravity floating documents,
 *          open books, loose papers, and minimal abstract geometric shapes drifting,
 *          rotating, and gently interacting with mouse cursor.
 * 
 * Props:
 * - mode: 'fixed' (viewport fixed behind all sections) | 'contained' (absolute inside parent container)
 * - density: 'normal' | 'low' | 'high'
 * - interactive: boolean (enables mouse repulsion and click shockwave)
 */
export function AntiGravityBackground({
  mode = 'fixed',
  density = 'normal',
  interactive = true,
  className = '',
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse & Touch Tracking State
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isActive: false,
      lastMoveTime: 0,
      impulseRadius: 0,
      impulseX: 0,
      impulseY: 0,
      impulseStrength: 0,
    };

    // Item counts based on density and viewport width
    const getItemCount = (w) => {
      let base = 28;
      if (density === 'low') base = 18;
      if (density === 'high') base = 38;
      if (w < 768) return Math.floor(base * 0.6);
      if (w < 1200) return Math.floor(base * 0.85);
      return base;
    };

    // Item Type Definitions
    const ITEM_TYPES = ['document', 'book', 'paper', 'ring', 'diamond', 'reticle', 'sparkle'];

    let items = [];

    const createItem = (customX, customY, typeOverride) => {
      const type = typeOverride || ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
      // Depth simulation: 0.5 (far/blurry) to 1.15 (near/crisp)
      const depth = 0.55 + Math.random() * 0.6;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.12 + Math.random() * 0.28) * (depth * 0.9);

      return {
        type,
        x: customX !== undefined ? customX : Math.random() * width,
        y: customY !== undefined ? customY : Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.004,
        scale: depth,
        depth,
        opacity: (0.16 + (depth - 0.55) * 0.25), // 0.16 to 0.31
        floatPhase: Math.random() * Math.PI * 2,
        floatFreq: 0.001 + Math.random() * 0.0015,
        floatAmp: 6 + Math.random() * 8,
        // Dimension properties per type
        w: type === 'document' ? 38 : type === 'book' ? 46 : type === 'paper' ? 32 : 24,
        h: type === 'document' ? 52 : type === 'book' ? 30 : type === 'paper' ? 42 : 24,
      };
    };

    const initItems = () => {
      const count = getItemCount(width);
      items = [];
      for (let i = 0; i < count; i++) {
        // Ensure healthy proportion of documents, books, and loose papers
        let type;
        if (i % 6 === 0 || i % 6 === 1) type = 'document';
        else if (i % 6 === 2) type = 'book';
        else if (i % 6 === 3) type = 'paper';
        else if (i % 6 === 4) type = 'ring';
        else type = i % 2 === 0 ? 'reticle' : 'diamond';

        items.push(createItem(undefined, undefined, type));
      }
    };

    // Responsive Canvas Resize
    const resize = () => {
      const rect = mode === 'fixed' 
        ? { width: window.innerWidth, height: window.innerHeight }
        : containerRef.current.getBoundingClientRect();

      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initItems();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Interaction Listeners
    const handlePointerMove = (e) => {
      if (!interactive) return;
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (mode === 'contained' && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        clientX = e.clientX - rect.left;
        clientY = e.clientY - rect.top;
      }

      mouse.targetX = clientX;
      mouse.targetY = clientY;
      mouse.isActive = true;
      mouse.lastMoveTime = performance.now();
    };

    const handlePointerLeave = () => {
      mouse.isActive = false;
    };

    const handleClick = (e) => {
      if (!interactive) return;
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (mode === 'contained' && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        clientX = e.clientX - rect.left;
        clientY = e.clientY - rect.top;
      }

      // Trigger zero-gravity impulse pulse
      mouse.impulseX = clientX;
      mouse.impulseY = clientY;
      mouse.impulseRadius = 10;
      mouse.impulseStrength = 1.0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Render Helpers for Anti-Gravity Elements
    const drawDocument = (ctx, w, h) => {
      const fold = 10;
      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2);
      ctx.lineTo(w / 2 - fold, -h / 2);
      ctx.lineTo(w / 2, -h / 2 + fold);
      ctx.lineTo(w / 2, h / 2);
      ctx.lineTo(-w / 2, h / 2);
      ctx.closePath();

      // Translucent glass fill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.65)'; // subtle blue-300
      ctx.lineWidth = 1;
      ctx.stroke();

      // Fold corner triangle
      ctx.beginPath();
      ctx.moveTo(w / 2 - fold, -h / 2);
      ctx.lineTo(w / 2 - fold, -h / 2 + fold);
      ctx.lineTo(w / 2, -h / 2 + fold);
      ctx.closePath();
      ctx.fillStyle = 'rgba(224, 242, 254, 0.8)'; // blue-100
      ctx.fill();
      ctx.stroke();

      // Document lines
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      // Mini Title
      ctx.moveTo(-w / 2 + 6, -h / 2 + 13);
      ctx.lineTo(-w / 2 + 16, -h / 2 + 13);
      // Content lines
      ctx.moveTo(-w / 2 + 6, -h / 2 + 21);
      ctx.lineTo(w / 2 - 6, -h / 2 + 21);
      ctx.moveTo(-w / 2 + 6, -h / 2 + 28);
      ctx.lineTo(w / 2 - 10, -h / 2 + 28);
      ctx.moveTo(-w / 2 + 6, -h / 2 + 35);
      ctx.lineTo(w / 2 - 14, -h / 2 + 35);
      ctx.stroke();

      // Verified Security Stamp
      ctx.beginPath();
      ctx.arc(w / 2 - 9, h / 2 - 9, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.fill();
    };

    const drawOpenBook = (ctx, w, h) => {
      const halfW = w / 2;
      ctx.beginPath();
      // Left Page Curved Wing
      ctx.moveTo(0, h / 2);
      ctx.quadraticCurveTo(-halfW * 0.5, h / 2 + 3, -halfW, h / 2 - 2);
      ctx.lineTo(-halfW, -h / 2 + 2);
      ctx.quadraticCurveTo(-halfW * 0.5, -h / 2 - 3, 0, -h / 2);
      // Right Page Curved Wing
      ctx.quadraticCurveTo(halfW * 0.5, -h / 2 - 3, halfW, -h / 2 + 2);
      ctx.lineTo(halfW, h / 2 - 2);
      ctx.quadraticCurveTo(halfW * 0.5, h / 2 + 3, 0, h / 2);
      ctx.closePath();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.65)'; // subtle purple-300
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center Spine & Ribbon Bookmark
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(0, h / 2);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.stroke();

      // Micro Page Text Lines
      ctx.strokeStyle = 'rgba(216, 180, 254, 0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-halfW + 4, -h / 4);
      ctx.lineTo(-4, -h / 4);
      ctx.moveTo(-halfW + 4, 0);
      ctx.lineTo(-4, 0);
      ctx.moveTo(-halfW + 4, h / 4);
      ctx.lineTo(-6, h / 4);

      ctx.moveTo(4, -h / 4);
      ctx.lineTo(halfW - 4, -h / 4);
      ctx.moveTo(4, 0);
      ctx.lineTo(halfW - 4, 0);
      ctx.moveTo(4, h / 4);
      ctx.lineTo(halfW - 6, h / 4);
      ctx.stroke();
    };

    const drawLoosePaper = (ctx, w, h) => {
      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Ruled Lines
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = -h / 2 + 7; y < h / 2 - 5; y += 7) {
        ctx.moveTo(-w / 2 + 4, y);
        ctx.lineTo(w / 2 - 4, y);
      }
      ctx.stroke();
    };

    const drawOrbitalRing = (ctx, r = 16) => {
      // Inner Circle
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.5)';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Outer Dashed Orbit
      ctx.beginPath();
      ctx.setLineDash([3, 4]);
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(196, 181, 253, 0.4)';
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting Node
      ctx.beginPath();
      ctx.arc(r * 1.5 * 0.707, r * 1.5 * 0.707, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(96, 165, 250, 0.6)';
      ctx.fill();
    };

    const drawDiamond = (ctx, size = 14) => {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.75, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.75, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawReticle = (ctx, size = 14) => {
      const arm = 5;
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-size, -size + arm); ctx.lineTo(-size, -size); ctx.lineTo(-size + arm, -size);
      ctx.moveTo(size - arm, -size); ctx.lineTo(size, -size); ctx.lineTo(size, -size + arm);
      ctx.moveTo(-size, size - arm); ctx.lineTo(-size, size); ctx.lineTo(-size + arm, size);
      ctx.moveTo(size - arm, size); ctx.lineTo(size, size); ctx.lineTo(size, size - arm);
      // Center Crosshair
      ctx.moveTo(-2.5, 0); ctx.lineTo(2.5, 0);
      ctx.moveTo(0, -2.5); ctx.lineTo(0, 2.5);
      ctx.stroke();
    };

    const drawSparkle = (ctx, size = 9) => {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.fillStyle = 'rgba(147, 197, 253, 0.65)';
      ctx.fill();
    };

    // Main 60FPS Zero-Gravity Physics & Render Loop
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 16.667, 2.0); // Normalized to 60fps delta
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;
      }

      // Handle click impulse shockwave expansion
      if (mouse.impulseStrength > 0.02) {
        mouse.impulseRadius += 14 * dt;
        mouse.impulseStrength *= 0.94;
      }

      // Update & Render each floating object
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // 1. Natural Zero-Gravity Harmonic Oscillation
        item.floatPhase += item.floatFreq * dt;
        const harmonicOffsetY = Math.sin(item.floatPhase) * item.floatAmp * 0.05;
        const harmonicOffsetX = Math.cos(item.floatPhase * 0.8) * item.floatAmp * 0.03;

        // 2. Cursor Repulsion Field
        if (mouse.isActive) {
          const dx = item.x - mouse.x;
          const dy = item.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;

          if (dist < maxDist && dist > 1) {
            const force = (1 - dist / maxDist) * 0.7 * item.depth;
            const nx = dx / dist;
            const ny = dy / dist;
            item.vx += nx * force * 0.45;
            item.vy += ny * force * 0.45;
            item.vRot += (Math.random() - 0.5) * 0.002;
          }
        }

        // 3. Click Shockwave Impulse
        if (mouse.impulseStrength > 0.05) {
          const dx = item.x - mouse.impulseX;
          const dy = item.y - mouse.impulseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const waveDiff = Math.abs(dist - mouse.impulseRadius);

          if (waveDiff < 60 && dist > 1) {
            const impulseForce = (1 - waveDiff / 60) * mouse.impulseStrength * 1.5;
            item.vx += (dx / dist) * impulseForce;
            item.vy += (dy / dist) * impulseForce;
          }
        }

        // 4. Inertial Relaxation towards Base Velocity
        item.vx = item.vx * 0.97 + item.baseVx * 0.03;
        item.vy = item.vy * 0.97 + item.baseVy * 0.03;

        // 5. Position & Rotation Step
        item.x += (item.vx + harmonicOffsetX) * dt;
        item.y += (item.vy + harmonicOffsetY) * dt;
        item.rotation += item.vRot * dt;

        // 6. Seamless Screen Boundary Wrapping
        const pad = 60;
        if (item.x < -pad) item.x = width + pad;
        else if (item.x > width + pad) item.x = -pad;

        if (item.y < -pad) item.y = height + pad;
        else if (item.y > height + pad) item.y = -pad;

        // 7. Render with Translucent Glass Styling
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.scale(item.scale, item.scale);
        ctx.globalAlpha = item.opacity;

        // Depth blur simulation: farther objects have softer render
        if (item.depth < 0.75) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(147, 197, 253, 0.25)';
        } else {
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(59, 130, 246, 0.12)';
        }

        switch (item.type) {
          case 'document':
            drawDocument(ctx, item.w, item.h);
            break;
          case 'book':
            drawOpenBook(ctx, item.w, item.h);
            break;
          case 'paper':
            drawLoosePaper(ctx, item.w, item.h);
            break;
          case 'ring':
            drawOrbitalRing(ctx, 16);
            break;
          case 'diamond':
            drawDiamond(ctx, 14);
            break;
          case 'reticle':
            drawReticle(ctx, 14);
            break;
          case 'sparkle':
            drawSparkle(ctx, 9);
            break;
          default:
            drawDocument(ctx, item.w, item.h);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Pause animation when tab is inactive to preserve 100% resources
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mode, density, interactive]);

  const containerClasses = mode === 'fixed'
    ? 'fixed inset-0 pointer-events-none z-0 overflow-hidden select-none'
    : 'absolute inset-0 pointer-events-none z-0 overflow-hidden select-none';

  return (
    <div ref={containerRef} className={`${containerClasses} ${className}`} aria-hidden="true">
      {/* LAYER 1: Liquid Flow Gradient (Soft, Light, Continuously Morphing Ambient Mesh) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-90">
        {/* Liquid Blob 1 - Tech Light Azure (Top Left / Center) */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-blue-200/40 blur-[110px] animate-liquid-1"
        />

        {/* Liquid Blob 2 - Delicate Lavender / Purple (Top Right / Center) */}
        <div
          className="absolute top-[15%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-200/35 blur-[120px] animate-liquid-2"
        />

        {/* Liquid Blob 3 - Ethereal Cyan / Sky Breeze (Center / Mid-Screen) */}
        <div
          className="absolute top-[45%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-cyan-100/40 blur-[105px] animate-liquid-3"
        />

        {/* Liquid Blob 4 - Morning Mint / Soft AI Verification Glow (Bottom Left) */}
        <div
          className="absolute bottom-[5%] left-[5%] w-[48vw] h-[48vw] rounded-full bg-emerald-100/30 blur-[115px] animate-liquid-4"
        />

        {/* Liquid Blob 5 - Warm Pearl / Champagne Highlight (Bottom Right) */}
        <div
          className="absolute -bottom-[10%] right-[10%] w-[42vw] h-[42vw] rounded-full bg-amber-100/25 blur-[100px] animate-liquid-1"
        />

        {/* Subtle Micro-Dot / Ambient Matrix Overlay for Tactile Depth */}
        <div 
          className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]"
        />
      </div>

      {/* LAYER 2: Anti-Gravity Object Canvas (Floating Documents, Books, Loose Papers, Shapes) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

export default AntiGravityBackground;
