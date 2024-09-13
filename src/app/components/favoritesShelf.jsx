"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { FaSpotify, FaTrashAlt } from 'react-icons/fa';

const FavoritesShelf = () => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState({
    album: null,
    artist: null,
    track: null,
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get(`/api/oracle?email=${session.user.email}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const { rows } = response.data;
          if (rows.length > 0) {
            const { songId, albumId, artistId } = JSON.parse(rows[0].favorites);
            setFavorites({ album: albumId, artist: artistId, track: songId });
          }
        } catch (error) {
          console.error('Error fetching user favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, [session?.accessToken, session?.user?.email]);

  const fetchSpotifyDetails = async (type, id) => {
    if (!id) return null;
    try {
      const response = await axios.get(`https://api.spotify.com/v1/${type}s/${id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      return null;
    }
  };

  const [albumDetails, setAlbumDetails] = useState(null);
  const [artistDetails, setArtistDetails] = useState(null);
  const [trackDetails, setTrackDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (favorites.album) {
        const details = await fetchSpotifyDetails('album', favorites.album);
        setAlbumDetails(details);
      }
      if (favorites.artist) {
        const details = await fetchSpotifyDetails('artist', favorites.artist);
        setArtistDetails(details);
      }
      if (favorites.track) {
        const details = await fetchSpotifyDetails('track', favorites.track);
        setTrackDetails(details);
      }
    };

    fetchDetails();
  }, [favorites]);

  const renderFavorite = (type, details) => {
    if (!details) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', width: '100%', height: 'calc(100% / 3 - 10px)', padding: '5px 0' }}>
          <div style={{ width: 'auto', height: '100%', borderRadius: '8px', backgroundColor: 'red', marginRight: '10px', aspectRatio: '1' }}></div>
          <div style={{ color: '#FFFFFF', flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Favorite {type}</p>
            <p style={{ margin: 0 }}>Not set. Use the search bar to add one.</p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', width: '100%', height: 'calc(100% / 3 - 10px)', padding: '5px 0' }}>
        <div style={{ width: 'auto', height: '100%', borderRadius: '8px', backgroundColor: '#4682B4', marginRight: '10px', aspectRatio: '1' }}>
          <img src={details.images?.[0]?.url} alt={details.name} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
        </div>
        <div style={{ color: '#FFFFFF', flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Favorite {type}</p>
          <p style={{ margin: 0 }}>{details.name}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px' }}>
          <a href={details.external_urls.spotify} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#1DB954', border: 'none', borderRadius: '50%', width: '30px', height: '30px', marginBottom: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FaSpotify color="white" size={20} />
          </a>
          <button style={{ backgroundColor: '#FF0000', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FaTrashAlt color="white" size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: '#363636', borderRadius: '10px', padding: '10px', height: '100%' }}>
      <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontWeight: 'bold' }}>Favorites</h3>
      {renderFavorite('Album', albumDetails)}
      {renderFavorite('Artist', artistDetails)}
      {renderFavorite('Track', trackDetails)}
    </div>
  );
};

export default FavoritesShelf;