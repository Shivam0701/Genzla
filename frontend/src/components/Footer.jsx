import styles from "./Footer.module.scss";
import Link from "next/link";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <div className={styles.brand}>GENZLA</div>
          <p className={styles.caption}>
            Crafted-to-order luxury pieces with bespoke artwork and texture-rich
            finishes.
          </p>
        </div>
        <div className={styles.links}>
          <div>
            <div className={styles.sectionLabel}>Social</div>
            <div className={styles.socialRow}>
              <Link href="https://instagram.com" target="_blank">
                Instagram
              </Link>
              <Link href="https://wa.me" target="_blank">
                WhatsApp
              </Link>
            </div>
          </div>
          <div>
            <div className={styles.sectionLabel}>Contact</div>
            <p className={styles.contactText}>
              For collaborations or private fittings, reach us via the contact
              form or WhatsApp.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <span>© {new Date().getFullYear()} GENZLA</span>
        <span>All customization pieces are made-to-order.</span>
      </div>
    </footer>
  );
}

