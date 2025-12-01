import type { Metadata } from "next";
import { Karla } from "next/font/google";
import "@/styles/globals.css";
import Link from "next/link";
import MegaMenu from "@/components/home/MegaMenu";
import MobileMenu from "@/components/home/MobileMenu";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';

const karla = Karla({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-karla',
  display: 'swap',
});

const socialLinks: Record<string, string> = {
  "Instagram": "https://www.instagram.com/nextgenmedprep/",
  "Twitter": "https://x.com/NextGenMedPrep",
  "TikTok": "https://www.tiktok.com/@nextgenmedprep",
  "Facebook": "https://www.facebook.com/people/NextGen-MedPrep/61566778581462/",
}

interface MenuItem {
  title: string;
  href: string;
}

interface MegaMenuConfig {
  title: string;
  href?: string;
  items: MenuItem[];
}

const megaMenuItems: MegaMenuConfig[] = [
  {
    title: "About",
    items: [
      { title: "Join the Team", href: "/about/join-the-team" },
    ],
  },
  {
    title: "Get Started",
    items: [
      { title: "Ultimate Medicine Application Guide", href: "/resources/ultimate-medicine-application-guide" },
      { title: "Ultimate Dentistry Application Guide", href: "/resources/ultimate-dentistry-application-guide" },
    ],
  },
  {
    title: "Interviews",
    items: [
      { title: "Free Interview Resources", href: "/interviews/free-resources" },
      { title: "Panel Interviews", href: "/interviews/panel-interviews" },
      { title: "MMIs", href: "/interviews/mmis" },
    ],
  },
  {
    title: "UCAT",
    items: [
      { title: "Ultimate UCAT Prep Guide", href: "/resources/ultimate-ucat-prep-guide" },
      { title: "Conferences", href: "/events" },
      { title: "Tutoring Packages", href: "/ucat#tutoring-packages" },
    ],
  },
  {
    title: "Personal Statements",
    items: [
      { title: "Free Personal Statement Guide", href: "/resources/free-personal-statement-guide" },
      { title: "Medicine Statements", href: "/personal-statements/medicine" },
      { title: "Dental Statements", href: "/personal-statements/dental" },
    ],
  },
  {
    title: "Events",
    href: "/events",
    items: [],
  },
  {
    title: "Prometheus",
    href: "/prometheus",
    items: [],
  },
];

export const metadata: Metadata = {
  title: "NextGenMedPrep",
  description: "High-impact tutoring and guidance for medicine & dentistry applicants.",
  icons: {
    icon: [
      // { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/NGMP logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/NGMP logo.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${karla.variable} font-sans`}>
      {/* Apply custom background and text colors, and font family */}
      <body className="bg-background-primary text-text-primary font-sans overflow-x-hidden">
        <header className="w-full bg-background-secondary border-b border-border-accent fixed top-0 z-[100]">
          <div className="w-full px-3 sm:px-4 py-3 mx-auto">
            <div className="flex items-center justify-between min-w-0 max-w-full">
              <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                <Link href="/" className="flex items-center space-x-2">
                  <img
                    src="/NGMP logo.png"
                    alt="NextGenMedPrep Logo"
                    className="h-8 sm:h-10 w-auto"
                  />
                  <span className="text-sm sm:text-lg font-bold text-gradient-primary">
                    NextGenMedPrep
                  </span>
                </Link>
              </div>
              <div className="hidden lg:block"></div>
                <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-4">
                  <div className="flex items-center space-x-1">
                    {megaMenuItems.map((menuConfig) => (
                      <MegaMenu
                        key={menuConfig.title}
                        title={menuConfig.title}
                        href={menuConfig.href}
                        items={menuConfig.items}
                      />
                    ))}
                  </div>
              </nav>
              
              <MobileMenu megaMenuItems={megaMenuItems} />
            </div>
          </div>
        </header>

        <main className="mt-16">{children}</main>

        <footer className="w-full bg-gray-50 border-t border-gray-100 py-10 px-4"> {/* Consider using background-primary and border-primary here as well */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center mb-6 md:mb-0">
                <img
                  src="/NGMP logo.png"
                  alt="NextGenMedPrep Logo"
                  className="w-10 h-10 mr-2"
                />
                <span className="text-lg font-bold text-text-primary">NextGenMedPrep</span>
              </div>
              <div className="flex space-x-4">
                {[
                  { name: 'Twitter', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
                  { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                  { name: 'TikTok', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
                  { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={socialLinks[social.name as keyof typeof socialLinks]}
                    className="bg-background-secondary p-3 rounded-full shadow-subtle hover:shadow-DEFAULT transition-all duration-300"
                    aria-label={social.name}
                  >
                    <svg
                      className="w-5 h-5 fill-current text-text-primary"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-text-secondary text-sm">
              <div className="text-center md:text-left">
                &copy; {new Date().getFullYear()} NextGenMedPrep. All rights reserved.
              </div>
              <div className="flex gap-6">
                <Link 
                  href="/interviews/terms" 
                  className="hover:text-accent-primary transition-colors underline"
                >
                  Terms & Conditions
                </Link>
                <a 
                  href="mailto:contact@nextgenmedprep.com" 
                  className="hover:text-accent-primary transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </footer>
        <SpeedInsights />
        <Analytics/>
      </body>
    </html>
  );
}