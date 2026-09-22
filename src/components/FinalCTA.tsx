import React from 'react';
import { ShoppingCart, Users, Sparkles, ExternalLink } from 'lucide-react';
import { LINKS } from '../data/constants';

export const FinalCTA: React.FC = () => {
  return (
    <section id="final-cta" className="py-20 md:py-28 bg-[#0b1015] relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-600/20 via-teal-600/15 to-emerald-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#0f1a24] via-slate-900 to-[#0c1f1c] border-2 border-emerald-500/40 p-8 sm:p-14 md:p-16 text-center shadow-2xl shadow-emerald-950/50 relative overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>COMMUNITY + DATA CONVERGENCE</span>
            </div>

            <h2
              id="final-cta-heading"
              className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight mb-4"
            >
              READY TO STAY CONNECTED? 🚀
            </h2>

            <p className="font-display font-medium text-lg sm:text-2xl text-slate-300 mb-10">
              Get your data. Join the community. Discover what's next.
            </p>

            {/* Buttons: Buy Data Now & Join Cohort Tech */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={LINKS.DATA_SHOP}
                target="_blank"
                rel="noopener noreferrer"
                id="final-cta-buy-data-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4.5 rounded-2xl font-display font-extrabold text-base sm:text-lg bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>🛒 BUY DATA NOW</span>
              </a>

              <a
                href={LINKS.TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                id="final-cta-join-tech-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl font-display font-bold text-base sm:text-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-emerald-500/50 shadow-lg shadow-black/40 hover:scale-[1.02] transition-all"
              >
                <Users className="w-5 h-5 text-sky-400" />
                <span>📲 JOIN COHORT TECH</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
