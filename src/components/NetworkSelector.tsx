import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NetworkType } from '../types';

interface NetworkSelectorProps {
  selectedNetwork: NetworkType;
  onSelectNetwork: (network: NetworkType) => void;
}

interface NetworkConfig {
  id: NetworkType;
  name: string;
  fullName: string;
  dotColor: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
  activeShadow: string;
  inactiveBg: string;
  inactiveText: string;
  badgeText: string;
}

export const NETWORKS: NetworkConfig[] = [
  {
    id: 'MTN',
    name: 'MTN',
    fullName: 'MTN Ghana',
    dotColor: '#FFCC00',
    activeBg: 'bg-[#FFCC00]',
    activeText: 'text-slate-950 font-black',
    activeBorder: 'border-[#E6B800]',
    activeShadow: 'shadow-md shadow-amber-400/30 ring-2 ring-[#FFCC00]/50',
    inactiveBg: 'bg-white',
    inactiveText: 'text-slate-700 hover:text-slate-900',
    badgeText: '🟡 MTN',
  },
  {
    id: 'TELECEL',
    name: 'TELECEL',
    fullName: 'Telecel Ghana',
    dotColor: '#E60000',
    activeBg: 'bg-[#E60000]',
    activeText: 'text-white font-black',
    activeBorder: 'border-[#CC0000]',
    activeShadow: 'shadow-md shadow-red-500/30 ring-2 ring-[#E60000]/40',
    inactiveBg: 'bg-white',
    inactiveText: 'text-slate-700 hover:text-slate-900',
    badgeText: '🔴 TELECEL',
  },
  {
    id: 'AIRTELTIGO',
    name: 'AT',
    fullName: 'AirtelTigo (AT)',
    dotColor: '#0284C7',
    activeBg: 'bg-[#0284C7]',
    activeText: 'text-white font-black',
    activeBorder: 'border-[#0369A1]',
    activeShadow: 'shadow-md shadow-sky-500/30 ring-2 ring-[#0284C7]/40',
    inactiveBg: 'bg-white',
    inactiveText: 'text-slate-700 hover:text-slate-900',
    badgeText: '🔵 AT',
  },
];

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  onSelectNetwork,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const currentIndex = NETWORKS.findIndex((n) => n.id === selectedNetwork);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + NETWORKS.length) % NETWORKS.length;
    onSelectNetwork(NETWORKS[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % NETWORKS.length;
    onSelectNetwork(NETWORKS[nextIdx].id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Minimum swipe threshold 35px
    if (diff > 35) {
      handleNext();
    } else if (diff < -35) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full select-none" id="network-swipe-selector">
      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span>Select Network Provider</span>
          <span className="text-[10px] font-medium text-slate-400">
            (Swipe or tap)
          </span>
        </span>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            aria-label="Previous Network"
            className="p-1 sm:p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Network"
            className="p-1 sm:p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Swipeable Tabs Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 border border-slate-200/90 rounded-2xl shadow-inner"
      >
        {NETWORKS.map((net) => {
          const isSelected = net.id === selectedNetwork;

          return (
            <button
              key={net.id}
              onClick={() => onSelectNetwork(net.id)}
              id={`tab-network-${net.id.toLowerCase()}`}
              className={`relative flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-2 rounded-xl text-xs sm:text-sm transition-all duration-200 ${
                isSelected
                  ? `${net.activeBg} ${net.activeText} ${net.activeBorder} ${net.activeShadow} border scale-[1.02]`
                  : `${net.inactiveBg} ${net.inactiveText} border border-slate-200/60 hover:border-slate-300 shadow-2xs`
              }`}
            >
              <span className="text-sm leading-none">
                {net.id === 'MTN' && '🟡'}
                {net.id === 'TELECEL' && '🔴'}
                {net.id === 'AIRTELTIGO' && '🔵'}
              </span>
              <span className="truncate">{net.name}</span>
            </button>
          );
        })}
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {NETWORKS.map((net, idx) => (
          <button
            key={net.id}
            onClick={() => onSelectNetwork(net.id)}
            aria-label={`Go to ${net.name}`}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-6 bg-slate-900'
                : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
