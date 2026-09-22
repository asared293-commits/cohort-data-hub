import React from 'react';
import { Wifi, ArrowRight, Zap } from 'lucide-react';
import { LINKS } from '../data/constants';

export const SpecialOffer: React.FC = () => {
  return (
    <section id="need-data" className="py-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-y border-emerald-500/30 relative overflow-hidden">
      {/* Background Subtle Wave Accent */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
          {/* Left Text */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Wifi className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 font-display font-black text-xl sm:text-2xl text-white tracking-wide">
                <span>📡 NEED DATA?</span>
              </div>
              <p className="text-slate-300 text-sm sm:text-base font-medium">
                Get connected in a few clicks.
              </p>
            </div>
          </div>

          {/* Right Button */}
          <div className="w-full md:w-auto">
            <a
              href={LINKS.DATA_SHOP}
              target="_blank"
              rel="noopener noreferrer"
              id="special-offer-cta-btn"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 hover:brightness-105 shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all"
            >
              <span>GET DATA NOW →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
