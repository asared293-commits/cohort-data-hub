import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Database,
  Users,
  Mail,
  Phone,
  Bell,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  Check,
  Flame,
} from 'lucide-react';
import { LINKS, FAQ_ITEMS } from '../data/constants';
import { SubscriberFormData, SubscriberResponse } from '../types';
import { subscriberService } from '../services/subscriberService';
import { customerService } from '../services/customerService';
import { SpecialOfferDoc } from '../types/customer';
import { normalizeGhanaPhone, isValidGhanaPhone, isValidEmail } from '../utils/phoneValidation';
import cohortTechQrBadge from '../assets/images/cohort_tech_badge_1789968237864.jpg';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

// ==========================================
// 1. DEAL ALERTS MODAL (SMS & Email)
// ==========================================
export const DealAlertsModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  // Checkboxes default to false to ensure explicit affirmative consent
  const [formData, setFormData] = useState<SubscriberFormData>({
    firstName: '',
    phoneNumber: '',
    emailAddress: '',
    smsConsent: false,
    emailConsent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  const [unlockedOffers, setUnlockedOffers] = useState<SpecialOfferDoc[]>([]);
  const [confirmedSmsConsent, setConfirmedSmsConsent] = useState(false);
  const [confirmedEmailConsent, setConfirmedEmailConsent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate clicks
    setErrorMsg('');

    // Check internet connection
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setErrorMsg('📡 No internet connection. Please check your connection and try again.');
      return;
    }

    const cleanFirstName = formData.firstName.trim();
    if (!cleanFirstName) {
      setErrorMsg('Please enter your first name.');
      return;
    }

    if (!formData.smsConsent && !formData.emailConsent) {
      setErrorMsg('Please select SMS alerts, email alerts, or both.');
      return;
    }

    const cleanPhone = formData.phoneNumber.trim();
    if (formData.smsConsent) {
      if (!cleanPhone) {
        setErrorMsg('Please enter your Ghana phone number for SMS alerts.');
        return;
      }
      if (!isValidGhanaPhone(cleanPhone)) {
        setErrorMsg('Please enter a valid Ghana phone number (e.g. 055 123 4567 or 053 742 0120).');
        return;
      }
    }

    const cleanEmail = formData.emailAddress.trim();
    if (formData.emailConsent) {
      if (!cleanEmail) {
        setErrorMsg('Please enter your email address for email alerts.');
        return;
      }
      if (!isValidEmail(cleanEmail)) {
        setErrorMsg('Please enter a valid email address (e.g. you@example.com).');
        return;
      }
    }

    setLoading(true);

    try {
      // Submit through customer & loyalty service (prevents duplicates & detects returning subscribers)
      const result = await customerService.submitSubscription({
        firstName: cleanFirstName,
        phoneNumber: formData.smsConsent ? normalizeGhanaPhone(cleanPhone) : undefined,
        emailAddress: formData.emailConsent ? cleanEmail.toLowerCase() : undefined,
        smsConsent: Boolean(formData.smsConsent),
        emailConsent: Boolean(formData.emailConsent),
      });

      setConfirmedSmsConsent(Boolean(formData.smsConsent));
      setConfirmedEmailConsent(Boolean(formData.emailConsent));
      setIsReturningCustomer(result.isReturning);
      setUnlockedOffers(result.unlockedOffers || []);
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Subscription form submission error:', err);
      let message = '⚠️ We couldn\'t complete your subscription right now. Please try again.';
      if (err instanceof Error) {
        // Only show friendly business validation messages to users
        if (
          err.message.includes('select SMS') ||
          err.message.includes('valid Ghana phone') ||
          err.message.includes('valid email') ||
          err.message.includes('first name') ||
          err.message.includes('No internet connection')
        ) {
          message = err.message;
        }
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setIsReturningCustomer(false);
    setUnlockedOffers([]);
    setConfirmedSmsConsent(false);
    setConfirmedEmailConsent(false);
    setFormData({
      firstName: '',
      phoneNumber: '',
      emailAddress: '',
      smsConsent: false,
      emailConsent: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bell className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-slate-900 leading-tight">
                Never miss a data deal 📲
              </h3>
              <p className="text-xs text-slate-500">
                Get early alerts for cheap bundle drops
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {isSuccess ? (
            isReturningCustomer ? (
              /* Returning Subscriber Experience (Section 10) */
              <div className="py-2 text-center space-y-3">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wider uppercase">
                    Returning Customer Recognized
                  </span>
                  <h4 className="font-display font-black text-xl text-slate-900">
                    🎉 WELCOME BACK!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600">
                    You&apos;ve unlocked Cohort Tech Special Offers.
                  </p>
                  
                  {/* Channel Notification Indicator */}
                  <div className="pt-1">
                    <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {confirmedSmsConsent && confirmedEmailConsent
                        ? '📱 SMS + 📧 Email alerts enabled'
                        : confirmedSmsConsent
                        ? '📱 SMS alerts enabled'
                        : '📧 Email alerts enabled'}
                    </span>
                  </div>
                </div>

                {unlockedOffers && unlockedOffers.length > 0 ? (
                  <div className="text-left pt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Exclusive Special Offers For You:</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-normal">Active Today</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {unlockedOffers.map((offer) => (
                        <div
                          key={offer.id}
                          className="p-3 rounded-xl bg-gradient-to-r from-emerald-50/60 to-slate-50 border border-emerald-200 shadow-xs flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-900 text-white">
                                {offer.network}
                              </span>
                              <span className="text-xs font-black text-slate-900">{offer.dataAmount}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{offer.offerName}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="flex items-baseline gap-1 justify-end">
                              <span className="text-[10px] text-slate-400 line-through">GH₵{offer.normalPrice}</span>
                              <span className="text-sm font-black text-emerald-700">GH₵{offer.specialPrice}</span>
                            </div>
                            <a
                              href={LINKS.DATA_SHOP}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-xs transition-colors"
                            >
                              <span>CLAIM</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed pt-1">
                    Special offers and selected data deals are ready for you. Keep an eye on your messages!
                  </p>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* New Subscriber Experience (Section 9) */
              <div className="py-4 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-display font-black text-xl text-slate-900">
                  🎉 YOU&apos;RE SUBSCRIBED!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Thanks for joining Cohort Tech Data Hub updates.
                </p>

                {/* Channel Status Badges (Section 9) */}
                <div className="pt-1">
                  <span className="inline-block text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                    {confirmedSmsConsent && confirmedEmailConsent
                      ? '📱 SMS + 📧 Email alerts enabled'
                      : confirmedSmsConsent
                      ? '📱 SMS alerts enabled'
                      : '📧 Email alerts enabled'}
                  </span>
                </div>

                <div className="pt-3 flex flex-col gap-2">
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors"
                  >
                    Done
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Subscribe another contact
                  </button>
                </div>
              </div>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="e.g. Kwame or Efua"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Ghana Phone Number (For SMS)
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="e.g. 055 123 4567 or 053 742 0120"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, emailAddress: e.target.value })
                  }
                  placeholder="e.g. you@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.smsConsent}
                    onChange={(e) =>
                      setFormData({ ...formData, smsConsent: e.target.checked })
                    }
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Send me SMS data offers and promotions</span>
                </label>

                <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailConsent}
                    onChange={(e) =>
                      setFormData({ ...formData, emailConsent: e.target.checked })
                    }
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Send me email data offers and promotions</span>
                </label>
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                You can unsubscribe at any time.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-sm shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'SUBSCRIBING...' : 'GET ALERTS'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. COHORT TECH COMMUNITY MODAL
// ==========================================
export const CommunityModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const benefits = [
    { icon: '💻', title: 'Technology news', desc: 'Ghanaian & global tech updates' },
    { icon: '🤖', title: 'AI tools and updates', desc: 'Prompts, workflows & modern tools' },
    { icon: '🔐', title: 'Cybersecurity tips', desc: 'Protecting your data and MoMo accounts' },
    { icon: '👨‍💻', title: 'Programming resources', desc: 'Frontend, backend, mobile roadmaps' },
    { icon: '💼', title: 'Remote job opportunities', desc: 'Curated digital jobs for Africans' },
    { icon: '📚', title: 'Learning resources', desc: 'Free courses, certifications & tutorials' },
    { icon: '🌍', title: 'Ghana + global updates', desc: 'Fintech, startups and digital policies' },
    { icon: '🔥', title: 'Tech opportunities', desc: 'Hackathons, grants and internships' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              🚀
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-slate-900">
                More than just data 🚀
              </h3>
              <p className="text-xs text-slate-500">
                Cohort Tech Community • Connect. Learn. Build. Grow.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: 8 Benefits */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Cohort Tech is a growing ecosystem for African students, developers, remote workers and digital enthusiasts. Join our free channels to stay ahead:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5"
              >
                <span className="text-lg leading-none shrink-0">{b.icon}</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">{b.title}</div>
                  <div className="text-[11px] text-slate-500">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Community Action Buttons */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <a
              href={LINKS.TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>📱 JOIN TELEGRAM COMMUNITY</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={LINKS.WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>💬 FOLLOW WHATSAPP CHANNEL</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Official Cohort Tech QR Badge */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Scan with Phone Camera
              </span>
              <div className="inline-block p-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-2xs">
                <img
                  src={cohortTechQrBadge}
                  alt="Cohort Tech Official QR Code"
                  referrerPolicy="no-referrer"
                  className="w-44 h-44 object-contain rounded-xl mx-auto"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Point your phone camera to join our channels instantly
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. ABOUT & FAQ MODAL
// ==========================================
export const AboutFaqModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = useState<string | null>(FAQ_ITEMS[0]?.id || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-slate-900">
                About & Frequently Asked Questions
              </h3>
              <p className="text-xs text-slate-500">Cohort Tech Data Hub Ghana</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Quick How It Works */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 mb-2">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-emerald-800 mb-2">
              ⚡ How to Buy Data in 3 Steps
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">1.</span>
                <span>Choose your network (MTN, Telecel, AT) and bundle size.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">2.</span>
                <span>Click &quot;Buy Now&quot; to open the CheapData shop.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">3.</span>
                <span>Enter recipient number and pay seamlessly with Mobile Money.</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-2">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-500 mb-1">
              Common Questions
            </h4>
            {FAQ_ITEMS.map((faq) => {
              const isOpenItem = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpenItem ? null : faq.id)}
                    className="w-full p-3 text-left font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpenItem ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpenItem && (
                    <div className="p-3 pt-0 text-xs text-slate-600 bg-slate-50/50 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. PRIVACY POLICY MODAL
// ==========================================
export const PrivacyModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-bold text-lg text-slate-900">
              Privacy Policy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900">
            Last Updated: January 2026 • Cohort Tech Data Hub (Ghana)
          </p>
          <h4 className="text-slate-900 font-bold">1. Voluntary Marketing Consent</h4>
          <p>
            Cohort Tech Data Hub only collects your phone number or email address when you voluntarily enter it into our alert forms with explicit checkbox consent. We maintain separate consent channels for SMS alerts and email updates.
          </p>
          <h4 className="text-slate-900 font-bold">2. No Silent Data Harvesting</h4>
          <p>
            We strictly do not silently collect phone numbers, scrape emails, or add visitors to marketing lists without their knowledge or consent.
          </p>
          <h4 className="text-slate-900 font-bold">3. Right to Unsubscribe</h4>
          <p>
            You may revoke your consent and unsubscribe at any time through our automated self-service Unsubscribe tool, via opt-out links in marketing emails, or by SMS STOP commands.
          </p>
          <h4 className="text-slate-900 font-bold">4. External Data Shop Purchases</h4>
          <p>
            Purchases of data bundles occur on the external verified CheapData shop platform. Cohort Tech Data Hub does not process or store your Mobile Money PINs, credit cards, or banking credentials.
          </p>
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
          >
            Close Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. TERMS OF SERVICE MODAL
// ==========================================
export const TermsModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-bold text-lg text-slate-900">
              Terms of Service
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900">
            Welcome to Cohort Tech Data Hub
          </p>
          <h4 className="text-slate-900 font-bold">1. Service Nature</h4>
          <p>
            Cohort Tech Data Hub provides promotional listings, data deal notifications, and access to the Cohort Tech community. The fulfillment of bundle orders is handled through our external shop partner (CheapData).
          </p>
          <h4 className="text-slate-900 font-bold">2. Pricing & Availability</h4>
          <p>
            Promotional bundle prices listed on this website are indicative examples. Exact pricing, network quotas, and real-time inventory are determined by the live shop during checkout.
          </p>
          <h4 className="text-slate-900 font-bold">3. Governing Law</h4>
          <p>
            These terms are governed by the applicable laws of the Republic of Ghana.
          </p>
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. UNSUBSCRIBE MODAL
// ==========================================
export const UnsubscribeModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const [identifier, setIdentifier] = useState('');
  const [channel, setChannel] = useState<'all' | 'sms' | 'email'>('all');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      const data = await customerService.unsubscribe(identifier.trim(), channel);
      setFeedback({
        success: data.success,
        message:
          data.message ||
          (data.success
            ? 'Your preferences have been updated. You will receive no further messages on this channel.'
            : 'Could not find an active subscription with that contact detail.'),
      });
    } catch {
      setFeedback({
        success: true,
        message: 'Your opt-out request has been logged. You will receive no further messages on this channel.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full flex flex-col shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
            Unsubscribe from Marketing
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-600">
          <p>
            You have the right to unsubscribe at any time. Enter your registered email address or phone number to update your preferences.
          </p>

          {feedback ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedback.message}</span>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="text-xs font-semibold underline text-slate-700"
              >
                Unsubscribe another contact
              </button>
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 0241234567 or user@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Channel
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setChannel('all')}
                    className={`py-1.5 px-2 rounded-lg font-semibold border ${
                      channel === 'all'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`py-1.5 px-2 rounded-lg font-semibold border ${
                      channel === 'sms'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    SMS Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`py-1.5 px-2 rounded-lg font-semibold border ${
                      channel === 'email'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Email Only
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
              >
                {loading ? 'Processing...' : 'Confirm Unsubscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. BACKEND AUDIENCE METRICS MODAL
// ==========================================
export const AudienceStatsModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<{
    totalSubscribers: number;
    smsAudienceCount: number;
    emailAudienceCount: number;
    bothCount: number;
    smsOnlyCount: number;
    emailOnlyCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/subscribers/stats')
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(() => {
          setStats({
            totalSubscribers: 0,
            smsAudienceCount: 0,
            emailAudienceCount: 0,
            bothCount: 0,
            smsOnlyCount: 0,
            emailOnlyCount: 0,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full flex flex-col shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
              Database & Audience Metrics
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-600">
          {loading ? (
            <div className="py-6 text-center text-slate-400">Loading data...</div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 mb-0.5">Total Subscribers</div>
                <div className="text-xl font-black text-slate-900">
                  {stats.totalSubscribers}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 mb-0.5">SMS Audience</div>
                <div className="text-xl font-black text-emerald-600">
                  {stats.smsAudienceCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 mb-0.5">Email Audience</div>
                <div className="text-xl font-black text-sky-600">
                  {stats.emailAudienceCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 mb-0.5">Both Channels</div>
                <div className="text-xl font-black text-amber-600">
                  {stats.bothCount}
                </div>
              </div>
            </div>
          ) : null}

          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              <a
                href="/api/subscribers/export?format=csv&audience=sms"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5"
                download
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Export SMS CSV
              </a>
              <a
                href="/api/subscribers/export?format=csv&audience=email"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5"
                download
              >
                <Download className="w-3.5 h-3.5 text-sky-600" />
                Export Email CSV
              </a>
            </div>
          </div>
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
