import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { TRUST_POINTS } from '../data/constants';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust-section" className="py-16 md:py-20 bg-[#0e141b] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRANSPARENCY & STANDARDS</span>
          </div>

          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-2">
            Built on Honesty, Speed, and Community
          </h3>

          <p className="text-sm sm:text-base text-slate-400">
            No exaggerated claims or fake metrics — just verified, factual features designed for Ghanaian internet users.
          </p>
        </div>

        {/* Factual Trust Statements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {TRUST_POINTS.map((point, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-200">
                {point.replace('✓ ', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
