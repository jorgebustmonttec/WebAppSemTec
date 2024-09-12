'use client';

import React, { useEffect, useState } from 'react';
import { getSearchItems, addTrackToPlaylist } from '../lib/spotify'; 
import { useSession } from 'next-auth/react';
import { Input } from "@nextui-org/react";
import axios from 'axios';
import { Image } from '@nextui-org/react';
import { FaSpotify } from 'react-icons/fa';

const SearchBar = () => {
  const { data: session } = useSession();
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [queryType, setQueryType] = useState('track'); // New state for query type

  // Debounce the query to prevent frequent API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Fetch search results when the debounced query or session token changes
  useEffect(() => {
    const handleSearch = async () => {
      if (!debouncedQuery || !session?.accessToken) {
        return;
      }

      console.log(`Searching for ${debouncedQuery} as ${queryType}`);
      try {
        const result = await getSearchItems(session.accessToken, debouncedQuery, queryType);
        console.log('API response:', result.data);
        const items = result.data[`${queryType}s`]?.items || [];
        console.log('Search results:', items);
        setSearchResults(items);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    handleSearch();
  }, [debouncedQuery, session?.accessToken, queryType]);

  // Fetch playlists when the playlists view is shown
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (showPlaylists && session?.accessToken) {
        try {
          const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          console.log('Fetched playlists:', response.data.items);
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

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative grid grid-cols-3 gap-4 mt-11">
      <div className="col-span-2 relative">
        <Input
          type="text"
          label="Search for a track..."
          value={query}
          variant="underlined"
          onChange={(e) => setQuery(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded w-full"
        />
        {query && (
          <button
            className="absolute right-2 top-2 text-white"
            onClick={clearSearch}
          >
            X
          </button>
        )}
      </div>

      <div className="col-span-3 flex justify-center space-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded ${queryType === 'track' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'}`}
          onClick={() => setQueryType('track')}
        >
          Songs
        </button>
        <button
          className={`px-4 py-2 rounded ${queryType === 'artist' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'}`}
          onClick={() => setQueryType('artist')}
        >
          Artists
        </button>
        <button
          className={`px-4 py-2 rounded ${queryType === 'album' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'}`}
          onClick={() => setQueryType('album')}
        >
          Albums
        </button>
      </div>

      <div className="col-span-3 grid gap-2">
        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <div key={item.id} className="flex items-center p-2 bg-gray-800 rounded">
              <Image src={item.images?.[0]?.url || item.album?.images?.[0]?.url} alt={item.name} className="w-16 h-16 mr-4" />
              <div className="flex-1">
                <p className="text-white">
                  {item.name} 
                  {queryType === 'track' && item.artists?.[0] && ` by ${item.artists[0].name}`}
                </p>
                <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-green-500 ml-2">
                  <FaSpotify size={24} />
                </a>
                {queryType === 'track' && (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => handleAddToPlaylist(item)}
                  >
                    Add to Playlist
                  </button>
                )}
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
                <button
                  className={`bg-green-500 text-white px-2 py-1 rounded ${selectedPlaylist === playlist.id ? 'bg-green-700' : ''}`}
                  onClick={() => handleSelectPlaylist(playlist.id)}
                >
                  {playlist.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={handleAddTrackToPlaylist}
            >
              Confirm
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => setShowPlaylists(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;