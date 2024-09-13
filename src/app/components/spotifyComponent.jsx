'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getNowPlaying, getUserProfile, getTopTracks, getSavedAlbums, getTopArtists, getUserPlaylists, getPlaylistTracks } from '../lib/spotify';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import React from "react";
import { Avatar, Card, CardBody, Image, Button, Slider, Input } from '@nextui-org/react';

import OracleButton from './oracleButton';
import FavoritesShelf from './favoritesShelf';

export default function SpotifyComponent() {
  const { data: session } = useSession();
  const [track, setTrack] = useState(null);
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [genreCounts, setGenreCounts] = useState({});
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [showInput, setShowInput] = useState(false); // Estado para controlar la visibilidad del input

  useEffect(() => {
    async function fetchSpotifyData() {
      if (session && session.accessToken) {
        console.log('CHEQUEO Session:', session);
        try {
          const trackResponse = await getNowPlaying(session.accessToken);
          console.log('CHEQUEO Now Playing Response:', trackResponse);
          setTrack(trackResponse.data);

          const profileResponse = await getUserProfile(session.accessToken);
          console.log('CHEQUEO Profile Response:', profileResponse);
          setProfile(profileResponse.data);

          const topTracksResponse = await getTopTracks(session.accessToken);
          console.log('CHEQUEO Top Tracks Response:', topTracksResponse);
          setTopTracks(topTracksResponse.data.items);

          const savedAlbumsResponse = await getSavedAlbums(session.accessToken);
          console.log('CHEQUEO Saved Albums Response:', savedAlbumsResponse);
          setSavedAlbums(savedAlbumsResponse.data.items);

          const topArtistsResponse = await getTopArtists(session.accessToken);
          console.log('CHEQUEO Top Artists Response:', topArtistsResponse);
          setTopArtists(topArtistsResponse.data.items);

          const playlistsResponse = await getUserPlaylists(session.accessToken);
          setPlaylists(playlistsResponse.data.items);

          const genreMap = {};
          topArtistsResponse.data.items.forEach(artist => {
            artist.genres.forEach(genre => {
              genreMap[genre] = (genreMap[genre] || 0) + 1;
            });
          });
          setGenreCounts(genreMap);

        } catch (error) {
          console.error("Error fetching Spotify data:", error);
        }
      }
    }
    fetchSpotifyData();
  }, [session]);

  // Función para crear la playlist
  const createPlaylist = async () => {
    if (!playlistName) {
      alert("Please enter a name for the playlist.");
      return;
    }
    try {
      const response = await axios.post(
        `https://api.spotify.com/v1/users/${profile.id}/playlists`,
        { name: playlistName, description: 'New playlist created from my app', public: false },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Actualizar la lista de playlists
      const playlistsResponse = await getUserPlaylists(session.accessToken);
      setPlaylists(playlistsResponse.data.items);
      setPlaylistName(""); // Limpiar el campo de texto
      setShowInput(false); // Ocultar el campo de texto después de crear la playlist
      alert(`Playlist ${playlistName} created successfully!`);
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist.", error);
    }
  };
  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const response = await getPlaylistTracks(session.accessToken, playlistId);
      setPlaylistTracks(response.data.items);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    }
  };
  const handlePlaylistClick = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    fetchPlaylistTracks(playlistId);
  };

  const genreData = {
    labels: Object.keys(genreCounts),
    datasets: [
      {
        label: 'Number of Artists',
        data: Object.values(genreCounts),
        backgroundColor: "rgba(30, 215, 96, 1)",
        borderColor: "rgba(30, 215, 96, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Función para eliminar una canción de la playlist
  const removeTrackFromPlaylist = async (trackUri) => {
    try {
      const response = await axios.delete(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
          data: {
            tracks: [{ uri: trackUri }],
          },
        }
      );
      alert(`Track removed from playlist!`);
      // Volver a obtener las canciones de la playlist para actualizar la lista
      fetchPlaylistTracks(selectedPlaylistId);
    } catch (error) {
      console.error("Error removing track:", error);
      alert("Failed to remove track.");
    }
  };

  return (
    <div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <OracleButton />
      </div>

      <div style={{ border: "3px solid #363636", borderRadius: '20px', display: 'flex', height: '300px' }}>
        {/* Contenedor para Input y Botón */}
        <div style={{ backgroundColor: '#363636', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px', display: 'flex', flexDirection: 'column', width: '50%' }}>
          {/* Botón para Mostrar/Ocultar Input */}
          {!showInput && (
            <div style={{ maxHeight: '50px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ textAlign: 'center', color: '#FFFFFF', fontWeight: 'bold', flex: 1 }}>Playlists</h3>
              <Button
                onClick={() => setShowInput(true)} // Mostrar el campo de entrada
                style={{ backgroundColor: '#1DB954', color: '#FFFFFF', fontSize: '20px', marginLeft: '10px' }}
              >
                +
              </Button>
            </div>
          )}

          {/* Input y Botón para Crear Playlist y Cancelar */}
          {showInput && (
            <div style={{ maxHeight: '50px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Input
                clearable
                underlined
                placeholder="Enter playlist name"
                aria-label="Playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                size="md"
                className="max-w-[220px]"
              />
              <Button
                onClick={createPlaylist}
                style={{ backgroundColor: '#1DB954', color: '#FFFFFF', fontSize: '15px', marginLeft: '10px' }}
              >
                Create
              </Button>
              <Button
                onClick={() => setShowInput(false)} // Ocultar el campo de entrada
                style={{ backgroundColor: '#FF0000', color: '#FFFFFF', fontSize: '15px', marginLeft: '10px' }}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Playlist Div */}
          <div style={{ flex: '1' }}>
            {playlists.length > 0 ? (
              <ul style={{ paddingLeft: '20px', listStyleType: 'none', maxHeight: '225px', overflowY: 'auto' }}>
                {playlists.map((playlist) => (
                  <li key={playlist.id} style={{ marginBottom: '8px', color: '#FFFFFF' }}>
                    <button
                      onClick={() => handlePlaylistClick(playlist.id)}
                      style={{ background: 'none', border: 'none', color: '#1DB954', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {playlist.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ textAlign: 'center', color: '#FFFFFF' }}>No playlists available</p>
            )}
          </div>
        </div>

        {/* Tracks Div */}
        <div style={{ width: '50%', paddingLeft: '10px' }}>
          {selectedPlaylistId && (
            <div>
              {playlistTracks.length > 0 ? (
                <ul style={{ paddingLeft: '20px', listStyleType: 'none', marginTop: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                  {playlistTracks.map((track) => (
                    <li key={track.track.id} style={{ marginBottom: '8px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold' }}>
                        {track.track.name} by {track.track.artists[0].name}
                      </span>
                      <Button
                        style={{ backgroundColor: '#FF0000', color: '#FFFFFF' }}
                        onClick={() => removeTrackFromPlaylist(track.track.uri)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ textAlign: 'center', color: '#FFFFFF' }}>No tracks available in this playlist</p>
              )}
            </div>
          )}
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "20px" }}>

        <Card style={{ backgroundColor: '#363636', flex: 1, marginRight: '10px' }}>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: "300px", padding: "20px" }}>
              <div style={{ flex: 1, padding: "20px" }}>
                {/* Profile and now playing track */}
                {profile ? (
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h2 style={{ color: "#FFFFFF", marginBottom: "10px" }}>
                      <strong>{profile.display_name}</strong>
                    </h2>
                    <p style={{ color: "#FFFFFF", fontSize: "14px", marginBottom: "10px" }}>Email: {profile.email}</p>
                    <Image
                      src={profile.images[0]?.url}
                      alt="Profile picture"
                      width="100"
                      style={{
                        borderRadius: "50%",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                ) : (
                  <p style={{ textAlign: "center", color: "#FFFFFF" }}>Loading profile...</p>
                )}

                {track ? (
                  <p style={{ textAlign: "center", color: "#FFFFFF", margin: "20px 0" }}>Now playing: <strong>{track.item.name}</strong></p>
                ) : (
                  <p style={{ textAlign: "center", color: "#FFFFFF", margin: "20px 0" }}>No track playing</p>
                )}

                <h3 style={{ textAlign: "center", color: "#FFFFFF", borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
                  <strong>Top Tracks</strong>
                </h3>
                {topTracks.length > 0 ? (
                  <ul style={{ paddingLeft: "20px", listStyleType: "none", maxHeight: "200px", overflowY: "auto" }}>
                    {topTracks.map((track) => (
                      <li key={track.id} style={{ marginBottom: "8px", color: "#FFFFFF" }}>
                        <span style={{ fontWeight: "bold" }}>{track.name}</span> by {track.artists[0].name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#FFFFFF" }}>No top tracks available</p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card style={{ backgroundColor: '#363636', flex: 1, marginLeft: '10px' }}>
          <CardBody>
            <div style={{ minWidth: "300px", padding: "20px" }}>
              <h3 style={{ textAlign: 'center', color: '#FFFFFF', marginBottom: '10px', fontWeight: 'bold' }}>Saved Albums</h3>
              {savedAlbums.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {savedAlbums.map((album) => (
                    <div key={album.album.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <h4 style={{ color: "#FFFFFF", marginBottom: "5px" }}>
                          <strong>{album.album.name}</strong>
                        </h4>
                        <p style={{ color: "#FFFFFF", fontSize: "14px" }}>Artist: {album.album.artists[0].name}</p>
                      </div>
                      <Image
                        src={album.album.images[0]?.url}
                        alt="Album cover"
                        width="100"
                        style={{
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          display: "block",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: "center", color: "#FFFFFF" }}>No saved albums available</p>
              )}
          </div>
          </CardBody>
        </Card>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "20px", flexWrap: 'wrap', height: '300px' }}>
        <div style={{ flex: '1 1 70%', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ textAlign: 'center', color: '#FFFFFF', marginBottom: '10px', fontWeight: 'bold' }}>
            Genre Counts
          </h3>
          <div style={{ width: '100%', flex: 1, padding: '0 20px' }}>
            <Bar 
              data={genreData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#FFFFFF' // Cambia el color de las etiquetas de la leyenda
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#FFFFFF' // Cambia el color de las etiquetas del eje x
                    },
                    grid: {
                      color: '#FFFFFF' // Cambia el color de las líneas de la cuadrícula del eje x
                    }
                  },
                  y: {
                    ticks: {
                      color: '#FFFFFF' // Cambia el color de las etiquetas del eje y
                    },
                    grid: {
                      color: '#FFFFFF' // Cambia el color de las líneas de la cuadrícula del eje y
                    }
                  }
                }
              }}
              // Aquí defines el color de las barras
              plugins={{
                datalabels: {
                  color: '#FFFFFF' // Cambia el color de las etiquetas de datos
                }
              }}
            />
          </div>
        </div>
        <div style={{ flex: '1 1 30%', minWidth: '300px', height: '100%' }}>
          <FavoritesShelf />
        </div>
      </div>

      <div style={{ marginTop: '20px', maxWidth: '100%', boxSizing: 'border-box' }}>
        <h3 style={{ textAlign: 'center', color: "#FFFFFF", marginBottom: '10px' }}>Top Artists</h3>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '10px',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {topArtists.length > 0 ? (
            topArtists.map((artist) => (
              <div key={artist.id} style={{ display: 'inline-block', textAlign: 'center', marginRight: '20px' }}>
                <Avatar
                  src={artist.images[0]?.url}
                  alt="Artist picture"
                  size="lg"
                  isBordered color="success"
                  className="w-20 h-20 text-large" // Ajustar el tamaño del avatar
                  css={{ marginBottom: "10px" }}
                />
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#777" }}>No top artists available</p>
          )}
        </div>
      </div>


    </div>
  );
}