'use client'
import { Providers } from "./providers";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head></head>
      <body>
        {/* Wrap the entire component tree with SessionProvider */}
        <SessionProvider>
          <Providers>
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}