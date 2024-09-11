'use client'
import { useEffect, useState } from 'react';
import { getTopTracks } from '../lib/spotify';

export default function TopTracksComponent() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function fetchTopTracks() {
      const response = await getTopTracks();
      if (response && response.data) {
        setTracks(response.data.items); // Assuming the API returns track items in the "items" array
      }
    }

    fetchTopTracks();
  }, []);

  return (
    <div>
      <h2>Your Top Tracks</h2>
      <ul>
        {tracks.length > 0 ? (
          tracks.map(track => (
            <li key={track.id}>
              {track.name} by {track.artists[0].name}
            </li>
          ))
        ) : (
          <p>No top tracks found.</p>
        )}
      </ul>
    </div>
  );
}