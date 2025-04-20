import axios from "axios";
import { getRecentlyPlayed } from "../spotifyService.js";

const API_BASE_URL = "https://api.spotify.com/v1/me";

export const getTimeSpent = async (req, res) => {
  try {
    const token = req.session.access_token;
    const recentlyPlayed = await getRecentlyPlayed(token);

    const totalMs = recentlyPlayed.reduce((acc, currTrack) => {
      return acc + currTrack.track.duration_ms;
    }, 0);

    const partOfDay = totalMs / (24 * 60 * 60 * 1000);
    const partOfDayPercentage = Math.round(partOfDay * 100);

    return res.json({
      partOfDayPercentage: partOfDayPercentage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLatestTrack = async (req, res) => {
  try {
    const token = req.session.access_token;
    const url = `${API_BASE_URL}/player/recently-played?limit=1;`;
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
