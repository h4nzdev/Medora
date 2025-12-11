import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Components
import Header from "./LandingPageHeader/Header";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Subscriptions from "./Subscription";
import FeaturedClinics from "./FeaturedClinics/FeaturedClinics";
import FAQ from "./FAQ";
import Team from "./Team";
import Contact from "./Contact";
import Footer from "./Footer";
import LandingPageSubscription from "../../components/LandingPageSubscription";
import { getAllClinics } from "../../services/clinic_services/clinicService";

// Animation Configurations
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={sectionVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubscription, setShowSubscription] = useState(false);

  // Check session storage on component mount
  useEffect(() => {
    const subscriptionDismissed = sessionStorage.getItem(
      "subscriptionDismissed"
    );
    if (!subscriptionDismissed) {
      // Show subscription after a delay or based on scroll position
      const timer = setTimeout(() => {
        setShowSubscription(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch ALL clinics using the service
  useEffect(() => {
    const fetchAllClinicsData = async () => {
      try {
        setLoading(true);
        // Use the getAllClinics service
        const clinicsData = await getAllClinics();
        setClinics(clinicsData || []);
      } catch (error) {
        console.error("Error fetching clinics:", error);
        setClinics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllClinicsData();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleCloseSubscription = (remindLater = false) => {
    if (remindLater) {
      // Save to session storage for this browser session only
      sessionStorage.setItem("subscriptionDismissed", "true");
    }
    setShowSubscription(false);
  };

  const handleUpgradeClick = () => {
    setShowSubscription(false);
    // Optionally scroll to subscriptions section
    scrollToSection("subscriptions");
  };

  return (
    <motion.div
      className="min-h-screen bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* Subscription Popup */}
      {showSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full mx-auto">
            <LandingPageSubscription
              onClose={handleCloseSubscription}
              onUpgrade={handleUpgradeClick}
            />
          </div>
        </div>
      )}

      {/* Main Content - Optimized Order & Timing */}
      <main>
        {/* Hero - Immediate impact */}
        <AnimatedSection>
          <Hero />
        </AnimatedSection>

        {/* How It Works - Early explanation */}
        <AnimatedSection delay={0.1}>
          <HowItWorks />
        </AnimatedSection>

        {/* Features - Show benefits */}
        <AnimatedSection delay={0.2}>
          <Features />
        </AnimatedSection>

        {/* Social Proof - Build trust - Show ALL clinics */}
        <AnimatedSection delay={0.3}>
          <FeaturedClinics clinics={clinics} loading={loading} />
        </AnimatedSection>

        {/* Pricing - After establishing value */}
        <AnimatedSection delay={0.4}>
          <Subscriptions />
        </AnimatedSection>

        {/* FAQ - Address concerns */}
        <AnimatedSection delay={0.5}>
          <FAQ />
        </AnimatedSection>

        {/* Team - Build credibility */}
        <AnimatedSection delay={0.6}>
          <Team />
        </AnimatedSection>

        {/* Contact - Final CTA */}
        <AnimatedSection delay={0.7}>
          <Contact />
        </AnimatedSection>
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default LandingPage;
