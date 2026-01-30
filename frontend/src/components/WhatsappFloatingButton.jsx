"use client";

import Link from "next/link";
import styles from "./WhatsappFloatingButton.module.scss";

export function WhatsappFloatingButton() {
  return (
    <Link
      href="https://wa.me/0000000000"
      target="_blank"
      className={styles.fab}
      aria-label="Chat on WhatsApp"
    >
      <span className={styles.icon}>WA</span>
    </Link>
  );
}

