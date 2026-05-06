'use client';

import React from 'react';
import { Check } from 'lucide-react';

type PlanKey = 'Starter' | 'Growth' | 'Premium' | 'Enterprise' | 'Custom AI 3D';

const whatsappNumber = '916297097642';

function getWhatsappLink(plan: PlanKey) {
  const message = `Hi, I'm interested in the ${plan} package. Please share more details.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function PricingSection() {
  const plans: Array<{
    key: PlanKey;
    title: string;
    price: string;
    badge?: string;
    highlight?: boolean;
    features: string[];
    cta: string;
  }> = [
    {
      key: 'Starter',
      title: 'Starter',
      price: '₹12,999',
      features: [
        '1-Page Cinematic 3D',
        'Hero with 3D Animation',
        'Mobile Responsive',
        '2 Revisions',
        'Basic SEO',
      ],
      cta: 'Choose Starter',
    },
    {
      key: 'Growth',
      title: 'Growth',
      price: '₹24,999',
      features: [
        'Up to 5 Pages',
        'Full Cinematic 3D Experience',
        'Contact Forms',
        '4 Revisions',
        'SEO + Fast Loading',
      ],
      cta: 'Choose Growth',
    },
    {
      key: 'Premium',
      title: 'Premium',
      price: '₹42,999',
      badge: 'MOST POPULAR',
      highlight: true,
      features: [
        'Up to 10 Pages',
        'Advanced 3D + WebGL',
        'Custom Animations',
        'Blog Ready',
        '6 Revisions',
        'Priority Support',
      ],
      cta: 'Choose Premium',
    },
    {
      key: 'Enterprise',
      title: 'Enterprise',
      price: '₹74,999',
      features: [
        '10+ Pages',
        'Custom 3D Configurator',
        'Heavy WebGL',
        '8+ Revisions',
      ],
      cta: 'Choose Enterprise',
    },
    {
      key: 'Custom AI 3D',
      title: 'Custom AI 3D',
      price: '₹1,25,000+',
      features: ['Fully Custom 3D World', 'Game-like Experience'],
      cta: 'Get Custom Quote',
    },
  ];

  const onChoose = (plan: PlanKey) => {
    window.open(getWhatsappLink(plan), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative py-24 text-white">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 pointer-events-none opacity-70 [background:radial-gradient(700px_circle_at_20%_0%,rgba(139,92,246,0.18),transparent_60%),radial-gradient(900px_circle_at_90%_10%,rgba(99,102,241,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight">Simple, Transparent &amp; Premium Pricing</h2>
          <p className="mt-4 text-xl text-zinc-400 max-w-2xl mx-auto">
            World-class cinematic 3D websites at Indian prices. One-time payment. No hidden charges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan) => {
            const isPremium = plan.key === 'Premium';
            return (
              <div
                key={plan.key}
                className={
                  (isPremium
                    ? 'relative rounded-3xl p-[1px] bg-gradient-to-b from-purple-400 via-fuchsia-500 to-violet-700'
                    : 'rounded-3xl p-[1px] bg-gradient-to-b from-zinc-800/70 via-zinc-800/40 to-zinc-800/30') +
                  ' transition-transform'
                }
              >
                <div
                  className={
                    (isPremium
                      ? 'h-full rounded-[calc(1rem-1px)] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-purple-300/30 shadow-2xl'
                      : 'h-full rounded-[calc(1rem-1px)] bg-zinc-900 border border-zinc-800') +
                    (isPremium ? ' transform scale-[1.02]' : ' hover:border-purple-500/60 hover:-translate-y-0.5')
                  }
                >
                  {plan.badge ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-yellow-300 px-6 py-1 text-[12px] font-extrabold tracking-wide text-black shadow">
                        {plan.badge}
                      </span>
                    </div>
                  ) : null}

                  <div className="p-8">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-semibold">{plan.title}</h3>
                    </div>

                    <div className="mt-4 mb-6">
                      <div className="text-5xl font-bold tracking-tight">{plan.price}</div>
                      {!isPremium && (
                        <div className="mt-2 text-sm text-zinc-400">One-time payment</div>
                      )}
                      {isPremium && <div className="mt-2 text-sm text-purple-200/90">Best value for most brands</div>}
                    </div>

                    <ul className="space-y-3 text-zinc-200">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10">
                            <Check
                              className={
                                isPremium
                                  ? 'h-4 w-4 text-emerald-300'
                                  : 'h-4 w-4 text-emerald-400'
                              }
                            />
                          </span>
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => onChoose(plan.key)}
                      className={
                        isPremium
                          ? 'mt-8 w-full rounded-2xl bg-white/95 px-4 py-4 text-black font-semibold transition-all hover:brightness-95 hover:scale-[1.01]'
                          : 'mt-8 w-full rounded-2xl bg-zinc-800 px-4 py-4 text-white font-medium transition-all hover:bg-white hover:text-black hover:scale-[1.01]'
                      }
                    >
                      {plan.cta}
                    </button>

                    <div className="mt-4 text-xs text-zinc-500">
                      WhatsApp opens with your chosen package details.
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-3xl font-semibold">Monthly Hosting &amp; Maintenance</h3>
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="bg-zinc-900 border border-zinc-800 px-10 py-6 rounded-3xl">
              <p className="text-zinc-400">Basic</p>
              <p className="text-3xl font-bold mt-1">
                ₹1,499 <span className="text-base text-zinc-400">/month</span>
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-violet-600 px-10 py-6 rounded-3xl scale-110 shadow-xl">
              <p className="text-white font-medium">Pro - Recommended</p>
              <p className="text-3xl font-bold mt-1 text-white">
                ₹2,999 <span className="text-base">/month</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

