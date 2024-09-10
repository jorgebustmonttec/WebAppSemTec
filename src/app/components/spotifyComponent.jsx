'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getNowPlaying } from '../lib/spotify';

export default function SpotifyComponent() {
  const { data: session } = useSession();
  const [track, setTrack] = useState(null);

  useEffect(() => {
    async function fetchTrack() {
      if (session && session.accessToken) {
        try {
          const response = await getNowPlaying(session.accessToken); // Pass the access token
          setTrack(response.data);
        } catch (error) {
          console.error("Error fetching now playing track:", error);
        }
      }
    }
    fetchTrack();
  }, [session]);

  return (
    <div>
      {track ? <p>Now playing: {track.item.name}</p> : <p>No track playing</p>}
    </div>
  );
}