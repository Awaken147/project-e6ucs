'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap, Crown, Rocket, Shield, Heart, X, CreditCard, RefreshCw } from 'lucide-react';
import Script from 'next/script';

/* ─── Razorpay global type ─── */
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  theme: { color: string };
  prefill: { contact?: string; name?: string; email?: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

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

/* ─── Success Modal ─── */
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.7, bounce: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl p-[1px] bg-gradient-to-br from-[#00ff88] via-[#ffd700] to-[#00ff88]"
      >
        <div className="relative rounded-2xl bg-[#0a0a1a] p-8 text-center overflow-hidden">
          {/* Confetti glow */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="absolute top-12 right-12 w-2 h-2 rounded-full bg-[#ffd700] animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="absolute bottom-16 left-16 w-2.5 h-2.5 rounded-full bg-[#ff6b35] animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-12 right-8 w-3 h-3 rounded-full bg-[#22d3ee] animate-bounce" style={{ animationDelay: '0.15s' }} />
            <div className="absolute top-20 left-1/2 w-2 h-2 rounded-full bg-[#ff2d55] animate-bounce" style={{ animationDelay: '0.25s' }} />
            <div className="absolute top-1/3 left-4 w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(0,255,136,0.3)]"
          >
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-4xl"
            >
              ✓
            </motion.span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-black text-white mb-3"
          >
            Payment Successful! 🎉
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-sm leading-relaxed mb-6"
          >
            Thank you for choosing <span className="text-[#00ff88] font-bold">SubzAgency</span>. Our team will contact you shortly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-xl p-4 mb-6"
          >
            <p className="text-xs text-gray-400 leading-relaxed">
              Please WhatsApp{' '}
              <a
                href="https://wa.me/916297097642?text=Hi%2C%20I%20just%20paid%20for%20a%20SubzAgency%20package.%20Here%20are%20my%20order%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff88] font-bold underline hover:text-[#00cc6a] transition-colors"
              >
                +91 62970 97642
              </a>{' '}
              with your order details to start your project immediately.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            href="https://wa.me/916297097642?text=Hi%2C%20I%20just%20paid%20for%20a%20SubzAgency%20package.%20Here%20are%20my%20order%20details."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(37,211,102,0.3)] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Us Now
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Error Modal ─── */
function ErrorModal({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl p-[1px] bg-gradient-to-br from-[#ff2d55] via-[#ff6b35] to-[#ff2d55]"
      >
        <div className="relative rounded-2xl bg-[#0a0a1a] p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-full bg-[#ff2d55]/10 border border-[#ff2d55]/20 flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-[#ff2d55]" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Payment Failed</h3>
          <p className="text-gray-400 text-sm mb-6">
            Something went wrong. Don&apos;t worry — your money was not charged. Please try again or contact us on WhatsApp.
          </p>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRetry}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-bold text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Payment
            </motion.button>
            <a
              href="https://wa.me/916297097642?text=Hi%2C%20I%20tried%20paying%20but%20got%20an%20error.%20Please%20help."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-white font-medium text-sm hover:border-[#00ff88]/40 transition-all"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Single Pricing Card ─── */
interface PricingCardProps {
  name: string;
  price: string;
  pricePaise: number;
  originalPrice?: string;
  period?: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  badge?: string;
  accentColor?: string;
  delay?: number;
  onBuy: () => void;
  loading?: boolean;
}

function PricingCard({
  name,
  price,
  pricePaise: _pricePaise,
  originalPrice,
  period,
  features,
  icon,
  popular,
  badge,
  accentColor = '#00ff88',
  delay = 0,
  onBuy,
  loading,
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
          className={`relative rounded-2xl p-6 sm:p-8 backdrop-blur-xl overflow-hidden transition-all duration-500 flex flex-col ${
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

          {/* Buy Now CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBuy}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
              popular
                ? 'bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black hover:shadow-[0_0_40px_rgba(0,255,136,0.35)]'
                : 'border border-white/10 text-white hover:border-[#00ff88]/40 hover:bg-[#00ff8808] hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]'
            }`}
            style={!popular ? { boxShadow: hovered ? '0 0 30px rgba(34,211,238,0.15)' : undefined } : undefined}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                {popular ? 'Pay Now & Get Started' : 'Buy Now'}
              </>
            )}
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
  pricePaise: number;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  delay?: number;
  onBuy: () => void;
  loading?: boolean;
}

function HostingCard({ name, price, pricePaise: _pricePaise, features, icon, popular, delay = 0, onBuy, loading }: HostingCardProps) {
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
        <div className={`relative rounded-2xl p-6 bg-[#0a0a1a]/90 backdrop-blur-xl flex flex-col`}>
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

          <ul className="space-y-2 mb-6 flex-1">
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
            onClick={onBuy}
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
              popular
                ? 'bg-gradient-to-r from-[#ffd700] to-[#ff6b35] text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]'
                : 'border border-white/10 text-white hover:border-white/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
            }`}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full"
                />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-3.5 h-3.5" />
                Subscribe Now
              </>
            )}
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

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
  const [retryOptions, setRetryOptions] = useState<{ packageName: string; amountPaise: number } | null>(null);
  const razorpayLoadedRef = useRef(false);

  /* Load Razorpay script */
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      razorpayLoadedRef.current = true;
    }
  }, []);

  /* Open Razorpay checkout */
  const openRazorpay = useCallback((options: {
    packageName: string;
    amountPaise: number;
  }) => {
    setLoadingPkg(options.packageName);

    const loadAndOpen = () => {
      if (!window.Razorpay) {
        // Script not yet loaded — wait briefly
        setTimeout(() => loadAndOpen(), 300);
        return;
      }

      const rzp = new window.Razorpay({
        key: 'rzp_test_XXXX', // ⚠️ Replace with your real Razorpay Key ID
        amount: options.amountPaise,
        currency: 'INR',
        name: 'SubzAgency',
        description: options.packageName,
        theme: {
          color: '#22d3ee',
        },
        prefill: {
          contact: '+91 ',
        },
        handler: (_response: RazorpayResponse) => {
          setLoadingPkg(null);
          setShowSuccess(true);
        },
        modal: {
          ondismiss: () => {
            setLoadingPkg(null);
          },
        },
      });

      rzp.on('payment.failed', () => {
        setLoadingPkg(null);
        setRetryOptions(options);
        setShowError(true);
      });

      rzp.open();
    };

    loadAndOpen();
  }, []);

  /* Buy handlers */
  const handleBuy = useCallback((packageName: string, amountPaise: number) => {
    openRazorpay({ packageName, amountPaise });
  }, [openRazorpay]);

  const websitePackages = [
    {
      name: 'Starter',
      price: '₹9,999',
      pricePaise: 999900,
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
      pricePaise: 1999900,
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
      pricePaise: 3499900,
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
      pricePaise: 49900,
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
      pricePaise: 99900,
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
      pricePaise: 199900,
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

      {/* Load Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => { razorpayLoadedRef.current = true; }}
      />

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
            <PricingCard
              key={pkg.name}
              {...pkg}
              delay={i * 0.15}
              onBuy={() => handleBuy(pkg.name + ' Website Package', pkg.pricePaise)}
              loading={loadingPkg === pkg.name}
            />
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
            <HostingCard
              key={plan.name}
              {...plan}
              delay={i * 0.15}
              onBuy={() => handleBuy(plan.name + ' Hosting Plan', plan.pricePaise)}
              loading={loadingPkg === plan.name}
            />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          {/* Payment method note */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass">
            <CreditCard className="w-4 h-4 text-[#22d3ee] flex-shrink-0" />
            <span className="text-sm text-gray-300">
              Instant payment via <strong className="text-[#22d3ee]">Razorpay</strong> (UPI, Cards, Net Banking). Money transferred securely to SubzAgency. Delivery starts within 24 hours after you WhatsApp your details.
            </span>
          </div>

          <div className="block" />

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

      {/* Modals */}
      <AnimatePresence>
        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showError && (
          <ErrorModal
            onRetry={() => {
              setShowError(false);
              if (retryOptions) {
                openRazorpay(retryOptions);
              }
            }}
            onClose={() => setShowError(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
