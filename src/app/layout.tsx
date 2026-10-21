import type { Metadata } from 'next';
import './globals.css';
import EmergencyBanner from '@/components/EmergencyBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'MaatruSetu | Mother & Newborn Care Platform (SEVA Continuum)',
  description: 'Evidence-based maternal and infant care guidance, 42-day postnatal care continuum, ASHA supervisor monitor, appointment organizer, care tracker, and verified healthcare provider directory.',
  keywords: 'maatrusetu, seva, maternal health, 42-day continuum, asha worker portal, newborn care, postpartum recovery, lactation support, pediatric well-check, preeclampsia warning signs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="flex flex-col min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900">
        <AuthProvider>
          <LanguageProvider>
            <EmergencyBanner />
            <Navbar />
            <main className="flex-1 w-full" id="main-content">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
