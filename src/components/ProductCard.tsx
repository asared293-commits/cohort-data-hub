import React, { useState } from 'react';
import { ShoppingCart, Loader2, ArrowRight } from 'lucide-react';
import { DataBundle } from '../types';
import { LINKS } from '../data/constants';

interface ProductCardProps {
  bundle: DataBundle;
  variant?: 'standard' | 'carousel';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  bundle,
  variant = 'standard',
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRedirecting(true);
    setTimeout(() => {
      window.location.href = LINKS.DATA_SHOP;
    }, 300);
  };

  // Network visual styling schemes
  const getNetworkStyles = () => {
    switch (bundle.network) {
      case 'MTN':
        return {
          cardBorder: 'border-amber-200 hover:border-amber-400',
          badgeBg: 'bg-[#FFCC00] text-slate-950 font-black',
          priceText: 'text-amber-700',
          btnBg: 'bg-[#FFCC00] hover:bg-[#F5BD00] text-slate-950 font-black border border-[#E6B800]',
          btnShadow: 'shadow-xs shadow-amber-400/20',
          tagBg: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'TELECEL':
        return {
          cardBorder: 'border-red-200 hover:border-red-400',
          badgeBg: 'bg-[#E60000] text-white font-bold',
          priceText: 'text-[#E60000]',
          btnBg: 'bg-[#E60000] hover:bg-[#CC0000] text-white font-bold border border-red-700',
          btnShadow: 'shadow-xs shadow-red-500/20',
          tagBg: 'bg-red-50 text-red-800 border-red-200',
        };
      case 'AIRTELTIGO':
        return {
          cardBorder: 'border-sky-200 hover:border-sky-400',
          badgeBg: 'bg-[#0284C7] text-white font-bold',
          priceText: 'text-[#0284C7]',
          btnBg: 'bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold border border-sky-700',
          btnShadow: 'shadow-xs shadow-sky-500/20',
          tagBg: 'bg-sky-50 text-sky-800 border-sky-200',
        };
    }
  };

  const styles = getNetworkStyles();

  // Carousel variant (compact horizontal slider card)
  if (variant === 'carousel') {
    return (
      <div
        id={`carousel-bundle-${bundle.id}`}
        className={`shrink-0 w-36 sm:w-40 bg-white rounded-xl p-3 border ${styles.cardBorder} shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            {bundle.network === 'MTN' && '🟡'}
            {bundle.network === 'TELECEL' && '🔴'}
            {bundle.network === 'AIRTELTIGO' && '🔵'}
            <span>{bundle.networkName}</span>
          </span>
          {bundle.tag && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
              {bundle.tag}
            </span>
          )}
        </div>

        <div className="my-1">
          <div className="text-xl font-black font-display text-slate-900 leading-tight">
            {bundle.size}
          </div>
          <div className="text-xs font-bold mt-0.5 flex items-baseline gap-0.5">
            <span className="text-[10px] text-slate-500">GH₵</span>
            <span className={`text-base font-black ${styles.priceText}`}>
              {bundle.priceGhs.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleBuyClick}
          disabled={isRedirecting}
          className={`w-full mt-2 py-1.5 px-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1 active:scale-98 ${styles.btnBg}`}
        >
          {isRedirecting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <span>BUY</span>
              <ArrowRight className="w-3 h-3" />
            </>
          )}
        </button>
      </div>
    );
  }

  // Standard Compact Marketplace Card (16px–20px padding)
  return (
    <div
      id={`bundle-card-${bundle.id}`}
      className={`group bg-white rounded-2xl p-4 sm:p-4.5 border ${styles.cardBorder} shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col justify-between relative`}
    >
      {/* 1. Network badge (with optional authentic tag) */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${styles.badgeBg}`}
        >
          {bundle.network === 'MTN' && '🟡'}
          {bundle.network === 'TELECEL' && '🔴'}
          {bundle.network === 'AIRTELTIGO' && '🔵'}
          <span>{bundle.networkName}</span>
        </span>

        {bundle.tag && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${styles.tagBg}`}
          >
            {bundle.tag}
          </span>
        )}
      </div>

      {/* 2. Data Amount */}
      <div className="mt-1 mb-0.5">
        <span className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
          {bundle.size}
        </span>
      </div>

      {/* 3. Price (Prominent GH₵ amount) */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xs sm:text-sm font-bold text-slate-500">GH₵</span>
          <span
            className={`text-2xl font-black font-display ${styles.priceText} tracking-tight`}
          >
            {bundle.priceGhs.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 4. Short Description */}
      <div className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span className="truncate">Non-expiry • Direct top-up</span>
      </div>

      {/* 5. BUY NOW Button */}
      <button
        onClick={handleBuyClick}
        disabled={isRedirecting}
        id={`btn-buy-now-${bundle.id}`}
        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-98 ${styles.btnBg} ${styles.btnShadow}`}
      >
        {isRedirecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Opening Shop...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span>🛒 BUY NOW</span>
          </>
        )}
      </button>
    </div>
  );
};
