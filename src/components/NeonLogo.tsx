'use client';

import { motion, useAnimation } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

/* ─── Neon Logo Component ───
   3D neon text with cyan (#22d3ee) + purple (#a855f7) + magenta accents.
   Pulsing glow, flicker animation, hover/tap brightness boost.
   Supports 3 size variants: 'nav' | 'hero' | 'footer'
*/

type LogoVariant = 'nav' | 'hero' | 'footer';

interface NeonLogoProps {
  variant?: LogoVariant;
  className?: string;
  onClick?: () => void;
}

const sizeConfig: Record<LogoVariant, {
  wrapper: string;
  textMain: string;
  textSub: string;
  icon: string;
  iconText: string;
  glowLayers: number;
  translateZ: string;
}> = {
  nav: {
    wrapper: 'gap-2',
    textMain: 'text-lg sm:text-xl font-black tracking-tight',
    textSub: 'text-lg sm:text-xl font-black tracking-tight',
    icon: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl',
    iconText: 'text-xs sm:text-sm',
    glowLayers: 3,
    translateZ: 'translateZ(12px)',
  },
  hero: {
    wrapper: 'flex-col gap-3 sm:gap-4',
    textMain: 'text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter',
    textSub: 'text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter',
    icon: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl',
    iconText: 'text-base sm:text-lg',
    glowLayers: 5,
    translateZ: 'translateZ(25px)',
  },
  footer: {
    wrapper: 'gap-2',
    textMain: 'text-base sm:text-lg font-bold tracking-tight',
    textSub: 'text-base sm:text-lg font-bold tracking-tight',
    icon: 'w-8 h-8 rounded-lg',
    iconText: 'text-xs',
    glowLayers: 2,
    translateZ: 'translateZ(8px)',
  },
};

export default function NeonLogo({ variant = 'nav', className = '', onClick }: NeonLogoProps) {
  const cfg = sizeConfig[variant];
  const isHero = variant === 'hero';
  const [hovered, setHovered] = useState(false);
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    controls.start({
      scale: 1.06,
      transition: { duration: 0.3, ease: 'easeOut' },
    });
  }, [controls]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    controls.start({
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    });
  }, [controls]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onClick]);

  // Build multi-layer neon text-shadow
  const buildGlowShadows = (baseColor: string, intensity: number): string => {
    const layers = cfg.glowLayers + (hovered ? 2 : 0);
    const shadows: string[] = [];
    for (let i = 1; i <= layers; i++) {
      const spread = i * (hovered ? 6 : 4);
      const alpha = Math.max(0.15, 0.7 - i * 0.12);
      shadows.push(`0 0 ${spread}px ${baseColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba')}`);
      if (i <= 2) {
        shadows.push(`0 0 ${spread * 2}px ${baseColor.replace(')', `, ${alpha * 0.4})`).replace('rgb', 'rgba')}`);
      }
    }
    return shadows.join(', ');
  };

  const cyanShadow = buildGlowShadows('rgb(34, 211, 238)', 1);
  const purpleShadow = buildGlowShadows('rgb(168, 85, 247)', 1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: isHero ? 20 : 0 }}
      animate={{ opacity: 1, y: 0, ...controls }}
      transition={{ duration: isHero ? 0.8 : 0.5, delay: isHero ? 0.1 : 0 }}
      className={`relative cursor-pointer select-none ${className}`}
      style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
      aria-label="SubzAgency - Scroll to top"
    >
      <div
        className={`flex items-center ${cfg.wrapper}`}
        style={{ transform: cfg.translateZ }}
      >
        {/* Icon badge */}
        <motion.div
          animate={{
            boxShadow: hovered
              ? '0 0 25px rgba(34,211,238,0.4), 0 0 50px rgba(168,85,247,0.25), 0 0 80px rgba(168,85,247,0.1)'
              : '0 0 12px rgba(34,211,238,0.2), 0 0 30px rgba(168,85,247,0.1)',
          }}
          transition={{ duration: 0.4 }}
          className={`relative flex items-center justify-center neon-logo-badge ${cfg.icon}`}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-[#22d3ee] via-[#a855f7] to-[#ec4899] opacity-90" />
          {/* Inner shimmer */}
          <div className="absolute inset-[1px] rounded-[inherit] bg-[#0a0a1a]/80" />
          <span
            className={`relative font-black ${cfg.iconText} bg-gradient-to-r from-[#22d3ee] to-[#a855f7] bg-clip-text text-transparent`}
          >
            SA
          </span>
        </motion.div>

        {/* Text */}
        <div className="relative flex items-baseline" style={{ transformStyle: 'preserve-3d' }}>
          {/* "Subz" in cyan */}
          <span
            className={`${cfg.textMain} neon-logo-cyan`}
            style={{
              color: '#22d3ee',
              textShadow: cyanShadow,
              transform: 'translateZ(15px)',
            }}
          >
            Subz
          </span>
          {/* "Agency" in purple */}
          <span
            className={`${cfg.textSub} neon-logo-purple`}
            style={{
              color: '#a855f7',
              textShadow: purpleShadow,
              transform: 'translateZ(8px)',
            }}
          >
            Agency
          </span>

          {/* Light trail underline (hero only) */}
          {isHero && (
            <motion.div
              className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-[2px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #22d3ee, #a855f7, #ec4899, transparent)',
                transform: 'translateZ(5px)',
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scaleX: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
      </div>

      {/* Ambient glow behind text (hero only) */}
      {isHero && (
        <motion.div
          className="absolute inset-0 -z-10 pointer-events-none"
          animate={{
            opacity: hovered ? 0.35 : 0.2,
          }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.15) 0%, rgba(168,85,247,0.08) 40%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
      )}
    </motion.div>
  );
}
