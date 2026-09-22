import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DataBundles } from './components/DataBundles';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { AdminDashboard } from './components/AdminDashboard';
import {
  DealAlertsModal,
  CommunityModal,
  AboutFaqModal,
  PrivacyModal,
  TermsModal,
  UnsubscribeModal,
  AudienceStatsModal,
} from './components/Modals';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
  });

  const [alertsOpen, setAlertOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [unsubscribeOpen, setUnsubscribeOpen] = useState(false);
  const [audienceStatsOpen, setAudienceStatsOpen] = useState(false);

  // Sync route with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(
        window.location.pathname.startsWith('/admin') || window.location.hash === '#admin'
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on /admin, display the Protected Admin Subscriber Dashboard
  if (isAdminRoute) {
    return <AdminDashboard onBackToStore={navigateToStore} />;
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-slate-900 selection:bg-emerald-500 selection:text-white font-sans antialiased overflow-x-hidden flex flex-col">
      {/* Compact, Bright Sticky Navbar */}
      <Navbar
        onOpenAlerts={() => setAlertOpen(true)}
        onOpenCommunity={() => setCommunityOpen(true)}
        onOpenFaq={() => setFaqOpen(true)}
        isMenuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
      />

      {/* Main Focus: Data Marketplace */}
      <main className="flex-1 pb-16 md:pb-8">
        <DataBundles
          onOpenAlerts={() => setAlertOpen(true)}
          onOpenCommunity={() => setCommunityOpen(true)}
        />
      </main>

      {/* Clean, Bright Modern Footer */}
      <Footer
        onOpenAlerts={() => setAlertOpen(true)}
        onOpenCommunity={() => setCommunityOpen(true)}
        onOpenFaq={() => setFaqOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenTerms={() => setTermsOpen(true)}
        onOpenUnsubscribe={() => setUnsubscribeOpen(true)}
        onOpenAudienceStats={() => setAudienceStatsOpen(true)}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Compact Sticky Mobile Action Bar */}
      <StickyMobileBar
        onOpenAlerts={() => setAlertOpen(true)}
        onOpenMenu={() => {
          setMenuOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Dedicated Modals & Drawers */}
      <DealAlertsModal
        isOpen={alertsOpen}
        onClose={() => setAlertOpen(false)}
      />

      <CommunityModal
        isOpen={communityOpen}
        onClose={() => setCommunityOpen(false)}
      />

      <AboutFaqModal
        isOpen={faqOpen}
        onClose={() => setFaqOpen(false)}
      />

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
      />

      <UnsubscribeModal
        isOpen={unsubscribeOpen}
        onClose={() => setUnsubscribeOpen(false)}
      />

      <AudienceStatsModal
        isOpen={audienceStatsOpen}
        onClose={() => setAudienceStatsOpen(false)}
      />
    </div>
  );
}
