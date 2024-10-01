import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

import { Header } from '@/components/header';
import { Toaster } from 'sonner';
import { CreateEvent } from '@/components/create-event';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Scheduler',
  description: 'Scheduling app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          <main className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
            {children}
          </main>
          <footer className='bg-blue-100 py-12'>
            <div className='container mx-auto px-4 text-center text-gray-400'>
              Developed by: Almujahid Jamion
            </div>
          </footer>
          <Toaster />
          <CreateEvent />
        </body>
      </html>
    </ClerkProvider>
  );
}
