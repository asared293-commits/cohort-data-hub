import React from 'react';
import { ShoppingCart, CheckCircle, Network, ArrowRight } from 'lucide-react';
import { LINKS } from '../data/constants';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'CHOOSE YOUR BUNDLE',
      description: 'Find the data package you need.',
      badge: 'Step 1',
    },
    {
      number: '02',
      title: 'ORDER ONLINE',
      description: 'Click Buy Data and complete your purchase through our shop.',
      badge: 'Step 2',
    },
    {
      number: '03',
      title: 'STAY CONNECTED',
      description: 'Join Cohort Tech and receive useful updates, opportunities and tech content.',
      badge: 'Step 3',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#0e141b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <span>SIMPLE & TRANSPARENT</span>
          </div>

          <h2
            id="how-it-works-heading"
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-4"
          >
            How It Works
          </h2>

          <p className="text-base sm:text-lg text-slate-300">
            From picking your network to unlocking tech community resources in three simple steps.
          </p>
        </div>

        {/* 3-Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-7 sm:p-8 relative flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/20 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-200">
                    {step.number}
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                    {step.badge}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Fast & Reliable</span>
                <span className="text-emerald-400 font-bold">✓ Direct</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
