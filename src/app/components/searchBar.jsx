'use client';
import React, { useEffect, useState } from 'react';
import { getSearchItems } from '../lib/spotify'; // Ensure this function is correctly implemented
import { useSession } from 'next-auth/react';

const SearchBar = () => {
  const { data: session } = useSession();
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query || !session?.accessToken) {
      console.error("No search query or access token found");
      return;
    }

    try {
      const result = await getSearchItems(session.accessToken, query);
      setSearchResults(result.data.tracks.items);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="p-5">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a track..."
        className="bg-gray-800 text-white p-2 rounded"
      />
      <button onClick={handleSearch} className="ml-2 bg-green-500 p-2 rounded">
        Search
      </button>

      <div className="mt-5">
        {searchResults.map((track) => (
          <div key={track.id} className="text-white mb-2">
            <p>{track.name} by {track.artists[0].name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;