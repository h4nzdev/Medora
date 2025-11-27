import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { getAllSubscriptions } from "../../services/subscription_services/subscriptionService";

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

  // Data fetching
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        const subscriptionsResponse = await getAllSubscriptions();
        const activeSubscriptions = subscriptionsResponse.data || [];

        if (activeSubscriptions.length === 0) {
          setClinics([]);
          return;
        }

        const clinicPromises = activeSubscriptions.map(async (subscription) => {
          try {
            const clinicResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/clinic/${
                subscription.clinicId._id
              }`
            );

            return {
              ...clinicResponse.data,
              subscriptionPlan: subscription.plan,
              subscriptionAmount: subscription.amount,
            };
          } catch (error) {
            console.error("Error fetching clinic:", error);
            return null;
          }
        });

        const clinicsData = await Promise.all(clinicPromises);
        const validClinics = clinicsData.filter((clinic) => clinic !== null);
        setClinics(validClinics);
      } catch (error) {
        console.error("Error fetching clinics:", error);
        setClinics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
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

        {/* Social Proof - Build trust */}
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
