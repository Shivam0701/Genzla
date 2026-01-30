"use client";

import { motion } from "framer-motion";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { WhatsappFloatingButton } from "@components/WhatsappFloatingButton";
import styles from "./about.module.scss";

export default function AboutPage() {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroSection}
        >
          <h1 className={styles.title}>About GENZLA</h1>
          <p className={styles.lead}>
            GENZLA is a luxury clothing brand that transforms everyday
            silhouettes into gallery-grade pieces through bespoke customization
            techniques.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className={styles.contentSection}
        >
          <div className={styles.contentBlock}>
            <h2>Our Philosophy</h2>
            <p>
              We believe clothing should be an extension of personal expression.
              Every piece that leaves our studio is designed, finished, and
              inspected in-house, ensuring that each customization meets our
              standards for quality and artistry.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h2>Customization Techniques</h2>
            <p>
              From hand-painted denim that carries visible brushwork texture to
              depth-rich puff prints that add structural dimension, we offer
              multiple disciplines. Each technique is selected to best serve
              your design vision and the base product you choose.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h2>Made-to-Order Process</h2>
            <p>
              All customization pieces are made-to-order. This approach allows
              us to focus on quality over quantity and ensures that every
              customer receives a unique piece tailored to their specifications.
              We work closely with clients throughout the process, from initial
              design consultation to final inspection.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h2>Retail Launch</h2>
            <p>
              We're preparing to launch our retail collection. Stay tuned for
              updates on ready-to-wear pieces that maintain the same attention
              to detail and luxury finish as our custom work.
            </p>
          </div>
        </motion.section>
      </main>
      <Footer />
      <WhatsappFloatingButton />
    </div>
  );
}
