import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" class="dark">
      <head>
      </head>
      <body>
      <Providers>
        <UserProvider>
            {children}
        </UserProvider>
        </Providers>
      </body>
    </html>
  );
}