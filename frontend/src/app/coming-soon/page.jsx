"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { WhatsappFloatingButton } from "@components/WhatsappFloatingButton";
import styles from "./coming-soon.module.scss";

export default function ComingSoonPage() {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={styles.content}
        >
          <h1 className={styles.title}>Retail Launch</h1>
          <p className={styles.subtitle}>
            Our retail collection is coming soon. Sign up to be notified when
            ready-to-wear pieces become available.
          </p>
          <div className={styles.cta}>
            <a href="/contact" className={styles.button}>
              Get Notified
            </a>
          </div>
        </motion.div>
      </main>
      <Footer />
      <WhatsappFloatingButton />
    </div>
  );
}
