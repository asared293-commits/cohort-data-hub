import React, { useState, useEffect } from 'react';
import { ShoppingCart, Bell, Menu } from 'lucide-react';
import { LINKS } from '../data/constants';

interface StickyMobileBarProps {
  onOpenAlerts: () => void;
  onOpenMenu: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  onOpenAlerts,
  onOpenMenu,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after user starts scrolling
      setIsVisible(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="sticky-mobile-cta-bar"
      className="fixed bottom-2 left-3 right-3 z-40 md:hidden animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="h-14 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-2.5 shadow-md shadow-slate-400/20 flex items-center justify-between gap-2">
        {/* Main 🛒 BUY DATA button */}
        <a
          href={LINKS.DATA_SHOP}
          target="_blank"
          rel="noopener noreferrer"
          id="mobile-sticky-buy-btn"
          className="flex-1 h-9.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>🛒 BUY DATA</span>
        </a>

        {/* 🔔 ALERTS Button */}
        <button
          onClick={onOpenAlerts}
          id="mobile-sticky-alerts-btn"
          className="h-9.5 px-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 font-bold text-xs flex items-center justify-center gap-1 shrink-0 active:scale-95 transition-colors"
          aria-label="Deal Alerts"
        >
          <Bell className="w-3.5 h-3.5 text-amber-600" />
          <span>ALERTS</span>
        </button>

        {/* ☰ MENU Button */}
        <button
          onClick={onOpenMenu}
          id="mobile-sticky-menu-btn"
          className="w-9.5 h-9.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 active:scale-95 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
