import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { DarshanProvider } from '@/context/DarshanContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://puneganpatidarshan.in'),
  title: 'पुणे गणपती दर्शन | मानाचे गणपती आणि प्रमुख गणपती',
  description:
    'पुण्यातील ५ मानाचे गणपती आणि दगडूशेठ, भाऊ रंगारी, बाबू गेणू, मंडई यांसह प्रमुख गणपतींचे दर्शन घेण्यासाठी सोपा मार्गदर्शक. तुमच्या स्थानानुसार दर्शन क्रम आणि दिशा मिळवा.',
  keywords: [
    'पुणे गणपती',
    'मानाचे गणपती',
    'दगडूशेठ गणपती',
    'गणेशोत्सव पुणे',
    'पुणे गणपती दर्शन',
    'कसबा गणपती',
    'तांबडी जोगेश्वरी',
    'गुरुजी तालीम',
    'तुळशीबाग गणपती',
    'केसरीवाडा गणपती',
  ],
  authors: [{ name: 'पुणे गणपती दर्शन मार्गदर्शक' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'पुणे गणपती दर्शन | मानाचे व प्रमुख गणपती',
    description:
      'पुण्यातील मानाचे आणि प्रमुख गणपतींचे दर्शन सोप्या क्रमाने घ्या. तुमच्या स्थानानुसार योग्य क्रम व दिशा मिळवा.',
    type: 'website',
    locale: 'mr_IN',
  },
  icons: {
    icon: '/images/app-icon.svg',
    apple: '/images/app-icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#EA580C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr" className={notoDevanagari.variable}>
      <body className="min-h-screen bg-[#F4EFEA] text-slate-900 antialiased font-devanagari flex flex-col justify-between">
        <DarshanProvider>
          {/* Centered Mobile App Container */}
          <div className="w-full max-w-md mx-auto min-h-screen bg-background shadow-2xl relative flex flex-col pb-20 border-x border-border/60">
            <Header />
            <main className="flex-1 px-4 py-4">{children}</main>
            <BottomNav />
          </div>
        </DarshanProvider>
      </body>
    </html>
  );
}
