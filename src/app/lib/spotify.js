import axios from 'axios';

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
