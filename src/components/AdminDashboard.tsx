import React, { useState, useEffect, useMemo } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  Shield,
  ShieldCheck,
  Lock,
  LogOut,
  Download,
  Search,
  Users,
  MessageSquare,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  ArrowLeft,
  Filter,
  AlertTriangle,
  Flame,
  Plus,
  Send,
  Sliders,
  Calendar,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { customerService } from '../services/customerService';
import {
  CustomerDoc,
  SpecialOfferDoc,
  CampaignDoc,
  CustomerFilter,
} from '../types/customer';

// Primary authorized administrator
const AUTHORIZED_ADMIN_EMAIL = 'asared293@gmail.com';

type AdminTab = 'customers' | 'offers' | 'sms_campaigns' | 'email_campaigns' | 'export' | 'settings';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('customers');

  // Data Collections
  const [customers, setCustomers] = useState<CustomerDoc[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOfferDoc[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignDoc[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Filters & Search
  const [filter, setFilter] = useState<CustomerFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Customer Profile Modal (Section 15)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDoc | null>(null);

  // Create Special Offer Modal
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    offerName: '',
    description: '',
    network: 'MTN' as 'MTN' | 'TELECEL' | 'AIRTELTIGO' | 'ALL',
    dataAmount: '',
    specialPrice: 0,
    normalPrice: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    smsMessage: '',
    emailMessage: '',
    active: true,
  });

  // Campaign Composer State
  const [smsAudience, setSmsAudience] = useState<'all_consenting' | 'special_offers_consenting'>('all_consenting');
  const [smsMessage, setSmsMessage] = useState('');
  const [smsDispatching, setSmsDispatching] = useState(false);
  const [smsSuccessMsg, setSmsSuccessMsg] = useState<string | null>(null);

  const [emailAudience, setEmailAudience] = useState<'all_consenting' | 'special_offers_consenting'>('all_consenting');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailDispatching, setEmailDispatching] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Check Admin Authorization
  const isAuthorized = useMemo(() => {
    if (!currentUser) return false;
    const userEmail = (currentUser.email || '').toLowerCase();
    return userEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
  }, [currentUser]);

  // 3. Load Customers, Special Offers & Campaigns
  useEffect(() => {
    if (!isAuthorized) {
      setCustomers([]);
      setSpecialOffers([]);
      setCampaigns([]);
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    setDataError(null);

    // Initial load from server API if running in full-stack container mode
    fetch('/api/admin/customers')
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        return res.ok && ct.includes('application/json') ? res.json() : null;
      })
      .then((data) => {
        if (data && data.customers && data.customers.length > 0) {
          setCustomers(data.customers);
        }
      })
      .catch(() => {});

    fetch('/api/admin/special-offers')
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        return res.ok && ct.includes('application/json') ? res.json() : null;
      })
      .then((data) => {
        if (data && data.offers) setSpecialOffers(data.offers);
      })
      .catch(() => {});

    fetch('/api/admin/campaigns')
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        return res.ok && ct.includes('application/json') ? res.json() : null;
      })
      .then((data) => {
        if (data && data.campaigns) setCampaigns(data.campaigns);
      })
      .catch(() => {});

    // Listen to customers in real-time
    const unsubCustomers = customerService.subscribeToAllCustomers(
      (data) => {
        if (data.length > 0) {
          setCustomers(data);
        }
        setDataLoading(false);
      },
      (err) => {
        console.warn('Firestore direct customer stream notice:', err);
        setDataLoading(false);
      }
    );

    // Listen to special offers
    const unsubOffers = customerService.subscribeToSpecialOffers(
      (data) => {
        if (data.length > 0) {
          setSpecialOffers(data);
        }
      },
      (err) => console.warn('Offers listener notice:', err)
    );

    // Listen to campaigns
    const unsubCampaigns = customerService.subscribeToCampaigns(
      (data) => {
        if (data.length > 0) {
          setCampaigns(data);
        }
      },
      (err) => console.warn('Campaigns listener notice:', err)
    );

    return () => {
      unsubCustomers();
      unsubOffers();
      unsubCampaigns();
    };
  }, [isAuthorized]);

  // Authentication Handlers
  const handleGoogleSignIn = async () => {
    try {
      setLoginError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setLoginError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // ==========================================
  // METRICS & STATISTICS (Section 5)
  // ==========================================
  const stats = useMemo(() => {
    const total = customers.length;
    const standard = customers.filter(
      (c) => c.customerStatus === 'subscriber' && c.loyaltyTier === 'standard'
    ).length;
    const specialOffersCount = customers.filter(
      (c) => c.customerStatus === 'subscriber' && c.loyaltyTier === 'special_offers'
    ).length;
    const sms = customers.filter(
      (c) => c.customerStatus === 'subscriber' && c.smsConsent
    ).length;
    const email = customers.filter(
      (c) => c.customerStatus === 'subscriber' && c.emailConsent
    ).length;
    const smsAndEmail = customers.filter(
      (c) => c.customerStatus === 'subscriber' && c.smsConsent && c.emailConsent
    ).length;
    const unsubscribed = customers.filter((c) => c.customerStatus === 'unsubscribed').length;

    return {
      total,
      standard,
      specialOffers: specialOffersCount,
      sms,
      email,
      smsAndEmail,
      unsubscribed,
    };
  }, [customers]);

  // ==========================================
  // CUSTOMER LIST FILTERING & SEARCH (Section 6 & 7)
  // ==========================================
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // 1. Filter condition
      if (filter === 'special_offers' && c.loyaltyTier !== 'special_offers') return false;
      if (filter === 'standard' && (c.loyaltyTier !== 'standard' || c.customerStatus !== 'subscriber')) return false;
      if (filter === 'sms' && (!c.smsConsent || c.customerStatus !== 'subscriber')) return false;
      if (filter === 'email' && (!c.emailConsent || c.customerStatus !== 'subscriber')) return false;
      if (filter === 'both' && (!c.smsConsent || !c.emailConsent || c.customerStatus !== 'subscriber')) return false;
      if (filter === 'unsubscribed' && c.customerStatus !== 'unsubscribed') return false;

      // 2. Search query (matches Name, Phone, or Email)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchName = c.firstName?.toLowerCase().includes(query);
        const matchPhone = c.phone?.toLowerCase().includes(query);
        const matchEmail = c.email?.toLowerCase().includes(query);
        if (!matchName && !matchPhone && !matchEmail) return false;
      }

      return true;
    });
  }, [customers, filter, searchQuery]);

  // ==========================================
  // CUSTOMER ACTION HANDLERS
  // ==========================================
  const handleToggleSms = async (customer: CustomerDoc) => {
    setActionLoadingId(customer.customerId);
    try {
      const newSms = !customer.smsConsent;
      const isUnsub = !newSms && !customer.emailConsent;
      await customerService.updateCustomer(customer.customerId, {
        smsConsent: newSms,
        customerStatus: isUnsub ? 'unsubscribed' : 'subscriber',
        loyaltyTier: isUnsub ? 'unsubscribed' : customer.loyaltyTier,
        specialOffers: isUnsub ? false : customer.specialOffers,
      });
      setCustomers((prev) =>
        prev.map((c) =>
          c.customerId === customer.customerId
            ? {
                ...c,
                smsConsent: newSms,
                customerStatus: isUnsub ? 'unsubscribed' : 'subscriber',
              }
            : c
        )
      );
      if (selectedCustomer?.customerId === customer.customerId) {
        setSelectedCustomer((prev) =>
          prev ? { ...prev, smsConsent: newSms, customerStatus: isUnsub ? 'unsubscribed' : 'subscriber' } : null
        );
      }
    } catch (err) {
      console.error('Failed to toggle SMS consent:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleEmail = async (customer: CustomerDoc) => {
    setActionLoadingId(customer.customerId);
    try {
      const newEmail = !customer.emailConsent;
      const isUnsub = !customer.smsConsent && !newEmail;
      await customerService.updateCustomer(customer.customerId, {
        emailConsent: newEmail,
        customerStatus: isUnsub ? 'unsubscribed' : 'subscriber',
        loyaltyTier: isUnsub ? 'unsubscribed' : customer.loyaltyTier,
        specialOffers: isUnsub ? false : customer.specialOffers,
      });
      setCustomers((prev) =>
        prev.map((c) =>
          c.customerId === customer.customerId
            ? {
                ...c,
                emailConsent: newEmail,
                customerStatus: isUnsub ? 'unsubscribed' : 'subscriber',
              }
            : c
        )
      );
      if (selectedCustomer?.customerId === customer.customerId) {
        setSelectedCustomer((prev) =>
          prev ? { ...prev, emailConsent: newEmail, customerStatus: isUnsub ? 'unsubscribed' : 'subscriber' } : null
        );
      }
    } catch (err) {
      console.error('Failed to toggle Email consent:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleTier = async (customer: CustomerDoc) => {
    setActionLoadingId(customer.customerId);
    try {
      const newTier = customer.loyaltyTier === 'special_offers' ? 'standard' : 'special_offers';
      const specialOffers = newTier === 'special_offers';
      await customerService.updateCustomer(customer.customerId, {
        loyaltyTier: newTier,
        specialOffers,
        customerStatus: 'subscriber',
      });
      setCustomers((prev) =>
        prev.map((c) =>
          c.customerId === customer.customerId
            ? { ...c, loyaltyTier: newTier, specialOffers, customerStatus: 'subscriber' }
            : c
        )
      );
      if (selectedCustomer?.customerId === customer.customerId) {
        setSelectedCustomer((prev) =>
          prev ? { ...prev, loyaltyTier: newTier, specialOffers, customerStatus: 'subscriber' } : null
        );
      }
    } catch (err) {
      console.error('Failed to toggle tier:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUnsubscribeCustomer = async (customer: CustomerDoc) => {
    setActionLoadingId(customer.customerId);
    try {
      await customerService.updateCustomer(customer.customerId, {
        smsConsent: false,
        emailConsent: false,
        customerStatus: 'unsubscribed',
        loyaltyTier: 'unsubscribed',
        specialOffers: false,
      });
      setCustomers((prev) =>
        prev.map((c) =>
          c.customerId === customer.customerId
            ? {
                ...c,
                smsConsent: false,
                emailConsent: false,
                customerStatus: 'unsubscribed',
                loyaltyTier: 'unsubscribed',
                specialOffers: false,
              }
            : c
        )
      );
      if (selectedCustomer?.customerId === customer.customerId) {
        setSelectedCustomer((prev) =>
          prev
            ? {
                ...prev,
                smsConsent: false,
                emailConsent: false,
                customerStatus: 'unsubscribed',
                loyaltyTier: 'unsubscribed',
                specialOffers: false,
              }
            : null
        );
      }
    } catch (err) {
      console.error('Failed to unsubscribe customer:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // ==========================================
  // SPECIAL OFFER CREATION & MANAGEMENT (Section 8)
  // ==========================================
  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.offerName || !newOffer.dataAmount) return;

    try {
      const created = await customerService.createSpecialOffer({
        offerName: newOffer.offerName,
        description: newOffer.description,
        network: newOffer.network,
        dataAmount: newOffer.dataAmount,
        specialPrice: Number(newOffer.specialPrice),
        normalPrice: Number(newOffer.normalPrice),
        startDate: newOffer.startDate,
        endDate: newOffer.endDate,
        smsMessage: newOffer.smsMessage,
        emailMessage: newOffer.emailMessage,
        active: newOffer.active,
      });
      setSpecialOffers((prev) => [created, ...prev]);
      setIsCreateOfferOpen(false);
      setNewOffer({
        offerName: '',
        description: '',
        network: 'MTN',
        dataAmount: '',
        specialPrice: 0,
        normalPrice: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2026-12-31',
        smsMessage: '',
        emailMessage: '',
        active: true,
      });
    } catch (err) {
      console.error('Failed to create special offer:', err);
    }
  };

  const handleToggleOfferActive = async (offer: SpecialOfferDoc) => {
    try {
      const newActive = !offer.active;
      await customerService.updateSpecialOffer(offer.id, { active: newActive });
      setSpecialOffers((prev) =>
        prev.map((o) => (o.id === offer.id ? { ...o, active: newActive } : o))
      );
    } catch (err) {
      console.error('Failed to toggle offer:', err);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    try {
      await customerService.deleteSpecialOffer(id);
      setSpecialOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('Failed to delete offer:', err);
    }
  };

  // ==========================================
  // CAMPAIGNS (Section 9 & 10)
  // ==========================================
  // Eligible SMS recipient count
  const eligibleSmsCount = useMemo(() => {
    return customers.filter((c) => {
      if (c.customerStatus !== 'subscriber') return false;
      if (!c.smsConsent) return false;
      if (smsAudience === 'special_offers_consenting') {
        return c.loyaltyTier === 'special_offers';
      }
      return true;
    }).length;
  }, [customers, smsAudience]);

  const handleDispatchSmsCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim() || eligibleSmsCount === 0) return;

    setSmsDispatching(true);
    setSmsSuccessMsg(null);
    try {
      const dispatched = await customerService.dispatchCampaign({
        channel: 'sms',
        targetAudience: smsAudience,
        recipientCount: eligibleSmsCount,
        message: smsMessage.trim(),
      });
      setCampaigns((prev) => [dispatched, ...prev]);
      setSmsSuccessMsg(`Dispatched SMS campaign to ${eligibleSmsCount} consenting subscribers!`);
      setSmsMessage('');
    } catch (err) {
      console.error('Failed to dispatch SMS campaign:', err);
    } finally {
      setSmsDispatching(false);
    }
  };

  // Eligible Email recipient count
  const eligibleEmailCount = useMemo(() => {
    return customers.filter((c) => {
      if (c.customerStatus !== 'subscriber') return false;
      if (!c.emailConsent) return false;
      if (emailAudience === 'special_offers_consenting') {
        return c.loyaltyTier === 'special_offers';
      }
      return true;
    }).length;
  }, [customers, emailAudience]);

  const handleDispatchEmailCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailMessage.trim() || eligibleEmailCount === 0) return;

    setEmailDispatching(true);
    setEmailSuccessMsg(null);
    try {
      const dispatched = await customerService.dispatchCampaign({
        channel: 'email',
        targetAudience: emailAudience,
        recipientCount: eligibleEmailCount,
        subject: emailSubject.trim(),
        message: emailMessage.trim(),
      });
      setCampaigns((prev) => [dispatched, ...prev]);
      setEmailSuccessMsg(`Dispatched Email campaign to ${eligibleEmailCount} consenting subscribers!`);
      setEmailSubject('');
      setEmailMessage('');
    } catch (err) {
      console.error('Failed to dispatch Email campaign:', err);
    } finally {
      setEmailDispatching(false);
    }
  };

  // ==========================================
  // CSV EXPORT (Section 7)
  // ==========================================
  const handleExportCsv = (customAudience?: 'special_offers' | 'sms' | 'email' | 'all') => {
    let dataset = customers;
    let filenameSuffix = 'all';

    const target = customAudience || filter;
    if (target === 'special_offers') {
      dataset = customers.filter((c) => c.loyaltyTier === 'special_offers');
      filenameSuffix = 'special_offers';
    } else if (target === 'sms') {
      dataset = customers.filter((c) => c.customerStatus === 'subscriber' && c.smsConsent);
      filenameSuffix = 'sms_subscribers';
    } else if (target === 'email') {
      dataset = customers.filter((c) => c.customerStatus === 'subscriber' && c.emailConsent);
      filenameSuffix = 'email_subscribers';
    }

    const header = 'Name,Phone,Email,Subscription Count,SMS Consent,Email Consent,Loyalty Tier,Status,First Subscribed,Last Subscribed\n';
    const rows = dataset
      .map(
        (c) =>
          `"${c.firstName || ''}","${c.phone || ''}","${c.email || ''}",${c.subscriptionCount || 1},${c.smsConsent ? 'YES' : 'NO'},${c.emailConsent ? 'YES' : 'NO'},"${c.loyaltyTier}","${c.customerStatus}","${c.firstSubscribedAt || ''}","${c.lastSubscribedAt || ''}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cohort_tech_${filenameSuffix}_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper date formatter
  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  // ==========================================
  // AUTHENTICATION GUARD & LOGIN UI
  // ==========================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAF8] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F7FAF8] flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7 text-emerald-700" />
          </div>

          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl text-slate-900 tracking-tight">
              Cohort Tech Admin
            </h1>
            <p className="text-xs text-slate-500">
              Customer & Loyalty Management System
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-left text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Restricted Access</span>
            </div>
            <p className="text-[11px] text-slate-500">
              This portal contains protected customer PII and marketing consent records. Sign in with the authorized Google administrator account.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={onBackToStore}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Data Marketplace</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Access Denied Screen (Logged in but not authorized admin email)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F7FAF8] flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="font-display font-black text-xl text-slate-900">
            Access Denied
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Signed in as <strong className="text-slate-900">{currentUser.email}</strong>. This Google account is not configured as an authorized administrator.
          </p>
          <div className="pt-3 space-y-2">
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              Sign Out & Switch Account
            </button>
            <button
              onClick={onBackToStore}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-800"
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHORIZED ADMIN MAIN INTERFACE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F7FAF8] text-slate-900 font-sans flex flex-col">
      {/* Top Admin App Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Return to Data Hub Marketplace"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-base sm:text-lg text-slate-900 leading-none">
                  Cohort Tech Data Hub
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Customer & Loyalty Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-800">{currentUser.email}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none border-t border-slate-100 py-1.5">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'customers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>CUSTOMERS</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'customers' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {stats.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'offers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>SPECIAL OFFERS</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'offers' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {specialOffers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sms_campaigns')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'sms_campaigns'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SMS CAMPAIGNS</span>
          </button>

          <button
            onClick={() => setActiveTab('email_campaigns')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'email_campaigns'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>EMAIL CAMPAIGNS</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>SETTINGS</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* ========================================== */}
        {/* SECTION 5: DASHBOARD STATISTICS KPIS */}
        {/* ========================================== */}
        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. TOTAL CUSTOMERS */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">Total</span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {stats.total}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">All customer records</div>
          </div>

          {/* 2. STANDARD SUBSCRIBERS */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">Standard</span>
              <span className="text-xs">🌟</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-700 font-display">
              {stats.standard}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Subscribed 1x</div>
          </div>

          {/* 3. SPECIAL-OFFER SUBSCRIBERS */}
          <div className="p-3.5 bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-300 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-amber-800 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">Special Offers</span>
              <Flame className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-900 font-display">
              {stats.specialOffers}
            </div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Returning (2+ subs)</div>
          </div>

          {/* 4. SMS SUBSCRIBERS */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">SMS Reach</span>
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 font-display">
              {stats.sms}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Permitted for SMS</div>
          </div>

          {/* 5. EMAIL SUBSCRIBERS */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">Email Reach</span>
              <Mail className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-700 font-display">
              {stats.email}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Permitted for Email</div>
          </div>

          {/* 6. SMS + EMAIL SUBSCRIBERS */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">Dual Channel</span>
              <span className="text-xs">⚡</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-700 font-display">
              {stats.smsAndEmail}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Both channels active</div>
          </div>

          {/* 7. UNSUBSCRIBED */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">Opted Out</span>
              <UserX className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-500 font-display">
              {stats.unsubscribed}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Unsubscribed</div>
          </div>
        </section>

        {/* ========================================== */}
        {/* TAB 1: CUSTOMERS DIRECTORY (Section 6 & 7) */}
        {/* ========================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Filter Pills with PROMINENT SPECIAL OFFERS FILTER */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
                <button
                  onClick={() => setFilter('special_offers')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                    filter === 'special_offers'
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>🔥 SPECIAL OFFERS</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-white">
                    {stats.specialOffers}
                  </span>
                </button>

                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    filter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All ({stats.total})
                </button>

                <button
                  onClick={() => setFilter('standard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    filter === 'standard'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Standard ({stats.standard})
                </button>

                <button
                  onClick={() => setFilter('sms')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    filter === 'sms'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  SMS ({stats.sms})
                </button>

                <button
                  onClick={() => setFilter('email')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    filter === 'email'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Email ({stats.email})
                </button>

                <button
                  onClick={() => setFilter('unsubscribed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    filter === 'unsubscribed'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Unsubscribed ({stats.unsubscribed})
                </button>
              </div>

              {/* Search & Export Action */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, or email..."
                    className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleExportCsv()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  title="Export filtered customer list as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-3 text-center">Sub Count</th>
                      <th className="py-3 px-3 text-center">SMS Consent</th>
                      <th className="py-3 px-3 text-center">Email Consent</th>
                      <th className="py-3 px-3">Tier</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4">First Subscribed</th>
                      <th className="py-3 px-4">Last Subscribed</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-slate-400">
                          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-600">No customers found</p>
                          <p className="text-[11px]">Try adjusting your search query or filter</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((cust) => {
                        const isLoading = actionLoadingId === cust.customerId;
                        const isSpecialOffer = cust.loyaltyTier === 'special_offers';
                        return (
                          <tr
                            key={cust.customerId}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isSpecialOffer ? 'bg-amber-50/30' : ''
                            }`}
                          >
                            {/* Name */}
                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedCustomer(cust)}
                                className="hover:text-emerald-700 underline underline-offset-2 flex items-center gap-1.5 text-left"
                              >
                                {isSpecialOffer && <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                <span>{cust.firstName || 'Unnamed'}</span>
                              </button>
                            </td>

                            {/* Phone */}
                            <td className="py-3 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                              {cust.phone || <span className="text-slate-300">—</span>}
                            </td>

                            {/* Email */}
                            <td className="py-3 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap max-w-[160px] truncate">
                              {cust.email || <span className="text-slate-300">—</span>}
                            </td>

                            {/* Subscription Count */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full font-black text-[11px] ${
                                  (cust.subscriptionCount || 1) >= 2
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {cust.subscriptionCount || 1}
                              </span>
                            </td>

                            {/* SMS Consent */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              {cust.smsConsent ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>YES</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                  <X className="w-3 h-3 text-slate-400" />
                                  <span>NO</span>
                                </span>
                              )}
                            </td>

                            {/* Email Consent */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              {cust.emailConsent ? (
                                <span className="inline-flex items-center gap-1 text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-[11px]">
                                  <Check className="w-3 h-3 text-blue-600" />
                                  <span>YES</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                  <X className="w-3 h-3 text-slate-400" />
                                  <span>NO</span>
                                </span>
                              )}
                            </td>

                            {/* Loyalty Tier */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              {cust.loyaltyTier === 'special_offers' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-black text-[10px] uppercase">
                                  <Flame className="w-3 h-3 text-amber-600" />
                                  <span>Special Offers</span>
                                </span>
                              ) : cust.loyaltyTier === 'unsubscribed' ? (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                                  Unsubscribed
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  Standard
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              {cust.customerStatus === 'subscriber' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>Active</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">Opted Out</span>
                              )}
                            </td>

                            {/* First Subscribed */}
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                              {formatDate(cust.firstSubscribedAt)}
                            </td>

                            {/* Last Subscribed */}
                            <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap text-[11px]">
                              {formatDate(cust.lastSubscribedAt)}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedCustomer(cust)}
                                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                  title="View Customer Profile"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleToggleSms(cust)}
                                  disabled={isLoading}
                                  className={`p-1 rounded-lg text-[10px] font-bold ${
                                    cust.smsConsent
                                      ? 'text-emerald-700 hover:bg-emerald-50'
                                      : 'text-slate-400 hover:bg-slate-100'
                                  }`}
                                  title="Toggle SMS Consent"
                                >
                                  SMS
                                </button>

                                <button
                                  onClick={() => handleToggleEmail(cust)}
                                  disabled={isLoading}
                                  className={`p-1 rounded-lg text-[10px] font-bold ${
                                    cust.emailConsent
                                      ? 'text-blue-700 hover:bg-blue-50'
                                      : 'text-slate-400 hover:bg-slate-100'
                                  }`}
                                  title="Toggle Email Consent"
                                >
                                  Email
                                </button>

                                {cust.customerStatus === 'subscriber' && (
                                  <button
                                    onClick={() => handleUnsubscribeCustomer(cust)}
                                    disabled={isLoading}
                                    className="p-1 rounded-lg text-red-600 hover:bg-red-50"
                                    title="Unsubscribe customer"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: SPECIAL OFFERS MANAGEMENT (Section 8) */}
        {/* ========================================== */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-lg text-slate-900">
                  Returning Subscriber Special Offers
                </h2>
                <p className="text-xs text-slate-500">
                  Exclusive bundle discounts displayed only to returning subscribers in the Special Offers tier
                </p>
              </div>

              <button
                onClick={() => setIsCreateOfferOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Special Offer</span>
              </button>
            </div>

            {/* Special Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialOffers.length === 0 ? (
                <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                  <Flame className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No special offers created yet</p>
                  <p className="text-xs">Click &quot;Create Special Offer&quot; above to add a promotional deal</p>
                </div>
              ) : (
                specialOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`bg-white border rounded-2xl p-4 shadow-xs transition-all space-y-3 ${
                      offer.active
                        ? 'border-emerald-200 ring-1 ring-emerald-100'
                        : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-900 text-white">
                            {offer.network}
                          </span>
                          <span className="text-xs font-black text-slate-900">{offer.dataAmount}</span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {offer.offerName}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleToggleOfferActive(offer)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors ${
                          offer.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {offer.active ? 'ACTIVE' : 'PAUSED'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {offer.description || 'Exclusive bundle discount for returning subscribers.'}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-400">Normal Price</div>
                        <div className="text-xs text-slate-500 line-through">GH₵{offer.normalPrice}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase">Special Price</div>
                        <div className="text-base font-black text-emerald-700 font-display">
                          GH₵{offer.specialPrice}
                        </div>
                      </div>
                    </div>

                    {/* Pre-formatted Message Previews */}
                    <div className="space-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                      {offer.smsMessage && (
                        <div className="truncate">
                          <strong className="text-slate-700">SMS text:</strong> {offer.smsMessage}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSmsAudience('special_offers_consenting');
                          setSmsMessage(offer.smsMessage || `Cohort Tech VIP: ${offer.offerName} now GH₵${offer.specialPrice} (Normal GH₵${offer.normalPrice})! Claim now.`);
                          setActiveTab('sms_campaigns');
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-bold"
                      >
                        <Send className="w-3 h-3" />
                        <span>Promote via SMS</span>
                      </button>

                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50"
                        title="Delete offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: SMS CAMPAIGNS (Section 9) */}
        {/* ========================================== */}
        {activeTab === 'sms_campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SMS Composer */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-display font-black text-base text-slate-900">
                  Compose SMS Campaign
                </h2>
                <p className="text-xs text-slate-500">
                  Targeted promotional SMS with strict consent enforcement
                </p>
              </div>

              {smsSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{smsSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleDispatchSmsCampaign} className="space-y-4">
                {/* Audience Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Target Audience
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        smsAudience === 'all_consenting'
                          ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-400'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">All SMS Subscribers</div>
                        <div className="text-[11px] text-slate-500">Permitted SMS recipients</div>
                      </div>
                      <input
                        type="radio"
                        name="smsAudience"
                        value="all_consenting"
                        checked={smsAudience === 'all_consenting'}
                        onChange={() => setSmsAudience('all_consenting')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        smsAudience === 'special_offers_consenting'
                          ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>Special-Offer Subscribers</span>
                        </div>
                        <div className="text-[11px] text-slate-500">Returning customers with consent</div>
                      </div>
                      <input
                        type="radio"
                        name="smsAudience"
                        value="special_offers_consenting"
                        checked={smsAudience === 'special_offers_consenting'}
                        onChange={() => setSmsAudience('special_offers_consenting')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Consent Safety Guard Note */}
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Automated Consent Guard Active:</span> Anyone with{' '}
                    <code className="bg-emerald-100 px-1 rounded text-[11px]">smsConsent: false</code> is automatically excluded before dispatch. Currently eligible:{' '}
                    <strong>{eligibleSmsCount} recipients</strong>.
                  </div>
                </div>

                {/* SMS Message Textarea */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="font-bold uppercase text-slate-500">SMS Message</label>
                    <span className="text-slate-400 text-[11px]">
                      {smsMessage.length} characters ({Math.ceil(smsMessage.length / 160) || 1} SMS)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="e.g. Cohort Tech VIP: Enjoy our special MTN 5GB deal today for GH₵22. Reply STOP to opt out."
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={smsDispatching || eligibleSmsCount === 0 || !smsMessage.trim()}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-display font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {smsDispatching
                      ? 'Dispatching Campaign...'
                      : `Dispatch SMS to ${eligibleSmsCount} Consenting Subscribers`}
                  </span>
                </button>
              </form>
            </div>

            {/* Campaign Dispatch History */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-display font-bold text-sm text-slate-900">SMS Campaign History</h3>
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {campaigns.filter((c) => c.channel === 'sms').length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No SMS campaigns dispatched yet</p>
                ) : (
                  campaigns
                    .filter((c) => c.channel === 'sms')
                    .map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            {c.recipientCount} recipients
                          </span>
                          <span className="text-[10px] text-slate-400">{formatDate(c.sentAt)}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">&quot;{c.message}&quot;</p>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Delivered</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: EMAIL CAMPAIGNS (Section 10) */}
        {/* ========================================== */}
        {activeTab === 'email_campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Email Composer */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-display font-black text-base text-slate-900">
                  Compose Email Campaign
                </h2>
                <p className="text-xs text-slate-500">
                  Broadcast promotional updates to consenting email subscribers
                </p>
              </div>

              {emailSuccessMsg && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>{emailSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleDispatchEmailCampaign} className="space-y-4">
                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Target Audience
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        emailAudience === 'all_consenting'
                          ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-400'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">All Email Subscribers</div>
                        <div className="text-[11px] text-slate-500">Permitted email recipients</div>
                      </div>
                      <input
                        type="radio"
                        name="emailAudience"
                        value="all_consenting"
                        checked={emailAudience === 'all_consenting'}
                        onChange={() => setEmailAudience('all_consenting')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        emailAudience === 'special_offers_consenting'
                          ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>Special-Offer Subscribers</span>
                        </div>
                        <div className="text-[11px] text-slate-500">Returning customers with consent</div>
                      </div>
                      <input
                        type="radio"
                        name="emailAudience"
                        value="special_offers_consenting"
                        checked={emailAudience === 'special_offers_consenting'}
                        onChange={() => setEmailAudience('special_offers_consenting')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Automated Consent Guard Active:</span> Anyone with{' '}
                    <code className="bg-blue-100 px-1 rounded text-[11px]">emailConsent: false</code> is automatically excluded before dispatch. Currently eligible:{' '}
                    <strong>{eligibleEmailCount} recipients</strong>.
                  </div>
                </div>

                {/* Email Subject */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Exclusive Data Deal Drop: MTN & Telecel Weekend Special"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Email Body */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Email Body Content
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Write your email body here..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Mandatory Unsubscribe Notice (Section 10) */}
                <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Mandatory Unsubscribe Link automatically appended to message footer.</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>

                <button
                  type="submit"
                  disabled={emailDispatching || eligibleEmailCount === 0 || !emailSubject.trim() || !emailMessage.trim()}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white font-display font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {emailDispatching
                      ? 'Dispatching Email...'
                      : `Dispatch Email to ${eligibleEmailCount} Consenting Subscribers`}
                  </span>
                </button>
              </form>
            </div>

            {/* Email Campaign History */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-display font-bold text-sm text-slate-900">Email Campaign History</h3>
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {campaigns.filter((c) => c.channel === 'email').length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No Email campaigns dispatched yet</p>
                ) : (
                  campaigns
                    .filter((c) => c.channel === 'email')
                    .map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            {c.recipientCount} recipients
                          </span>
                          <span className="text-[10px] text-slate-400">{formatDate(c.sentAt)}</span>
                        </div>
                        <div className="font-semibold text-slate-900 text-xs">{c.subject}</div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">&quot;{c.message}&quot;</p>
                        <div className="text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Dispatched</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: EXPORT PRESETS (Section 7) */}
        {/* ========================================== */}
        {activeTab === 'export' && (
          <div className="max-w-3xl space-y-4">
            <div>
              <h2 className="font-display font-black text-lg text-slate-900">
                Audience & Customer Data Export
              </h2>
              <p className="text-xs text-slate-500">
                Export customer records formatted for marketing providers (Arkesel, Hubtel, SendGrid, Mailchimp)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Export All */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">All Customers</span>
                  <span className="text-xs text-slate-500">{stats.total} records</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Complete customer registry with all consent timestamps and tier statuses.
                </p>
                <button
                  onClick={() => handleExportCsv('all')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Customers CSV</span>
                </button>
              </div>

              {/* Export Special Offers */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-white border border-amber-300 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between text-amber-900">
                  <span className="font-bold text-sm flex items-center gap-1">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Special-Offer Customers</span>
                  </span>
                  <span className="text-xs font-bold">{stats.specialOffers} records</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Returning subscribers eligible for exclusive data deals and promotions.
                </p>
                <button
                  onClick={() => handleExportCsv('special_offers')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Special-Offer CSV</span>
                </button>
              </div>

              {/* Export SMS Reach */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">SMS Marketing Audience</span>
                  <span className="text-xs text-slate-500">{stats.sms} records</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Filtered list of all active customers who have affirmatively opted into SMS promotions.
                </p>
                <button
                  onClick={() => handleExportCsv('sms')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SMS Audience CSV</span>
                </button>
              </div>

              {/* Export Email Reach */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Email Marketing Audience</span>
                  <span className="text-xs text-slate-500">{stats.email} records</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Filtered list of all active customers who have affirmatively opted into Email promotions.
                </p>
                <button
                  onClick={() => handleExportCsv('email')}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Email Audience CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: SETTINGS & POLICIES */}
        {/* ========================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="font-display font-black text-lg text-slate-900">
                System Rules & Settings
              </h2>
              <p className="text-xs text-slate-500">
                Cohort Tech Data Hub customer retention policies and admin configuration
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">Authorized Administrator</h4>
                <p>Primary Google Account: <code className="font-mono text-emerald-700">{AUTHORIZED_ADMIN_EMAIL}</code></p>
                <p className="text-[11px] text-slate-400">Authenticated via Firebase Authentication with email verification check.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">Loyalty Tier Progression</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li><strong>Standard Tier:</strong> Customer submits the Deal Alerts form 1 time.</li>
                  <li><strong>Special Offers Tier:</strong> Customer submits again with the same phone or email. Duplicates are blocked, subscription count is incremented, and Special Offers are unlocked.</li>
                  <li><strong>Unsubscribed:</strong> Customer opts out from all channels. Record is retained with historical consent logs without automatic deletion.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">Strict Anti-Spam Marketing Rule</h4>
                <p className="text-[11px] leading-relaxed">
                  The system never enrolls visitors into promotional SMS or email marketing merely because they visited the website or bought data. A customer becomes a marketing subscriber strictly when they voluntarily provide contact details and actively check marketing checkboxes.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* SECTION 15: INTERNAL CUSTOMER PROFILE MODAL */}
      {/* ========================================== */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-display font-black text-base text-slate-900">
                    COHORT TECH CUSTOMER
                  </h3>
                  <p className="text-[11px] text-slate-500">Internal Profile & Consent Record</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900 font-display">
                  {selectedCustomer.firstName || 'Unnamed Customer'}
                </h4>
                <div className="space-y-0.5 text-slate-600 font-mono text-[11px]">
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-1.5">
                      <span>📱</span>
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  )}
                  {selectedCustomer.email && (
                    <div className="flex items-center gap-1.5">
                      <span>📧</span>
                      <span>{selectedCustomer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Tier Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Status</div>
                  <div className="text-xs font-black text-slate-900 uppercase mt-0.5">
                    {selectedCustomer.customerStatus === 'subscriber' ? 'ACTIVE' : 'UNSUBSCRIBED'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Loyalty Tier</div>
                  <div className="text-xs font-black text-amber-800 uppercase mt-0.5 flex items-center gap-1">
                    {selectedCustomer.loyaltyTier === 'special_offers' && <Flame className="w-3 h-3 text-amber-500" />}
                    <span>{selectedCustomer.loyaltyTier.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Subscriptions Count:</span>
                  <span className="font-bold text-slate-900">{selectedCustomer.subscriptionCount || 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">SMS Permission:</span>
                  <span className="font-bold">
                    {selectedCustomer.smsConsent ? (
                      <span className="text-emerald-700">✓ Consented</span>
                    ) : (
                      <span className="text-slate-400">✗ No</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Email Permission:</span>
                  <span className="font-bold">
                    {selectedCustomer.emailConsent ? (
                      <span className="text-blue-700">✓ Consented</span>
                    ) : (
                      <span className="text-slate-400">✗ No</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">First Subscribed:</span>
                  <span className="text-slate-900">{formatDate(selectedCustomer.firstSubscribedAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Last Subscribed:</span>
                  <span className="text-slate-900">{formatDate(selectedCustomer.lastSubscribedAt)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Special-Offer Eligibility:</span>
                  <span className="font-black text-emerald-700">
                    {selectedCustomer.specialOffers ? 'Eligible' : 'Standard (Ineligible)'}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Admin Controls</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleToggleTier(selectedCustomer)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-[11px] text-slate-800"
                  >
                    Toggle Special Offers
                  </button>
                  <button
                    onClick={() => handleToggleSms(selectedCustomer)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-[11px] text-slate-800"
                  >
                    {selectedCustomer.smsConsent ? 'Revoke SMS' : 'Grant SMS'}
                  </button>
                  <button
                    onClick={() => handleToggleEmail(selectedCustomer)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-[11px] text-slate-800"
                  >
                    {selectedCustomer.emailConsent ? 'Revoke Email' : 'Grant Email'}
                  </button>
                  {selectedCustomer.customerStatus === 'subscriber' ? (
                    <button
                      onClick={() => handleUnsubscribeCustomer(selectedCustomer)}
                      className="py-2 px-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[11px]"
                    >
                      Opt-Out Customer
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleTier(selectedCustomer)}
                      className="py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-[11px]"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SECTION 8: CREATE SPECIAL OFFER MODAL */}
      {/* ========================================== */}
      {isCreateOfferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-black text-base text-slate-900">
                  Create Special Offer
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOfferOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Offer Name
                </label>
                <input
                  type="text"
                  required
                  value={newOffer.offerName}
                  onChange={(e) => setNewOffer({ ...newOffer, offerName: e.target.value })}
                  placeholder="e.g. 🔥 Returning Subscriber Deal: MTN 5GB"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  placeholder="Short explanation of this exclusive deal"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Network
                  </label>
                  <select
                    value={newOffer.network}
                    onChange={(e: any) => setNewOffer({ ...newOffer, network: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none font-bold"
                  >
                    <option value="MTN">MTN</option>
                    <option value="TELECEL">Telecel</option>
                    <option value="AIRTELTIGO">AirtelTigo</option>
                    <option value="ALL">All Networks</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Data Amount
                  </label>
                  <input
                    type="text"
                    required
                    value={newOffer.dataAmount}
                    onChange={(e) => setNewOffer({ ...newOffer, dataAmount: e.target.value })}
                    placeholder="e.g. 5GB or 10GB"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Normal Price (GH₵)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={newOffer.normalPrice || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, normalPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="25"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-emerald-700 mb-1">
                    Special Price (GH₵)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={newOffer.specialPrice || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, specialPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="22"
                    className="w-full px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newOffer.startDate}
                    onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newOffer.endDate}
                    onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  SMS Message Template
                </label>
                <textarea
                  rows={2}
                  value={newOffer.smsMessage}
                  onChange={(e) => setNewOffer({ ...newOffer, smsMessage: e.target.value })}
                  placeholder="e.g. Cohort Tech VIP: Get MTN 5GB for GH₵22 (Normal GH₵25) today only!"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Email Message Template
                </label>
                <textarea
                  rows={2}
                  value={newOffer.emailMessage}
                  onChange={(e) => setNewOffer({ ...newOffer, emailMessage: e.target.value })}
                  placeholder="Welcome back! As a valued returning Cohort Tech subscriber, unlock MTN 5GB for GH₵22."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOfferOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
                >
                  Save & Publish Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
