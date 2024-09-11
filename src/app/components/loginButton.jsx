'use client';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@nextui-org/react';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <Button
          color="danger"
          onClick={() => signOut('spotify')}
        >
          Log out
        </Button>
      ) : (
        <Button
          color="success"
          onClick={() => signIn('spotify')}
          className="mr-4"
        >
          Log in with Spotify
        </Button>
      )}
    </div>
  );
}