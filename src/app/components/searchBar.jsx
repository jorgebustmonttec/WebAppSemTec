'use client';
import React, { useEffect, useState } from 'react';
import { getSearchItems } from '../lib/spotify'; 
import { useSession } from 'next-auth/react';
import { Input } from "@nextui-org/input";

const SearchBar = () => {
  const { data: session } = useSession();
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the query to prevent frequent API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Delay in milliseconds before setting the debounced query

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
    <div className="grid grid-cols-2 align-middle mt-11">
      <div className="w-60 h-20 col-span-1">
        <Input
          type="text"
          label="Search for a track..."
          value={query}
          variant="underlined"
          onChange={(e) => setQuery(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded"
        />
      </div>

      <div className="grid col-span-2 h-60 overflow-y-auto">
        {searchResults.length > 0 ? (
          searchResults.map((track) => (
            <div key={track.id} className="text-white mb-2">
              <p>{track.name} by {track.artists[0].name}</p>
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