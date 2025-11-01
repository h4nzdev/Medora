import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { getAllSubscriptions } from "../../services/subscription_services/subscriptionService";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Team from "./Team";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Hero from "./Hero";
import Subscriptions from "./Subscription";
import Footer from "./Footer";
import FeaturedClinics from "./FeaturedClinics/FeaturedClinics";
import Header from "./LandingPageHeader/Header";

// Framer Motion variants
const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animated Section Wrapper
const AnimatedSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={sectionVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("🏥 Current clinics:", clinics);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      console.log("🔄 Starting to fetch clinics with full data...");

      const subscriptionsResponse = await getAllSubscriptions();
      const activeSubscriptions = subscriptionsResponse.data || [];

      console.log("✅ Active subscriptions found:", activeSubscriptions);

      if (activeSubscriptions.length === 0) {
        setClinics([]);
        return;
      }

      const clinicPromises = activeSubscriptions.map(async (subscription) => {
        try {
          console.log(
            "🔄 Fetching FULL clinic data for:",
            subscription.clinicId._id
          );

          const clinicResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/clinic/${
              subscription.clinicId._id
            }`
          );

          console.log("✅ Full clinic data:", clinicResponse.data);

          return {
            ...clinicResponse.data,
            subscriptionPlan: subscription.plan,
            subscriptionAmount: subscription.amount,
          };
        } catch (error) {
          console.error("❌ Error fetching full clinic data:", error);
          return null;
        }
      });

      const clinicsData = await Promise.all(clinicPromises);
      const validClinics = clinicsData.filter((clinic) => clinic !== null);

      console.log("🎉 Final clinics with full data:", validClinics);
      setClinics(validClinics);
    } catch (error) {
      console.error("❌ ERROR in fetchClinics:", error);
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      className="bg-slate-50 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section - No delay */}
      <AnimatedSection>
        <Hero />
      </AnimatedSection>

      {/* Features Section - Small delay */}
      <AnimatedSection delay={0.1}>
        <Features />
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection delay={0.2}>
        <HowItWorks />
      </AnimatedSection>

      {/* Subscriptions Section */}
      <AnimatedSection delay={0.3}>
        <Subscriptions />
      </AnimatedSection>

      {/* Featured Clinics Section */}
      <AnimatedSection delay={0.4}>
        <FeaturedClinics clinics={clinics} loading={loading} />
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection delay={0.5}>
        <FAQ />
      </AnimatedSection>

      {/* Team Section */}
      <AnimatedSection delay={0.6}>
        <Team />
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection delay={0.7}>
        <Contact />
      </AnimatedSection>

      {/* Footer - No animation or very subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
