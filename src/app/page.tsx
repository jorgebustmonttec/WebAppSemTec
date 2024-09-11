'use client';
import { useState } from 'react';
import LoginButton from './components/loginButton';
import { NextUIProvider } from '@nextui-org/react';
import SpotifyComponent from './components/spotifyComponent';
import { useSession } from 'next-auth/react';
import SearchBar from './components/searchBar';

export default function Home() {
  const { data: session, status } = useSession();
  const [showPlaylists, setShowPlaylists] = useState<boolean>(false);

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <NextUIProvider>
      <div className="relative min-h-screen bg-black text-white">
        <main className="p-10">
          <div className="absolute top-5 right-1/2 transform translate-x-1/2 flex items-center">
            <h1 className="text-4xl font-bold text-white">Factorify</h1>
          </div>
          <div>
            <SearchBar />
          </div>
          <div className="absolute top-5 right-5 flex items-center">
            <LoginButton />
          </div>
          <div className="mt-24">
            <SpotifyComponent />
          </div>
        </main>
        <footer className="text-center p-5">
          <p>Este sitio web pertenece al Equipo 1. Cualquier ataque hacia un integrante se considerará como un ataque hacia todos.</p>
        </footer>
      </div>
    </NextUIProvider>
  );
}
