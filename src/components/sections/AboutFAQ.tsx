'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Code2, Layers, Zap, Globe, Users, Award,
  ChevronDown, MessageCircle, Target, Lightbulb, Shield, Clock
} from 'lucide-react';

/* ─── About Section ─── */
export default function AboutFAQ() {
  return (
    <>
      <AboutSection />
      <FAQSection />
    </>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Pixel Perfect',
      desc: 'Every pixel is crafted with precision. We don\'t do "good enough" — we do exceptional.',
      color: '#00ff88',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      desc: '60fps animations, optimized assets, and blazing-fast load times on every device.',
      color: '#ffd700',
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Creative Innovation',
      desc: 'We push boundaries with cutting-edge 3D, WebGL, and animation technologies.',
      color: '#ff6b35',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Reliable & Secure',
      desc: 'Enterprise-grade hosting, SSL, daily backups, and 24/7 monitoring included.',
      color: '#00ff88',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Client First',
      desc: 'Your vision, our expertise. Unlimited revisions until you\'re 100% satisfied.',
      color: '#ffd700',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'On-Time Delivery',
      desc: 'Strict deadlines, transparent communication, and milestone-based delivery.',
      color: '#ff6b35',
    },
  ];

  const stats = [
    { number: '150+', label: 'Projects Completed', icon: <Layers className="w-5 h-5" /> },
    { number: '50+', label: 'Happy Clients', icon: <Users className="w-5 h-5" /> },
    { number: '4.9★', label: 'Average Rating', icon: <Award className="w-5 h-5" /> },
    { number: '99.9%', label: 'Uptime Guarantee', icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#080820] to-[#030014]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#ffd700] rounded-full opacity-[0.02] blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00ff88] rounded-full opacity-[0.02] blur-[150px]" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            <Code2 className="w-4 h-4 text-[#ffd700]" />
            <span className="text-sm text-gray-400">Who We Are</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            About <span className="text-gradient-green">SubzAgency</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            We&apos;re a passionate team of designers and developers based in India,
            obsessed with creating the most stunning cinematic web experiences on the planet.
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl glass group hover:border-[#00ff88]/20 transition-all duration-300"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88] mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gradient-green mb-1">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-6 rounded-2xl glass hover:border-opacity-20 transition-all duration-300 cursor-default"
              style={{ '--hover-color': v.color } as React.CSSProperties}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{
                  background: `${v.color}10`,
                  border: `1px solid ${v.color}20`,
                  color: v.color,
                }}
              >
                {v.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Section ─── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How long does it take to build a website?',
      a: 'Starter websites take 5-7 business days, Growth packages take 10-14 days, and Premium projects take 2-4 weeks depending on complexity. We always provide a detailed timeline before starting.',
    },
    {
      q: 'Do you offer EMI or installment options?',
      a: 'Yes! We offer easy 2-3 month installment plans for all packages. Just mention it when you contact us and we\'ll set up a comfortable payment schedule for you.',
    },
    {
      q: 'What technologies do you use?',
      a: 'We use Next.js, React, Three.js, WebGL, Anime.js, GSAP, Tailwind CSS, and other cutting-edge tools. Every project is built with the latest standards for performance and SEO.',
    },
    {
      q: 'Will my website work on mobile devices?',
      a: 'Absolutely! All our websites are fully responsive and optimized for every screen size. We test on 15+ devices to ensure perfect display everywhere.',
    },
    {
      q: 'Can I update the website content myself?',
      a: 'Yes, we build with user-friendly content management. For Premium clients, we even include a custom dashboard. Growth Care and Premium Care plans include content updates by our team.',
    },
    {
      q: 'What about SEO and Google ranking?',
      a: 'Growth and Premium packages include full SEO optimization — meta tags, structured data, sitemap, page speed optimization, and Google Analytics integration. We help you rank higher from day one.',
    },
    {
      q: 'Do you provide domain and hosting?',
      a: 'Yes! All packages include free hosting for the stated period. We help you choose and set up the perfect domain name. Hosting renewal is handled through our affordable care plans.',
    },
    {
      q: 'What if I\'m not satisfied with the design?',
      a: 'We include free revisions in every package. We work iteratively with you, sharing previews at each stage. Our 98% client satisfaction rate speaks for itself!',
    },
  ];

  return (
    <section id="faq" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#050518] to-[#030014]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <MessageCircle className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm text-gray-400">Got Questions?</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Everything you need to know. Can&apos;t find what you&apos;re looking for?{' '}
            <a href="#contact" className="text-[#00ff88] hover:underline">Contact us</a>.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="faq-item rounded-xl glass overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="font-medium text-white pr-4 text-sm sm:text-base">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-[#00ff88]' : 'text-gray-500'}`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
