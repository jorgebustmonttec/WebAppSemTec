'use client'
import { ReactNode } from 'react';
import { Providers } from "./providers";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <head></head>
      <body>
        <SessionProvider>
          <Providers>
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}