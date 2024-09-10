'use client'
import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <div>
      <button onClick={() => signIn('spotify')}>Log in with Spotify</button>
    </div>
  );
}