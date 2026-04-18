'use client';

import { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, RotateCcw, Palette, Box, Sparkles, Orbit, Move } from 'lucide-react';
import dynamic from 'next/dynamic';

/* ─── Three.js Scene (loaded dynamically to avoid SSR) ─── */
const ThreePlayground = dynamic(
  () => import('./ThreePlayground'),
  { ssr: false, loading: () => <PlaygroundLoader /> }
);

function PlaygroundLoader() {
  return (
    <div className="w-full h-[400px] sm:h-[500px] rounded-2xl glass flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-[#00ff88]/20 border-t-[#00ff88] rounded-full mx-auto mb-4"
        />
        <p className="text-gray-500 text-sm">Loading 3D Playground...</p>
      </div>
    </div>
  );
}

/* ─── Playground Section ─── */
export default function PlaygroundSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const resetViewRef = useRef<(() => void) | null>(null);

  const demos = [
    {
      id: 'particles',
      label: 'Particle Field',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Floating particle system',
    },
    {
      id: 'geometry',
      label: '3D Geometry',
      icon: <Box className="w-4 h-4" />,
      desc: 'Interactive 3D shapes',
    },
    {
      id: 'wave',
      label: 'Wave Motion',
      icon: <Move className="w-4 h-4" />,
      desc: 'Animated wave patterns',
    },
    {
      id: 'orbit',
      label: 'Orbit System',
      icon: <Orbit className="w-4 h-4" />,
      desc: 'Orbital mechanics demo',
    },
  ];

  return (
    <section id="playground" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#050520] to-[#030014]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Background orbs */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#00ff88] rounded-full opacity-[0.02] blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-[#ffd700] rounded-full opacity-[0.02] blur-[150px]" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Play className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm text-gray-400">Interactive Demo</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            3D Animation <span className="text-gradient-gold">Playground</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            Play with our 3D effects and animations. Drag, rotate, and explore
            — this is what we can build for you.
          </p>
        </motion.div>

        {/* Demo selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          {demos.map((demo) => (
            <motion.button
              key={demo.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-gray-300 hover:text-white hover:border-[#00ff88]/30 transition-all duration-300"
            >
              {demo.icon}
              <div className="text-left">
                <div className="font-medium">{demo.label}</div>
                <div className="text-[10px] text-gray-500">{demo.desc}</div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="playground-canvas relative"
        >
          <ThreePlayground resetRef={resetViewRef} />

          {/* Controls overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs text-gray-400">
              <span>🖱️ Drag to rotate</span>
              <span className="text-gray-600">|</span>
              <span>🔍 Scroll to zoom</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => resetViewRef.current?.()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass text-xs text-gray-300 hover:text-[#00ff88] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset View
            </motion.button>
          </div>
        </motion.div>

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
        >
          {['Three.js', 'WebGL', 'GLSL Shaders', 'Anime.js', 'CSS 3D', 'Framer Motion'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium text-gray-400 border border-white/5 bg-white/[0.02]"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
