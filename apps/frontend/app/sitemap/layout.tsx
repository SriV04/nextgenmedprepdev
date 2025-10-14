import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Site Map | Next Gen Med Prep',
  description: 'Navigate through all resources, guides, and services offered by Next Gen Med Prep. Find medical school interview preparation, UCAT resources, personal statement help, and more.',
  keywords: [
    'sitemap',
    'Next Gen Med Prep navigation',
    'medical school resources',
    'interview preparation',
    'UCAT prep',
    'personal statements',
    'medical school guides'
  ],
  openGraph: {
    title: 'Site Map | Next Gen Med Prep',
    description: 'Complete navigation of Next Gen Med Prep resources and services',
    type: 'website',
  },
};

export default function SitemapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
