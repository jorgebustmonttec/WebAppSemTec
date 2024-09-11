// components/Playlists.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface PlaylistsProps {
  accessToken: string;
}

const Playlists: React.FC<PlaylistsProps> = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPlaylists(response.data.items);
      } catch (error) {
        setError('Error fetching playlists');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <img src={playlist.images[0]?.url} alt={playlist.name} width="50" height="50" />
            <span>{playlist.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlists;
