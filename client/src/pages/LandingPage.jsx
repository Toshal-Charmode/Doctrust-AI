import React, { useState } from 'react';
import Navbar from '../components/doctrust/Navbar';
import HeroSection from '../components/doctrust/HeroSection';
import CoreFeatures from '../components/doctrust/CoreFeatures';
import InfiniteMarquee from '../components/doctrust/InfiniteMarquee';
import EnterpriseSecurity from '../components/doctrust/EnterpriseSecurity';
import Pricing from '../components/doctrust/Pricing';
import AccordionFAQ from '../components/doctrust/AccordionFAQ';
import Footer from '../components/doctrust/Footer';
import UploadModal from '../components/doctrust/UploadModal';
import AIChatWidget from '../components/doctrust/AIChatWidget';
import Toast from '../components/doctrust/Toast';
import AntiGravityBackground from '../components/background/AntiGravityBackground';
import { useLanguage } from '../context/LanguageContext';

export function LandingPage() {
  const { currentLang, setLanguage, t } = useLanguage();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  const showToast = (toastObj) => {
    setActiveToast(toastObj);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    showToast({
      title: t.nav.selectLang || 'Language Updated',
      message: `${lang.name} (${lang.native})`,
      type: 'info',
      tag: 'Localization',
    });
  };

  const handleDocumentVerified = (doc) => {
    showToast({
      title: 'Document Verified Successfully',
      message: `${doc.name} authenticated with ${doc.securityScore} confidence score. Zero tampering detected.`,
      type: 'success',
      tag: 'AI Verified',
    });
  };


  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans antialiased selection:bg-blue-600/15 selection:text-blue-700 flex flex-col relative overflow-x-hidden">
      {/* Interactive Anti-Gravity Dual-Layer Ambient Background */}
      <AntiGravityBackground mode="fixed" />

      {/* 1. Glassmorphism Sticky Navbar */}
      <Navbar
        onOpenUpload={() => setIsUploadModalOpen(true)}
        currentLang={currentLang}
        onSelectLang={handleLanguageChange}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {/* 2. Hero Section (Staggered Entrance + FloatingDocuments Background Collage + Live Mockup) */}
        <HeroSection
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onShowToast={showToast}
        />

        {/* 3. Core Features Showcase (Alternating Split-Screen Layouts) */}
        <CoreFeatures
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onShowToast={showToast}
        />

        {/* 4. Infinite Marquee Animation (Explore Use Cases with Pause on Hover) */}
        <InfiniteMarquee
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />

        {/* 5. Enterprise-Grade Security Section (Dark Background, 3 Columns) */}
        <EnterpriseSecurity
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />

        {/* Supporting Pricing Overview */}
        <Pricing
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />

        {/* 6. Smooth Accordion FAQ (with AnimatePresence) */}
        <AccordionFAQ
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />
      </main>

      {/* 7. Massive SEO-Friendly Footer (with Secondary Language Switcher) */}
      <Footer
        currentLang={currentLang}
        onSelectLang={handleLanguageChange}
        onOpenUpload={() => setIsUploadModalOpen(true)}
      />

      {/* Centered Drag-and-Drop File Upload Modal (Spring Animated) */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onVerified={handleDocumentVerified}
      />

      {/* Floating Interactive DocTrust AI Chat Widget */}
      <AIChatWidget
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />

      {/* Bottom-Right Floating Toast Notification */}
      <Toast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
      />
    </div>
  );
}

export default LandingPage;
