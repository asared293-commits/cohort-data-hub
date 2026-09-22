import React, { useState, useRef } from 'react';
import { Mail, Phone, Bell, CheckCircle2, ShieldCheck, AlertCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { SubscriberFormData, SubscriberResponse } from '../types';
import { customerService } from '../services/customerService';

interface AlertSystemProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenUnsubscribe?: () => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenUnsubscribe,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<SubscriberFormData>({
    firstName: '',
    phoneNumber: '',
    emailAddress: '',
    smsConsent: false,
    emailConsent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<SubscriberResponse | null>(null);

  // Helper when clicking "SUBSCRIBE TO EMAIL UPDATES" visual feature
  const handleSelectEmailFeature = () => {
    setFormData((prev) => ({ ...prev, emailConsent: true }));
    setSuccessResponse(null);
    setErrorMessage(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => firstNameInputRef.current?.focus(), 400);
  };

  // Helper when clicking "GET SMS ALERTS" visual feature
  const handleSelectSmsFeature = () => {
    setFormData((prev) => ({ ...prev, smsConsent: true }));
    setSuccessResponse(null);
    setErrorMessage(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => firstNameInputRef.current?.focus(), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation 1: At least one consent
    if (!formData.smsConsent && !formData.emailConsent) {
      setErrorMessage('Please check at least one consent box (SMS alerts or Email updates) to continue.');
      return;
    }

    // Validation 2: If SMS consent checked, phone is required
    if (formData.smsConsent && !formData.phoneNumber.trim()) {
      setErrorMessage('Please provide your phone number to receive SMS deal alerts.');
      return;
    }

    // Validation 3: If Email consent checked, email is required
    if (formData.emailConsent && !formData.emailAddress.trim()) {
      setErrorMessage('Please provide your email address to receive email updates.');
      return;
    }

    setLoading(true);

    try {
      const result = await customerService.submitSubscription({
        firstName: formData.firstName,
        phoneNumber: formData.smsConsent ? formData.phoneNumber : undefined,
        emailAddress: formData.emailConsent ? formData.emailAddress : undefined,
        smsConsent: Boolean(formData.smsConsent),
        emailConsent: Boolean(formData.emailConsent),
      });

      setSuccessResponse({
        success: true,
        message: result.message,
        details: result.isReturning
          ? "You've unlocked Cohort Tech Special Offers."
          : "Thanks for joining Cohort Tech Data Hub alerts. We'll only send you the types of updates you selected.",
        audience: formData.smsConsent && formData.emailConsent ? 'SMS + Email' : formData.smsConsent ? 'SMS' : 'Email',
      });

      // Cache locally
      const stored = JSON.parse(localStorage.getItem('cohort_tech_subscription') || '{}');
      localStorage.setItem(
        'cohort_tech_subscription',
        JSON.stringify({
          ...stored,
          ...formData,
          isReturning: result.isReturning,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (err: any) {
      console.error('Subscription error in AlertSystem:', err);
      setErrorMessage(err.message || "⚠️ We couldn't complete your subscription right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSuccessResponse(null);
    setFormData({
      firstName: '',
      phoneNumber: '',
      emailAddress: '',
      smsConsent: false,
      emailConsent: false,
    });
  };

  return (
    <section id="alerts" className="py-20 md:py-28 bg-[#0b1015] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Bell className="w-3.5 h-3.5" />
            <span>INSTANT NOTIFICATIONS</span>
          </div>

          <h2
            id="alerts-heading"
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-4"
          >
            📲 NEVER MISS A DATA DEAL
          </h2>

          <p className="text-lg sm:text-xl text-slate-200 font-medium mb-3">
            Get useful Cohort Tech Data Hub updates directly in your inbox or phone.
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Sign up voluntarily to receive new bundle offers, price updates, special promotions and important Cohort Tech Data Hub announcements.
          </p>
        </div>

        {/* Two Visual Feature Cards (Email Marketing vs SMS Marketing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {/* Feature 1: Email Marketing */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0e1622] to-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5 text-emerald-400">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 flex items-center gap-2">
                📧 GET DEALS IN YOUR INBOX
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Prefer email? Get new bundle offers, tech updates and selected Cohort Tech announcements directly in your inbox.
              </p>
            </div>
            <button
              onClick={handleSelectEmailFeature}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-emerald-500 text-white hover:text-slate-950 font-display font-bold text-sm border border-slate-700 hover:border-emerald-400 transition-all group"
            >
              <span>SUBSCRIBE TO EMAIL UPDATES</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Feature 2: SMS Marketing */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0e1622] to-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-3xl p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center mb-5 text-teal-400">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 flex items-center gap-2">
                📱 DATA DEALS BY SMS
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Get notified about new data bundle offers and selected promotions directly on your phone.
              </p>
            </div>
            <button
              onClick={handleSelectSmsFeature}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-teal-400 text-white hover:text-slate-950 font-display font-bold text-sm border border-slate-700 hover:border-teal-300 transition-all group"
            >
              <span>GET SMS ALERTS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Subscription Form Card */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#0e1622] to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
          {/* Subtle Corner Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {successResponse ? (
            /* Success Feedback State */
            <div id="subscription-success-box" className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                🎉 You're subscribed!
              </h3>

              <p className="text-slate-300 text-base max-w-md mx-auto leading-relaxed">
                Thanks for joining Cohort Tech Data Hub updates. We'll only send you the types of updates you selected.
              </p>

              {successResponse.audience && (
                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  Audience Channel: {successResponse.audience} List
                </div>
              )}

              <p className="text-xs text-slate-400 font-medium">
                You can unsubscribe at any time.
              </p>

              <div className="pt-4">
                <button
                  onClick={handleResetForm}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Manage or Subscribe Another Number/Email
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" id="alerts-subscription-form">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-display font-bold text-xl text-white">
                  Join Cohort Tech Deal Alerts
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Enter your contact details and specify your communication preferences below.
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Fields: First Name, Phone Number, Email Address */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="sub-first-name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    First Name
                  </label>
                  <input
                    ref={firstNameInputRef}
                    type="text"
                    id="sub-first-name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Kwame or Efua"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-white placeholder-slate-500 text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="sub-phone-number" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number (Ghana Mobile)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="sub-phone-number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="e.g. 024 123 4567 or +233 24 123 4567"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-white placeholder-slate-500 text-sm transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Required if opting in for SMS data deals.
                  </span>
                </div>

                <div>
                  <label htmlFor="sub-email-address" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="sub-email-address"
                    value={formData.emailAddress}
                    onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                    placeholder="e.g. kwame@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-white placeholder-slate-500 text-sm transition-all"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Required if opting in for email updates.
                  </span>
                </div>
              </div>

              {/* TWO SEPARATE CONSENT CHECKBOXES */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3.5">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Select Your Preferred Communication Channels:
                </div>

                {/* Consent Checkbox 1: SMS */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    id="consent-sms"
                    checked={formData.smsConsent}
                    onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                    className="w-5 h-5 mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-900"
                  />
                  <span className="text-xs sm:text-sm text-slate-300 leading-snug">
                    I agree to receive promotional SMS messages from Cohort Tech Data Hub about data bundles, offers and related updates.
                  </span>
                </label>

                {/* Consent Checkbox 2: Email */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    id="consent-email"
                    checked={formData.emailConsent}
                    onChange={(e) => setFormData({ ...formData, emailConsent: e.target.checked })}
                    className="w-5 h-5 mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-900"
                  />
                  <span className="text-xs sm:text-sm text-slate-300 leading-snug">
                    I agree to receive promotional emails from Cohort Tech Data Hub about data bundles, offers and related updates.
                  </span>
                </label>
              </div>

              {/* Primary Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-submit-alerts"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl font-display font-extrabold text-base bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Processing Subscription...</span>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" />
                      <span>🔔 GET MY DATA ALERTS</span>
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="pt-3 text-center space-y-2">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your contact information will only be used for the communication channels you choose. You can unsubscribe from marketing messages at any time.
                </p>

                <div className="flex items-center justify-center gap-4 text-xs text-emerald-400/90 font-medium">
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="hover:underline hover:text-emerald-300"
                  >
                    Privacy Policy
                  </button>
                  <span className="text-slate-700">•</span>
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="hover:underline hover:text-emerald-300"
                  >
                    Terms
                  </button>
                  <span className="text-slate-700">•</span>
                  <button
                    type="button"
                    onClick={onOpenUnsubscribe}
                    className="hover:underline hover:text-emerald-300 text-slate-400 hover:text-white"
                  >
                    Unsubscribe
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
