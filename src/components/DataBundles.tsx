import React, { useState, useMemo, useRef } from 'react';
import {
  ExternalLink,
  Bell,
  Users,
  Zap,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { DATA_BUNDLES, LINKS } from '../data/constants';
import { NetworkType, DataBundle } from '../types';
import { NetworkSelector } from './NetworkSelector';
import { ProductCard } from './ProductCard';
import { SpecialOffersSection } from './SpecialOffersSection';

interface DataBundlesProps {
  onOpenAlerts: () => void;
  onOpenCommunity: () => void;
}

type SortOption = 'recommended' | 'lowest-price' | 'highest-data';

export const DataBundles: React.FC<DataBundlesProps> = ({
  onOpenAlerts,
  onOpenCommunity,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('MTN');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter bundles for selected network
  const networkBundles = useMemo(() => {
    return DATA_BUNDLES.filter((b) => b.network === selectedNetwork);
  }, [selectedNetwork]);

  // Popular bundles for top horizontal carousel
  const popularBundles = useMemo(() => {
    return networkBundles.filter((b) => b.popular);
  }, [networkBundles]);

  // Sorted bundles for full grid
  const sortedBundles = useMemo(() => {
    const list = [...networkBundles];
    switch (sortBy) {
      case 'lowest-price':
        return list.sort((a, b) => a.priceGhs - b.priceGhs);
      case 'highest-data':
        return list.sort((a, b) => b.dataGb - a.dataGb);
      case 'recommended':
      default:
        return list;
    }
  }, [networkBundles, sortBy]);

  const networkNameDisplay = useMemo(() => {
    switch (selectedNetwork) {
      case 'MTN':
        return 'MTN';
      case 'TELECEL':
        return 'Telecel';
      case 'AIRTELTIGO':
        return 'AT';
    }
  }, [selectedNetwork]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="data-bundles" className="py-4 sm:py-6 max-w-6xl mx-auto px-3.5 sm:px-6">
      {/* Short Headline (Bright, clean, modern) */}
      <div className="text-center max-w-xl mx-auto mb-5">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1.5">
          <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
          <span>INSTANT GHANA MOBILE TOP-UPS</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Affordable Data. Stay Connected.
        </h1>
      </div>

      {/* Dynamic Firestore-Connected Special Offers Carousel */}
      <SpecialOffersSection onOpenAlerts={onOpenAlerts} />

      {/* Network Swipe Selector */}
      <div className="mb-5 max-w-lg mx-auto">
        <NetworkSelector
          selectedNetwork={selectedNetwork}
          onSelectNetwork={setSelectedNetwork}
        />
      </div>

      {/* Horizontal "Popular Bundles" Carousel */}
      {popularBundles.length > 0 && (
        <div className="mb-6 p-3 sm:p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Popular {networkNameDisplay} Offers
              </h2>
            </div>

            {/* Desktop scroll arrows */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scrollCarousel('left')}
                aria-label="Previous offers"
                className="p-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                aria-label="Next offers"
                className="p-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Swipeable Carousel */}
          <div
            ref={carouselRef}
            className="flex items-stretch gap-2.5 overflow-x-auto pb-1 scrollbar-none snap-x"
          >
            {popularBundles.map((bundle) => (
              <ProductCard key={`pop-${bundle.id}`} bundle={bundle} variant="carousel" />
            ))}
          </div>
        </div>
      )}

      {/* Main Grid Header: Title, Count, and Sort Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-black text-base sm:text-lg text-slate-900">
            All {networkNameDisplay} Bundles
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {sortedBundles.length} available
          </span>
        </div>

        {/* Compact Sort Control */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            id="sort-by-select"
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="recommended">Recommended</option>
            <option value="lowest-price">Lowest Price</option>
            <option value="highest-data">Highest Data</option>
          </select>
        </div>
      </div>

      {/* Compact Product Cards Grid: 1 col mobile, 2-3 col tablet, 3-4 col desktop */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6"
        id="product-cards-grid"
      >
        {sortedBundles.map((bundle) => (
          <ProductCard key={bundle.id} bundle={bundle} variant="standard" />
        ))}
      </div>

      {/* Secondary Action Buttons Below Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto pt-2 mb-4">
        {/* Deal Alerts trigger button */}
        <button
          onClick={onOpenAlerts}
          id="btn-trigger-alerts-modal"
          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 shadow-2xs transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                🔔 DEAL ALERTS
              </div>
              <div className="text-[11px] text-slate-500">
                SMS & email alerts for price drops
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 underline shrink-0">
            Subscribe
          </span>
        </button>

        {/* Community trigger button */}
        <button
          onClick={onOpenCommunity}
          id="btn-trigger-community-modal"
          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-2xs transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-sky-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-sky-800">
                🌐 COHORT TECH COMMUNITY
              </div>
              <div className="text-[11px] text-slate-500">
                AI tools, remote jobs & tech updates
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-700 underline shrink-0">
            Explore
          </span>
        </button>
      </div>
    </section>
  );
};
