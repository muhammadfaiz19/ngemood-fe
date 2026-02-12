import './globals.css';
import { Outfit } from 'next/font/google';
import { Metadata } from 'next';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NgeMood ✨ - AI Mood Tracker for Gen Z',
    template: '%s | NgeMood'
  },
  icons: {
    icon: '/ngemood-logo.png', 
    shortcut: '/ngemood-logo.png',
    apple: '/ngemood-logo.png', 
  },
  description: 'NgeMood adalah aplikasi AI Mood Tracker yang dirancang khusus untuk Gen Z oleh Muhammad Faiz (Empaiss). Pantau emosimu dengan cara yang lebih seru!',
  keywords: ['Mood Tracker', 'AI Mood Tracker', 'Mental Health App', 'Gen Z App', 'Ngemood', 'Muhammad Faiz', 'Empaiss'],
  authors: [{ name: 'Muhammad Faiz', url: 'https://empaiss.my.id' }],
  creator: 'Muhammad Faiz (Empaiss)',
  metadataBase: new URL('https://ngemood.empaiss.my.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NgeMood ✨ - Mood Tracker Masa Kini',
    description: 'Track mood harianmu dengan teknologi AI. Cek karya terbaru dari Muhammad Faiz.',
    url: 'https://ngemood.empaiss.my.id',
    siteName: 'NgeMood',
    images: [
      {
        url: '/ngemood-logo.png', 
        width: 800,
        height: 600,
        alt: 'NgeMood Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NgeMood ✨',
    description: 'AI Mood Tracker by Muhammad Faiz (Empaiss)',
    images: ['/ngemood-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={outfit.className}>
        <div className="min-h-screen flex flex-col items-center justify-center md:py-10 bg-slate-50">
          <div className="w-full md:max-w-4xl bg-white md:rounded-[2.5rem] md:shadow-2xl overflow-hidden min-h-screen md:min-h-[85vh] relative flex flex-col transition-all duration-300">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}