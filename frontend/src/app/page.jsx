"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { WhatsappFloatingButton } from "@components/WhatsappFloatingButton";
import { ScrollToTop } from "@components/ScrollToTop";
import styles from "./home.module.scss";
import Image from "next/image";

const heroImages = [
  {
    src: "/images/hero-jacket-placeholder.jpeg",
    label: "Hand-Painted Graphic Denim Jacket",
  },
  {
    src: "/images/hero-shirt-placeholder.jpeg",
    label: "Graphic Back-Print Hoodie",
  },
  {
    src: "/images/hero-baggy-placeholder.jpeg",
    label: "Custom Hand-Painted Sneakers",
  },
];

const features = [
  {
    title: "Premium Materials",
    description: "Sourced from the finest textile mills worldwide",
    icon: "✨"
  },
  {
    title: "Expert Craftsmanship", 
    description: "Hand-finished by skilled artisans with decades of experience",
    icon: "🎨"
  },
  {
    title: "Custom Fit",
    description: "Tailored to your exact measurements and preferences", 
    icon: "📏"
  },
  {
    title: "Sustainable Process",
    description: "Eco-friendly materials and ethical production methods",
    icon: "🌱"
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Fashion Designer", 
    text: "The attention to detail is incredible. Every piece feels like wearable art.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Creative Director",
    text: "Finally found a brand that matches my vision. The customization process is seamless.",
    rating: 5
  },
  {
    name: "Elena Rodriguez", 
    role: "Stylist",
    text: "My clients are obsessed with their custom pieces. Quality is unmatched.",
    rating: 5
  }
];

// Animation variants for better performance
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });

  return (
    <div className={styles.container}>
      <ScrollToTop />
      <Header />

      <main className={styles.main}>
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <motion.div 
            className={styles.heroCopy}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Luxury custom clothing studio
            </motion.p>

            <motion.h1 
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Where Fashion
              <br />
              <span className={styles.titleAccent}>Meets Art</span>
            </motion.h1>

            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Hand-painted, printed, and embroidered in-house.
              <br />
              Every piece tells your unique story.
            </motion.p>

            <motion.div 
              className={styles.heroCtas}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link href="/customization" className={styles.primaryCta}>
                <span>Start Your Journey</span>
              </Link>
              <Link href="/products" className={styles.secondaryCta}>
                View Gallery
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className={styles.heroCarousel}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {heroImages.map((item, index) => (
              <motion.div
                key={item.src}
                className={styles.heroCard}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={styles.imageShell}>
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={420}
                    height={520}
                    className={styles.image}
                    priority={index === 0}
                  />
                </div>
                <div className={styles.imageLabel}>
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section className={styles.featuresSection} ref={featuresRef}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2>Why Choose Us</h2>
            <p>Experience the difference of true craftsmanship</p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 40 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* METHODS SECTION */}
        <section className={styles.methodsSection}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Customization Techniques</h2>
            <p>Master artisans using time-honored methods</p>
          </motion.div>

          <motion.div 
            className={styles.methodsGrid}
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            {[
              { name: "Hand Painted", desc: "Unique artistic expressions" },
              { name: "DTF Printing", desc: "Vibrant, durable transfers" },
              { name: "DTG Printing", desc: "Direct-to-garment precision" },
              { name: "Puff Print", desc: "Raised, textured designs" },
              { name: "Embroidery", desc: "Classic thread artistry" },
            ].map((item, index) => (
              <motion.div 
                key={item.name} 
                className={styles.methodCard}
                variants={fadeInUp}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className={styles.testimonialsSection} ref={testimonialsRef}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2>What Our Clients Say</h2>
            <p>Stories from fashion enthusiasts worldwide</p>
          </motion.div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className={styles.stars}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p>"{testimonial.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <motion.section 
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className={styles.ctaContent}>
            <h2>Ready to Create Something Extraordinary?</h2>
            <p>Join thousands of satisfied customers who've made their fashion dreams reality</p>
            <Link href="/customization" className={styles.ctaPrimary}>
              <span>Start Customizing Now</span>
            </Link>
          </div>
        </motion.section>
      </main>

      <Footer />
      <WhatsappFloatingButton />
    </div>
  );
}
