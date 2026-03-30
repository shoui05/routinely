import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '400',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Routinely — AI Daily Routine Generator',
  description: 'Build a personalized daily routine using Gemini AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="bg-[#0e0f11] text-[#f0ede8] antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
