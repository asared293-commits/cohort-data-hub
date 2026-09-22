import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Users, Bell, HelpCircle, ExternalLink } from 'lucide-react';
import { LINKS } from '../data/constants';

interface NavbarProps {
  onOpenAlerts: () => void;
  onOpenCommunity: () => void;
  onOpenFaq: () => void;
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAlerts,
  onOpenCommunity,
  onOpenFaq,
  isMenuOpen,
  onToggleMenu,
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);

  const menuOpen = isMenuOpen !== undefined ? isMenuOpen : internalMenuOpen;
  const toggleMenu = () => {
    if (onToggleMenu) {
      onToggleMenu();
    } else {
      setInternalMenuOpen(!internalMenuOpen);
    }
  };

  const closeMenu = () => {
    if (onToggleMenu && isMenuOpen) {
      onToggleMenu();
    } else {
      setInternalMenuOpen(false);
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
    >
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo */}
          <a
            href="/"
            className="flex items-center gap-2 group"
            id="brand-logo-link"
          >
            {/* Tech Logo Icon */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px] shadow-sm shadow-emerald-500/20">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                <span className="font-extrabold text-emerald-600 text-sm tracking-tight font-display">
                  CT
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm sm:text-base text-slate-900 tracking-tight">
                COHORT TECH
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                DATA HUB
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600">
            <button
              onClick={onOpenAlerts}
              className="px-3 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>Deal Alerts</span>
            </button>
            <button
              onClick={onOpenCommunity}
              className="px-3 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Community</span>
            </button>
            <button
              onClick={onOpenFaq}
              className="px-3 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Help & FAQ</span>
            </button>
          </nav>

          {/* Right Action & Hamburger */}
          <div className="flex items-center gap-2">
            {/* Primary Buy Data Button */}
            <a
              href={LINKS.DATA_SHOP}
              target="_blank"
              rel="noopener noreferrer"
              id="navbar-buy-data-btn"
              className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>🛒 BUY DATA</span>
            </a>

            {/* Hamburger Button */}
            <button
              id="mobile-hamburger-btn"
              onClick={toggleMenu}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors md:hidden"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Drawer Menu */}
      {menuOpen && (
        <div
          id="mobile-drawer-menu"
          className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex flex-col space-y-1 py-1 text-sm font-semibold text-slate-800">
            <a
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <span className="text-base">🏠</span>
              <span>Home</span>
            </a>

            <a
              href={LINKS.DATA_SHOP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4 text-emerald-700" />
                <span>🛒 Buy Data (Direct Shop)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            </a>

            <button
              onClick={() => {
                closeMenu();
                onOpenAlerts();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition-colors"
            >
              <span className="text-base">🔔</span>
              <span>Data Alerts (SMS & Email)</span>
            </button>

            <button
              onClick={() => {
                closeMenu();
                onOpenCommunity();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition-colors"
            >
              <span className="text-base">🌐</span>
              <span>Cohort Tech Community</span>
            </button>

            <a
              href={LINKS.TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">📱</span>
                <span>Telegram Channel</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={LINKS.WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">💬</span>
                <span>WhatsApp Updates</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={() => {
                closeMenu();
                onOpenFaq();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition-colors"
            >
              <span className="text-base">ℹ️</span>
              <span>About / How it Works / FAQ</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
