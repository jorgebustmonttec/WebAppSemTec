import axios from 'axios';
// Aqui se escriben las funciones que se encargan de hacer las peticiones a la API de Spotify.
// Estas funciones se utilizan en los componentes de React para obtener información de la cuenta de Spotify del usuario.
// Por ejemplo, la función getNowPlaying(token) se utiliza para obtener la canción que el usuario está escuchando actualmente.

const API_BASE_URL = 'https://api.spotify.com/v1';

export async function getNowPlaying(token) {
  return axios.get(`${API_BASE_URL}/me/player/currently-playing`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUserProfile(token) {
  return axios.get(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getTopTracks(token) {
  return axios.get(`${API_BASE_URL}/me/top/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getSavedAlbums(token) {
  return axios.get(`${API_BASE_URL}/me/albums`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getTopArtists(token) {
  return axios.get(`${API_BASE_URL}/me/top/artists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getSearchItems(token, query) {
  return axios.get(`${API_BASE_URL}/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: 'track',
    }
  });
}

export async function getPlaylists(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/me/playlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
}

export async function addTrackToPlaylist(token, playlistId, trackId) {
  return axios.post(
    `${API_BASE_URL}/playlists/${playlistId}/${trackId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        playlistId: playlistId,
        trackId: trackId,
      }
    }
  );
}
