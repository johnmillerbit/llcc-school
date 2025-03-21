import type { Metadata } from 'next';
import './globals.css';
import { Noto_Sans_Lao } from 'next/font/google';
import { HeroProvider } from './providers/HeroProvider';
import AuthProvider from './providers/AuthProvider';

const notoSans = Noto_Sans_Lao({
  subsets: ['lao', 'latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-50">
      <body className={notoSans.className}>
        <main>
          <AuthProvider>
            <HeroProvider>{children}</HeroProvider>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
