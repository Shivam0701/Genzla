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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={playfairDisplay.className} data-theme="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('genzla-theme') || 'light';
                  if (document.documentElement) {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                  if (document.body) {
                    document.body.setAttribute('data-theme', theme);
                  }
                } catch (e) {
                  if (document.documentElement) {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                  if (document.body) {
                    document.body.setAttribute('data-theme', 'light');
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className={styles.body} data-theme="light">
        <ThemeProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-client-id"}>
            {children}
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
