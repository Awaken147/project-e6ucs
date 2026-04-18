'use client';

import { useRef, useCallback, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Star, Zap, Crown, Rocket, Shield, Heart } from 'lucide-react';

/* ─── 3D Tilt Card Hook ─── */
function useTilt(intensity = 15) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }, []);

  return { cardRef, handleMouseMove, handleMouseLeave };
}

/* ─── Single Pricing Card ─── */
interface PricingCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  period?: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  badge?: string;
  accentColor?: string;
  delay?: number;
}

function PricingCard({
  name,
  price,
  originalPrice,
  period,
  features,
  icon,
  popular,
  badge,
  accentColor = '#00ff88',
  delay = 0,
}: PricingCardProps) {
  const { cardRef, handleMouseMove, handleMouseLeave } = useTilt(12);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
      className={`${popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          handleMouseLeave();
          setHovered(false);
        }}
        onMouseEnter={() => setHovered(true)}
        className={`relative rounded-2xl p-[1px] transition-all duration-500 ${
          popular
            ? 'bg-gradient-to-br from-[#00ff88] via-[#ffd700] to-[#00ff88]'
            : 'bg-white/[0.06]'
        } ${
          popular && hovered
            ? 'shadow-[0_0_60px_rgba(0,255,136,0.2),0_0_120px_rgba(0,255,136,0.1)]'
            : hovered
            ? 'shadow-[0_0_40px_rgba(0,255,136,0.1)]'
            : ''
        }`}
      >
        {/* Inner card */}
        <div
          className={`relative rounded-2xl p-6 sm:p-8 backdrop-blur-xl overflow-hidden transition-all duration-500 ${
            popular
              ? 'bg-[#0a0a1a] lg:p-8'
              : 'bg-[#0a0a1a]/80'
          }`}
          style={{
            minHeight: popular ? '480px' : '460px',
          }}
        >
          {/* Shine effect */}
          <div className="card-3d-shine" />

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`,
                color: accentColor,
                border: `1px solid ${accentColor}33`,
              }}
            >
              <Star className="w-3 h-3" fill={accentColor} />
              {badge}
            </div>
          )}

          {/* Icon */}
          <motion.div
            animate={hovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
            style={{
              background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
              border: `1px solid ${accentColor}20`,
            }}
          >
            <div style={{ color: accentColor }}>{icon}</div>
          </motion.div>

          {/* Plan name */}
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl sm:text-5xl font-black text-white">{price}</span>
            {originalPrice && (
              <span className="text-lg text-gray-500 line-through">{originalPrice}</span>
            )}
            {period && (
              <span className="text-sm text-gray-500">{period}</span>
            )}
          </div>

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}33, transparent)`,
            }}
          />

          {/* Features */}
          <ul className="space-y-3 mb-8 flex-1">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.1 + i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 text-sm text-gray-300"
              >
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              popular
                ? 'bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]'
                : 'border border-white/10 text-white hover:border-[#00ff88]/40 hover:bg-[#00ff8808]'
            }`}
          >
            {popular ? 'Get Started Now' : 'Choose Plan'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Hosting Card (smaller) ─── */
interface HostingCardProps {
  name: string;
  price: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  delay?: number;
}

function HostingCard({ name, price, features, icon, popular, delay = 0 }: HostingCardProps) {
  const { cardRef, handleMouseMove, handleMouseLeave } = useTilt(8);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { handleMouseLeave(); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        className={`relative rounded-2xl p-[1px] transition-all duration-500 ${
          popular
            ? 'bg-gradient-to-br from-[#ffd700] via-[#ff6b35] to-[#ffd700]'
            : 'bg-white/[0.06]'
        } ${
          popular && hovered
            ? 'shadow-[0_0_50px_rgba(255,215,0,0.2)]'
            : ''
        }`}
      >
        <div className={`relative rounded-2xl p-6 bg-[#0a0a1a]/90 backdrop-blur-xl`}>
          <div className="card-3d-shine" />
          
          {popular && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20">
              <Star className="w-3 h-3" fill="#ffd700" />
              Popular
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              popular ? 'bg-[#ffd700]/10' : 'bg-white/5'
            }`}>
              {icon}
            </div>
            <div>
              <h4 className="font-bold text-white">{name}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black" style={{ color: popular ? '#ffd700' : '#00ff88' }}>{price}</span>
                <span className="text-xs text-gray-500">/month</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                <Check className="w-3 h-3" style={{ color: popular ? '#ffd700' : '#00ff88' }} />
                {f}
              </li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
              popular
                ? 'bg-gradient-to-r from-[#ffd700] to-[#ff6b35] text-black'
                : 'border border-white/10 text-white hover:border-white/20'
            }`}
          >
            Subscribe
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Pricing Section ─── */
export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const websitePackages = [
    {
      name: 'Starter',
      price: '₹9,999',
      period: 'one-time',
      icon: <Zap className="w-7 h-7" />,
      accentColor: '#00ff88',
      features: [
        '1-Page Cinematic 3D Website',
        'Mobile Responsive + Basic Animations',
        '1 Month Free Hosting',
        '2 Free Revisions',
      ],
    },
    {
      name: 'Growth',
      price: '₹19,999',
      period: 'one-time',
      icon: <Rocket className="w-7 h-7" />,
      popular: true,
      badge: 'Most Popular',
      accentColor: '#00ff88',
      features: [
        'Up to 5-Page Cinematic 3D Website',
        'Advanced 3D + Anime.js Animations',
        'Forms, WhatsApp Integration, SEO Optimized',
        '3 Months Free Hosting',
        '2 Free Revisions',
      ],
    },
    {
      name: 'Premium',
      price: '₹34,999',
      period: 'one-time',
      icon: <Crown className="w-7 h-7" />,
      accentColor: '#ffd700',
      features: [
        'Unlimited Pages + Full 3D Experience',
        'AI Chatbot Integration + Advanced Animations',
        'E-commerce Ready',
        '6 Months Free Hosting',
        'Priority Support + 2 Free Revisions',
      ],
    },
  ];

  const hostingPlans = [
    {
      name: 'Basic Care',
      price: '₹499',
      icon: <Shield className="w-5 h-5 text-[#00ff88]" />,
      features: [
        'Fast Hosting + SSL',
        'Weekly Backups',
        'Basic Updates',
      ],
    },
    {
      name: 'Growth Care',
      price: '₹999',
      popular: true,
      icon: <Zap className="w-5 h-5 text-[#ffd700]" />,
      features: [
        'Everything in Basic + Regular Content Updates',
        'Monthly Performance Reports',
        'Priority Support',
      ],
    },
    {
      name: 'Premium Care',
      price: '₹1,999',
      icon: <Crown className="w-5 h-5 text-[#ffd700]" />,
      features: [
        'Full Maintenance + Advanced Updates',
        'Monthly New Animations/Features',
        'Dedicated Support',
      ],
    },
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Heart className="w-4 h-4 text-[#ff2d55]" />
            <span className="text-sm text-gray-400">Simple, Transparent &amp; Very Affordable</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            Pricing That <span className="text-gradient-green">Makes Sense</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            World-class cinematic websites at Indian prices. No hidden charges, no surprises.
          </p>
        </motion.div>

        {/* Website Packages */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <h3 className="text-center text-lg font-semibold text-[#00ff88] mb-8 tracking-wide uppercase">
            Website Packages — One-time Payment
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {websitePackages.map((pkg, i) => (
            <PricingCard key={pkg.name} {...pkg} delay={i * 0.15} />
          ))}
        </div>

        {/* Hosting & Maintenance */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-center text-lg font-semibold text-[#ffd700] mb-8 tracking-wide uppercase">
            Monthly Hosting &amp; Maintenance
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {hostingPlans.map((plan, i) => (
            <HostingCard key={plan.name} {...plan} delay={i * 0.15} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass">
            <span className="text-sm text-gray-300">
              💡 Super competitive prices for cinematic 3D quality.{' '}
              <strong className="text-[#00ff88]">Easy installments</strong> available.{' '}
              <strong className="text-[#ffd700]">No hidden charges.</strong>{' '}
              Delivery in 3-7 days.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
