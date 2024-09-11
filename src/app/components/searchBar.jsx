'use client';
import React, { useEffect, useState } from 'react';
import { getSearchItems, getPlaylists, addTrackToPlaylist } from '../lib/spotify'; 
import { useSession } from 'next-auth/react';
import { Input } from "@nextui-org/input";
import {Image} from '@nextui-org/react';
import { Button } from '@nextui-org/react';

const SearchBar = () => {
  const { data: session } = useSession();
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

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

  return (
    <div className="grid grid-cols-2 mt-11">
      <div className="w-60 h-20 col-span-1">
        <Input
          type="text"
          label="Search for a track..."
          value={query}
          variant="underlined"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid col-span-2 h-60 overflow-y-auto">
        {searchResults.length > 0 ? (
          searchResults.map((track) => (
            <div key={track.id} className="text-white mb-2 grid grid-cols-3 items-center justify-items-start">
              <Image className="w-20 h-20 col-span-1" src={track.album.images[0].url} alt="Album cover" />
              <p className="italic font-bold col-span-1">{track.name} by {track.artists[0].name}</p>
              <div className="flex justify-end">
                <Button className="w-32 ml-2" id={track.id} color="warning" onClick={() => console.log('Track added to playlist')}>
                  Add to playlist
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white"></p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;