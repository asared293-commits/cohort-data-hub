import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  Sparkles,
  Gift,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  customerService,
  getStoredSubscriber,
  isOfferActiveDate,
} from '../services/customerService';
import { SpecialOfferDoc } from '../types/customer';
import { LINKS } from '../data/constants';

interface SpecialOffersSectionProps {
  onOpenAlerts: () => void;
}

export const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({
  onOpenAlerts,
}) => {
  const [allOffers, setAllOffers] = useState<SpecialOfferDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [verifyingOfferId, setVerifyingOfferId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [subscriberStatus, setSubscriberStatus] = useState(() => getStoredSubscriber());
  const carouselRef = useRef<HTMLDivElement>(null);

  // Sync subscriber recognition state when user subscribes via modal or storage changes
  useEffect(() => {
    const checkSubscriber = () => {
      setSubscriberStatus(getStoredSubscriber());
    };

    window.addEventListener('cohort_subscription_updated', checkSubscriber);
    window.addEventListener('storage', checkSubscriber);
    return () => {
      window.removeEventListener('cohort_subscription_updated', checkSubscriber);
      window.removeEventListener('storage', checkSubscriber);
    };
  }, []);

  // Real-time Firestore subscription to collection 'special_offers'
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = customerService.subscribeToSpecialOffers(
      (offers) => {
        setAllOffers(offers);
        setIsLoading(false);
        setLoadError(null);
      },
      (error) => {
        console.warn('Special offers subscription notice:', error);
        setIsLoading(false);
        // Fail gracefully without crashing data catalog
        setLoadError('Unable to load current promotional deals.');
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Filter active and eligible offers in real-time
  const { eligibleOffers, hasRestrictedTeaser } = useMemo(() => {
    const now = new Date();
    // 1. Filter only active offers within date ranges
    const activeOffers = allOffers.filter((offer) => isOfferActiveDate(offer, now));

    const isVip = subscriberStatus.loyaltyTier === 'special_offers';

    const eligible: SpecialOfferDoc[] = [];
    let restrictedCount = 0;

    for (const offer of activeOffers) {
      const audience = offer.targetAudience || 'all';
      if (audience === 'special_offers') {
        if (isVip) {
          eligible.push(offer);
        } else {
          restrictedCount++;
        }
      } else {
        // 'all' or 'standard'
        eligible.push(offer);
      }
    }

    return {
      eligibleOffers: eligible,
      hasRestrictedTeaser: restrictedCount > 0 && !isVip,
    };
  }, [allOffers, subscriberStatus]);

  // Carousel scroll controls
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Secure Buy Now handler with Firestore Price Protection & Eligibility Verification
  const handleBuyNow = async (offer: SpecialOfferDoc) => {
    setActionNotice(null);
    setVerifyingOfferId(offer.id);

    try {
      // Re-verify directly against Firestore document
      const verification = await customerService.verifyOfferForPurchase(
        offer.id,
        subscriberStatus.loyaltyTier
      );

      if (!verification.verified || !verification.offer) {
        setActionNotice({
          type: 'error',
          message: verification.error || 'This special offer has ended or is no longer available.',
        });
        setVerifyingOfferId(null);
        return;
      }

      const verifiedOffer = verification.offer;

      // Safe short delay for visual confirmation of price protection
      setTimeout(() => {
        // Direct seamless handoff to purchase flow with verified offer reference
        const checkoutUrl = `${LINKS.DATA_SHOP}?ref=special_offer&id=${encodeURIComponent(
          verifiedOffer.id
        )}&net=${encodeURIComponent(verifiedOffer.network)}&bundle=${encodeURIComponent(
          verifiedOffer.dataAmount
        )}&price=${verifiedOffer.specialPrice}`;

        window.location.href = checkoutUrl;
      }, 350);
    } catch (err: any) {
      console.warn('Purchase verification error:', err);
      setActionNotice({
        type: 'error',
        message: 'Could not verify special offer right now. Please try again.',
      });
      setVerifyingOfferId(null);
    }
  };

  // Helper for Network-specific visual color styling
  const getNetworkColorStyle = (network: string) => {
    switch (network.toUpperCase()) {
      case 'MTN':
        return {
          cardBg: 'bg-amber-50/20 hover:bg-amber-50/40',
          borderColor: 'border-amber-300 hover:border-amber-400',
          badgeBg: 'bg-[#FFCC00] text-slate-950 font-black',
          specialPriceColor: 'text-amber-800',
          saveChipBg: 'bg-amber-100 text-amber-900 border-amber-300',
          btnBg: 'bg-[#FFCC00] hover:bg-[#F5BD00] text-slate-950 font-black border border-[#E6B800] shadow-xs shadow-amber-400/20',
          networkLabel: 'MTN',
          networkEmoji: '🟡',
        };
      case 'TELECEL':
        return {
          cardBg: 'bg-red-50/20 hover:bg-red-50/40',
          borderColor: 'border-red-300 hover:border-red-400',
          badgeBg: 'bg-[#E60000] text-white font-bold',
          specialPriceColor: 'text-[#E60000]',
          saveChipBg: 'bg-red-50 text-red-800 border-red-200',
          btnBg: 'bg-[#E60000] hover:bg-[#CC0000] text-white font-bold border border-red-700 shadow-xs shadow-red-500/20',
          networkLabel: 'Telecel',
          networkEmoji: '🔴',
        };
      case 'AIRTELTIGO':
        return {
          cardBg: 'bg-sky-50/20 hover:bg-sky-50/40',
          borderColor: 'border-sky-300 hover:border-sky-400',
          badgeBg: 'bg-[#0284C7] text-white font-bold',
          specialPriceColor: 'text-[#0284C7]',
          saveChipBg: 'bg-sky-50 text-sky-800 border-sky-200',
          btnBg: 'bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold border border-sky-700 shadow-xs shadow-sky-500/20',
          networkLabel: 'AT',
          networkEmoji: '🔵',
        };
      default:
        return {
          cardBg: 'bg-emerald-50/20 hover:bg-emerald-50/40',
          borderColor: 'border-emerald-300 hover:border-emerald-400',
          badgeBg: 'bg-emerald-600 text-white font-bold',
          specialPriceColor: 'text-emerald-700',
          saveChipBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold border border-emerald-700 shadow-xs shadow-emerald-500/20',
          networkLabel: 'All Networks',
          networkEmoji: '⚡',
        };
    }
  };

  // 1. Loading State: Display compact skeleton cards
  if (isLoading) {
    return (
      <div className="mb-6 p-3.5 sm:p-4 bg-gradient-to-r from-amber-50/40 via-white to-amber-50/30 border border-amber-200/80 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-md bg-amber-200 animate-pulse" />
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="w-44 sm:w-48 h-40 rounded-xl bg-white border border-slate-200 p-3 flex flex-col justify-between shrink-0 animate-pulse"
            >
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="space-y-1.5 my-2">
                <div className="h-5 w-20 bg-slate-200 rounded" />
                <div className="h-4 w-28 bg-slate-200 rounded" />
              </div>
              <div className="h-7 w-full bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State: Gracefully hide or don't crash
  if (loadError) {
    return null;
  }

  // 3. Empty State: If no eligible offers and no restricted teaser, hide section completely
  if (eligibleOffers.length === 0 && !hasRestrictedTeaser) {
    return null;
  }

  return (
    <div
      id="special-offers-section"
      className="mb-6 p-3.5 sm:p-4.5 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 border border-amber-200 rounded-2xl shadow-2xs relative overflow-hidden"
    >
      {/* Decorative subtle background icon */}
      <Flame className="absolute -right-4 -bottom-4 w-32 h-32 text-amber-500/5 pointer-events-none" />

      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Flame className="w-4 h-4 fill-white text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-black text-sm sm:text-base text-slate-900 tracking-tight">
                SPECIAL OFFERS
              </h2>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wide">
                LIMITED-TIME
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Limited-time promotional deals from Cohort Tech
            </p>
          </div>
        </div>

        {/* Desktop Carousel Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scrollCarousel('left')}
            aria-label="Previous offers"
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollCarousel('right')}
            aria-label="Next offers"
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification / Action Notice Alert */}
      {actionNotice && (
        <div
          className={`mb-3 p-2.5 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in duration-150 ${
            actionNotice.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {actionNotice.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          )}
          <span className="font-medium">{actionNotice.message}</span>
        </div>
      )}

      {/* Horizontal Touch Carousel (1-2 cards visible on mobile, 3-4 on desktop) */}
      <div
        ref={carouselRef}
        className="flex items-stretch gap-2.5 sm:gap-3.5 overflow-x-auto pb-1 scrollbar-none snap-x relative z-10"
      >
        {eligibleOffers.map((offer) => {
          const style = getNetworkColorStyle(offer.network);
          const savings = Math.max(0, offer.normalPrice - offer.specialPrice);
          const isVipOffer = offer.targetAudience === 'special_offers';
          const isVerifying = verifyingOfferId === offer.id;

          return (
            <div
              key={`special-${offer.id}`}
              id={`special-offer-card-${offer.id}`}
              className={`w-[210px] sm:w-[230px] md:w-[245px] shrink-0 snap-start rounded-xl p-3 sm:p-3.5 border ${style.borderColor} ${style.cardBg} bg-white shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col justify-between group`}
            >
              {/* Header: Network badge & Promo pill */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md ${style.badgeBg}`}
                >
                  <span>{style.networkEmoji}</span>
                  <span>{style.networkLabel}</span>
                </span>

                <span
                  className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border ${
                    isVipOffer
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {isVipOffer ? '⭐ VIP DEAL' : '🔥 SPECIAL OFFER'}
                </span>
              </div>

              {/* Data Amount & Title */}
              <div className="my-1">
                <div className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight leading-tight">
                  {offer.dataAmount}
                </div>
                <div className="text-[11px] font-bold text-slate-700 line-clamp-1 mt-0.5">
                  {offer.offerName}
                </div>
              </div>

              {/* Price & Savings Display */}
              <div className="my-2 p-2 rounded-lg bg-slate-50/80 border border-slate-100 flex items-end justify-between gap-1">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Normal Price</div>
                  <div className="text-xs text-slate-400 font-semibold line-through">
                    GH₵{offer.normalPrice.toFixed(2)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Special Price
                  </div>
                  <div
                    className={`text-lg sm:text-xl font-black font-display leading-tight ${style.specialPriceColor}`}
                  >
                    GH₵{offer.specialPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Savings Badge */}
              {savings > 0 && (
                <div className="mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md ${style.saveChipBg}`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>SAVE GH₵{savings.toFixed(2)}</span>
                  </span>
                </div>
              )}

              {/* Buy Now Button (Verified price protection) */}
              <button
                onClick={() => handleBuyNow(offer)}
                disabled={isVerifying}
                id={`btn-buy-special-${offer.id}`}
                className={`w-full py-2 px-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-98 ${style.btnBg}`}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>BUY NOW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}

        {/* Section 10: Restricted Special-Offer Customer Teaser Card */}
        {hasRestrictedTeaser && (
          <div
            id="special-offers-vip-teaser"
            className="w-[210px] sm:w-[230px] shrink-0 snap-start rounded-xl p-3.5 border border-purple-200 bg-gradient-to-br from-purple-50/80 via-white to-amber-50/50 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Gift className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-purple-900 bg-purple-100/80 px-2 py-0.5 rounded">
                  RETURNING VIP DEALS
                </span>
              </div>

              <div className="text-sm font-black text-slate-900 leading-snug mb-1">
                More Deals Available
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                🎁 Special offers are available to returning subscribers.
              </p>
            </div>

            <button
              onClick={onOpenAlerts}
              id="btn-unlock-special-offers"
              className="mt-3 w-full py-2 px-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1 shadow-xs transition-colors"
            >
              <span>GET SPECIAL OFFERS</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
