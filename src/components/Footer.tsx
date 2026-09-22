import React from 'react';
import { ShoppingCart, Users, Bell, HelpCircle, ShieldCheck, Database, ExternalLink, Lock } from 'lucide-react';
import { LINKS } from '../data/constants';

interface FooterProps {
  onOpenAlerts: () => void;
  onOpenCommunity: () => void;
  onOpenFaq: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenUnsubscribe: () => void;
  onOpenAudienceStats?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAlerts,
  onOpenCommunity,
  onOpenFaq,
  onOpenPrivacy,
  onOpenTerms,
  onOpenUnsubscribe,
  onOpenAudienceStats,
  onOpenAdmin,
}) => {
  return (
    <footer
      id="main-footer"
      className="bg-white border-t border-slate-200 pt-10 pb-20 md:pb-12 text-slate-500 text-xs sm:text-sm"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-display font-black text-white text-xs">
                CT
              </div>
              <span className="font-display font-black text-base text-slate-900 tracking-tight">
                COHORT TECH DATA HUB
              </span>
            </div>

            <p className="font-display font-bold text-xs sm:text-sm text-emerald-700">
              &quot;Cheap Data. Smart Connections. Bigger Opportunities.&quot;
            </p>

            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Ghana&apos;s mobile data marketplace connected to an active technology community for AI, cybersecurity, coding, and remote jobs.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider">
              Shopping & Alerts
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={LINKS.DATA_SHOP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-emerald-700 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Buy Data (CheapData Shop)</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAlerts}
                  className="text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span>Deal Alerts (SMS & Email)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCommunity}
                  className="text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-sky-500" />
                  <span>Community Benefits</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFaq}
                  className="text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>How It Works & FAQ</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy Column */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider">
              Privacy & Channels
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={LINKS.TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-sky-600 flex items-center gap-1.5 transition-colors"
                >
                  <span>Telegram Community</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href={LINKS.WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>WhatsApp Updates</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenUnsubscribe}
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Unsubscribe
                </button>
              </li>
              {onOpenAudienceStats && (
                <li className="pt-1">
                  <button
                    onClick={onOpenAudienceStats}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700"
                  >
                    <Database className="w-3 h-3" />
                    <span>Database Metrics</span>
                  </button>
                </li>
              )}
              {onOpenAdmin && (
                <li className="pt-0.5">
                  <button
                    onClick={onOpenAdmin}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-700 transition-colors"
                  >
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Admin Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © 2026 Cohort Tech Data Hub. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Built for Ghanaian tech creators & builders</span>
            <span>🇬🇭</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
