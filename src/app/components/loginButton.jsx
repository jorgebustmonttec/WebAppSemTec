'use client'
import { signIn } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import { signOut } from 'next-auth/react';

export default function Home() {
  return (
    <div>
      <Button color="success"onClick={() => signIn('spotify')}>Log in with Spotify</Button>


      <Button color = "danger" onClick={() => signOut('spotify')}>Log out</Button>

      </div>

  );
}