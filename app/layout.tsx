'use client';

import Sidebar from '@/components/Sidebar';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <SessionProvider>
        <body className='flex bg-gray-800 text-gray-300'>
          <Sidebar />
          <main className='md:absolute md:ml-[20vw]'>{children}</main>
        </body>
      </SessionProvider>
    </html>
  );
}
