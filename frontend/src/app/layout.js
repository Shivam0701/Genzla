import "./globals.scss";
import styles from "./layout.module.scss";
import { ThemeProvider } from "@components/ThemeContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata = {
  title: "GENZLA – Luxury Custom Clothing",
  description: "GENZLA is a luxury clothing brand offering bespoke customization on premium pieces.",
};

// Theme initialization script
const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('genzla-theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      document.body.classList.add('theme-' + theme);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
      document.body.classList.add('theme-light');
    }
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={playfairDisplay.className}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={styles.body}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <ThemeProvider>{children}</ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
