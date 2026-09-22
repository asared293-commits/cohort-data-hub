import React from 'react';
import { BadgeDollarSign, Zap, Smartphone, Rocket } from 'lucide-react';
import { WHY_US_CARDS } from '../data/constants';

export const WhyUs: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'affordable':
        return <BadgeDollarSign className="w-7 h-7 text-emerald-400" />;
      case 'easy':
        return <Zap className="w-7 h-7 text-amber-400" />;
      case 'convenient':
        return <Smartphone className="w-7 h-7 text-teal-400" />;
      case 'more-than-data':
        return <Rocket className="w-7 h-7 text-sky-400" />;
      default:
        return <Zap className="w-7 h-7 text-emerald-400" />;
    }
  };

  return (
    <section id="why-us" className="py-20 md:py-28 bg-[#0e141b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <span>THE COHORT ADVANTAGE</span>
          </div>

          <h2
            id="why-us-heading"
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-4"
          >
            Why Buy From Cohort Tech Data Hub?
          </h2>

          <p className="text-base sm:text-lg text-slate-300">
            Engineered for students, creators, professionals, and technology builders across Ghana.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {WHY_US_CARDS.map((card) => (
            <div
              key={card.id}
              id={`why-card-${card.id}`}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/30 group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mb-6 group-hover:bg-emerald-950/50 group-hover:border-emerald-500/30 transition-all">
                  {getIcon(card.id)}
                </div>

                <span className="inline-block text-xs font-bold tracking-wider text-emerald-400 uppercase mb-2 font-mono">
                  {card.badge}
                </span>

                <h3 className="font-display font-bold text-xl text-white mb-3">
                  {card.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center text-xs text-emerald-400/80 font-medium">
                Verified Community Value
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
