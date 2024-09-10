'use client'
import { useState, useEffect } from 'react'; // Import React hooks
import { getNowPlaying } from '../lib/spotify'; // Ensure getNowPlaying is correctly defined in lib/spotify.js

export default function NowPlaying() {
  const [track, setTrack] = useState(null); // Define state

  useEffect(() => {
    async function fetchTrack() {
      try {
        const response = await getNowPlaying(); // Call API to get now playing track
        setTrack(response.data); // Update state with the response data
      } catch (error) {
        console.error("Error fetching now playing track:", error); 
      }
    }
    fetchTrack(); 
  }, []); 

  return (
    <div>
      {track ? <p>Now playing: {track.item.name}</p> : <p>No track playing</p>}
    </div>
  );
}