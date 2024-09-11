'use client';

import React, { useEffect, useState } from 'react';
import { getSearchItems, addTrackToPlaylist } from '../lib/spotify'; 
import { useSession } from 'next-auth/react';
import { Input } from "@nextui-org/react";
import axios from 'axios';
import { Image, Button } from '@nextui-org/react';

const SearchBar = () => {
  const { data: session } = useSession();
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);


  useEffect(() => {
    const handleSearch = async () => {
      if (!debouncedQuery || !session?.accessToken) {
        return;
      }

      try {
        const result = await getSearchItems(session.accessToken, debouncedQuery);
        setSearchResults(result.data.tracks.items);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    handleSearch();
  }, [debouncedQuery, session?.accessToken]);


  useEffect(() => {
    const fetchPlaylists = async () => {
      if (showPlaylists && session?.accessToken) {
        try {
          const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          setPlaylists(response.data.items);
        } catch (error) {
          console.error("Error fetching playlists:", error);
        }
      }
    };

    fetchPlaylists();
  }, [showPlaylists, session?.accessToken]);

  const handleAddToPlaylist = (track) => {
    setSelectedTrack(track);
    setShowPlaylists(true);
  };

  const handleSelectPlaylist = (playlistId) => {
    setSelectedPlaylist(playlistId);
  };

  const handleAddTrackToPlaylist = async () => {
    if (selectedTrack && selectedPlaylist && session?.accessToken) {
      try {
        await addTrackToPlaylist(session.accessToken, selectedPlaylist, selectedTrack.id);
        alert('Track added to playlist!');
        setShowPlaylists(false);
        setSelectedTrack(null);
        setSelectedPlaylist(null);
      } catch (error) {
        console.error("Error adding track to playlist:", error);
      }
    }
  };

  return (
    <div className="relative grid grid-cols-3 gap-4 mt-11">
      <div className="col-span-2">
        <Input
          type="text"
          label="Search for a track..."
          value={query}
          variant="underlined"
          onChange={(e) => setQuery(e.target.value)}
          className=" text-white p-2 rounded w-full"
        />
      </div>

      <div className="col-span-3 grid gap-2 h-80 overflow-y-auto">
        {searchResults.length > 0 ? (
          searchResults.map((track) => (
            <div key={track.id} className="flex items-center p-2 rounded">
              <Image src={track.album.images[0]?.url} alt={track.name} className="w-16 h-16 mr-4" />
              <div className="flex-1">
                <p className="text-white">{track.name} by {track.artists[0].name}</p>
                <Button
                  className=" text-white px-2 py-1 rounded"
                  color =  "warning"
                  onClick={() => handleAddToPlaylist(track)}
                >
                  Add to Playlist
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white"></p>
        )}
      </div>

      {showPlaylists && (
        <div className="absolute top-20 left-0 w-full bg-gray-800 p-4 z-10 flex flex-col items-start">
          <h2 className="text-white mb-2">Select a Playlist</h2>
          <ul className="flex flex-wrap gap-4 mb-4">
            {playlists.map((playlist) => (
              <li key={playlist.id} className="text-white">
                <Button
                  className={`bg-green-500 text-white px-2 py-1 rounded ${selectedPlaylist === playlist.id ? 'bg-green-700' : ''}`}
                  onClick={() => handleSelectPlaylist(playlist.id)}
                >
                  {playlist.name}
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex space-x-2">
            <Button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={handleAddTrackToPlaylist}
            >
              Confirm
            </Button>
            <Button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => setShowPlaylists(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;