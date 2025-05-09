import axios from "axios";

const API_BASE_URL = "https://api.spotify.com/v1";

export const getLatestTrack = async (req, res) => {
  try {
    const token = req.session.access_token;
    const url = `${API_BASE_URL}/me/player/recently-played?limit=1;`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const latestTrack = response.data.items[0];
    return res.json({
      name: latestTrack.track.name,
      id: latestTrack.track.id,
      name: latestTrack.track.name,
      artists: latestTrack.track.artists
        .map((artist) => artist.name)
        .join(", "),
      album: latestTrack.track.album.name,
      image: latestTrack.track.album.images[0]?.url,
      spotifyUrl: latestTrack.track.external_urls.spotify,
      duration: latestTrack.track.duration_ms,
    });
  } catch (error) {
    console.error("Error fetching recently played tracks:", error.message);
    throw error;
  }
};

export const getPlaylistFollowers = async (req, res) => {
  const token = req.session.access_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  } 

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const url = `${API_BASE_URL}/me/playlists?limit=50`;
    const playlistsRes = await axios.get(url, {headers});
    const playlists = playlistsRes.data.items;

    let followers = 0;
    for (const playlist of playlists) {
      const playlistId = playlist.id;
      const url = `${API_BASE_URL}/playlists/${playlistId}`;
      const response = await axios.get(url, { headers });
      if (response.data.followers) {
        followers += response.data.followers.total;
      }
    }

    return res.json({ followers });
  } catch (error) {
    console.error("Error fetching playlist followers:", error.message);
    res.status(500).json({ error: error.message });
  }
}
