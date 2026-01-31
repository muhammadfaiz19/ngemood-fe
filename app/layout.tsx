import './globals.css';
import { Outfit } from 'next/font/google'; // Font modern

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = { title: 'NgeMood ✨', description: 'AI Mood Tracker for Gen Z' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={outfit.className}>
        <div className="min-h-screen flex flex-col items-center justify-center md:py-10">
          {/* Mobile: w-full, min-h-screen (Full layar)
             Desktop: max-w-4xl (Lebih lebar), rounded, shadow (Tampilan App)
          */}
          <div className="w-full md:max-w-4xl bg-white md:rounded-[2.5rem] md:shadow-2xl overflow-hidden min-h-screen md:min-h-[85vh] relative flex flex-col transition-all duration-300">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}