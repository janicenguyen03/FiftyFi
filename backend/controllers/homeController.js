import axios from "axios";

const API_BASE_URL = "https://api.spotify.com/v1";

export async function getLatestTrack(req, res) {
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
      artists: latestTrack.track.artists
        .map((artist) => artist.name)
        .join(", "),
      image: latestTrack.track.album.images[0]?.url,
      spotifyUrl: latestTrack.track.external_urls.spotify,
      previewUrl: latestTrack.track.preview_url,
    });
  } catch (error) {
    console.error("Error fetching recently played tracks:", error.message);
    throw error;
  }
};

export async function getPlaylistFollowers(req, res) {
  const token = req.session.access_token;
  const now = new Date();
  const lastFetchedTimeDate = req.session.lastFetchedTime ? new Date(req.session.lastFetchedTime) : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  };
  if (
    req.session.playlistSaveCounts &&
    req.session.lastFetchedTime &&
    (now - lastFetchedTimeDate) < 60 * 60 * 1000
  ) {
    console.log("Returning cached playlist followers count");
    return res.json(req.session.playlistSaveCounts);
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const userId = req.session.user.id;
    const url = `${API_BASE_URL}/me/playlists`;
    const playlistsRes = await axios.get(url, { headers });
    const playlists = playlistsRes.data.items;

    const filteredPlaylists = playlists.filter(
      (playlist) => playlist.owner.id === userId
    );

    let followers = 0;
    for (const playlist of filteredPlaylists) {
      console.log("Playlist:", playlist.name);
      const playlistId = playlist.id;
      const url = `${API_BASE_URL}/playlists/${playlistId}`;
      const response = await axios.get(url, { headers });
      if (response.data.followers) {
        followers += response.data.followers.total;
      }
    }
    
    req.session.lastFetchedTime = now.toISOString();
    req.session.playlistSaveCounts = followers;

    return res.json(req.session.playlistSaveCounts);
  } catch (error) {
    console.error("Error fetching playlist followers:", error.message);
    res.status(500).json({ error: error.message });
  }
}
