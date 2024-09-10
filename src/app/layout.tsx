import { Providers } from "./providers";
import "./globals.css";
import SpotifyWebApi from 'spotify-web-api-node';
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
      </head>
      <body>
      <Providers>
            {children}
      </Providers>
      </body>
    </html>
  );
}