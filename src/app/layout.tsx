import type { Metadata } from 'next';
import './globals.css';
import EmergencyBanner from '@/components/EmergencyBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SEVA | Mother and Child Care Platform',
  description: 'Evidence-based maternal and infant care guidance, appointment organizer, care tracker, and verified healthcare provider directory.',
  keywords: 'pregnancy, maternal health, postpartum care, newborn care, lactation support, pediatric well-check, preeclampsia warning signs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="flex flex-col min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900">
        <EmergencyBanner />
        <Navbar />
        <main className="flex-1 w-full" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
