import React from 'react';
import { ShoppingCart, Users, CheckCircle2, Wifi, Zap, Cpu, Sparkles, ArrowDown } from 'lucide-react';
import { LINKS } from '../data/constants';

export const Hero: React.FC = () => {
  const handleScrollToCommunity = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector('#community');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const trustIndicators = [
    '✓ Affordable bundles',
    '✓ Easy online ordering',
    '✓ Mobile Money',
    '✓ Tech community',
  ];

  return (
    <section
      id="home"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-tech-grid"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] md:w-[900px] h-[450px] bg-radial-gradient pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Animated Tech Nodes / Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-30">
        <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <div className="absolute top-44 right-[20%] w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
        <div className="absolute bottom-20 left-[35%] w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        <div className="absolute top-1/2 right-[10%] w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Badge */}
            <div
              id="hero-ghana-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm shadow-emerald-900/30"
            >
              <span className="text-base leading-none">🇬🇭</span>
              <span className="tracking-wide uppercase font-mono text-[11px] sm:text-xs">
                GHANA'S SMART DATA & TECH COMMUNITY
              </span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-headline"
              className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-[62px] text-white tracking-tight leading-[1.08] mb-4"
            >
              CHEAP DATA.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                SMARTER CONNECTIONS. 🚀
              </span>
            </h1>

            {/* Alternative Supporting Headline */}
            <p className="text-lg sm:text-xl font-medium text-emerald-300/95 mb-4 leading-relaxed font-display">
              Affordable data bundles for staying connected — plus a tech community that helps you learn, build and grow.
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Get affordable MTN, Telecel and AirtelTigo data bundles from Cohort Tech Data Hub, then stay connected to technology news, AI tools, cybersecurity tips, programming resources and opportunities.
            </p>

            {/* Primary & Secondary Buttons */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <a
                href={LINKS.DATA_SHOP}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-buy-data-btn"
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-display font-extrabold text-base bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>🛒 BUY DATA NOW</span>
              </a>

              <a
                href="#community"
                onClick={handleScrollToCommunity}
                id="hero-join-community-btn"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-display font-bold text-base bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-emerald-500/50 shadow-md shadow-black/40 hover:-translate-y-0.5 transition-all"
              >
                <Users className="w-5 h-5 text-emerald-400" />
                <span>📲 JOIN COHORT TECH</span>
              </a>
            </div>

            {/* Small Trust Indicators */}
            <div
              id="hero-trust-indicators"
              className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-5 gap-y-2.5 pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 font-medium"
            >
              {trustIndicators.map((indicator, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{indicator.replace('✓ ', '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Brand Card / Interactive Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Background Decorative Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full border border-emerald-500/10 animate-spin [animation-duration:30s]" />
              <div className="w-96 h-96 rounded-full border border-teal-500/10" />
            </div>

            {/* Card Container */}
            <div className="relative w-full max-w-md bg-[#0e151d]/90 backdrop-blur-xl border border-emerald-500/25 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-emerald-950/40">
              {/* Header inside Card */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img
                    src="/src/assets/images/cohort_tech_badge_1789968237864.jpg"
                    alt="Cohort Tech Data Hub Emblem"
                    className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/40 shadow-md shadow-emerald-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-display font-extrabold text-white text-base">
                      COHORT TECH DATA HUB
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live External Shop Link Active
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  GHS (GH₵)
                </span>
              </div>

              {/* Sample Quick Highlights */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-yellow-500/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-yellow-400/10 text-yellow-400 font-bold text-xs flex items-center justify-center border border-yellow-400/20">
                      MTN
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">1GB Top-Up</div>
                      <div className="text-[11px] text-slate-400">Non-expiry data</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-400">GH₵ 5.00</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-500/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-red-400/10 text-red-400 font-bold text-xs flex items-center justify-center border border-red-400/20">
                      TEL
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">10GB Mega Bundle</div>
                      <div className="text-[11px] text-slate-400">Non-expiry data</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-400">GH₵ 45.00</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-sky-400/10 text-sky-400 font-bold text-xs flex items-center justify-center border border-sky-400/20">
                      AT
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">1GB AirtelTigo</div>
                      <div className="text-[11px] text-slate-400">Direct top-up</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-400">GH₵ 5.50</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/30 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Community Hub Integration
                </div>
                <p className="text-[11px] text-slate-300">
                  Every bundle purchase connects you to high-value AI, programming, and cybersecurity resources!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
