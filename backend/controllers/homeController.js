import axios from "axios";
import redisClient from "../middlewares/redisClient.js";

const API_BASE_URL = "https://api.spotify.com/v1";
const playlistFollowersCache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getLatestTrack(req, res) {
    const token = req.cookies.token;

    if (!token) {return res.status(401).json({ error: "Unauthorized" })};
    
    const userId = req.user?.id;
    const spotifyToken = await redisClient.get(`spotify:${userId}`);

    if (!spotifyToken) {return res.status(401).json({ error: "Spotify token expired" })};

    const headers = {Authorization: `Bearer ${spotifyToken}`};

    try {
        const currentUrl = `${API_BASE_URL}/me/player/currently-playing`;
        const currentRes = await axios.get(currentUrl, { headers });
        let trackData = null;

        if (currentRes.data && currentRes.data.item) {
            trackData = currentRes.data.item;
        } else {
            const url = `${API_BASE_URL}/me/player/recently-played?limit=1;`;
            const response = await axios.get(url, { headers });

            trackData = response.data.items[0].track;
        }
        
        return res.json({
            name: trackData.name,
            artists: trackData.artists
                .map((artist) => artist.name)
                .join(", "),
            image: trackData.album.images[0]?.url,
            spotifyUrl: trackData.external_urls.spotify,
            previewUrl: trackData.preview_url,
        });
    } catch (error) {
        console.error("Error fetching latest played track:", error.message);
        throw error;
    }
    };

export async function getPlaylistFollowers(req, res) {
    const token = req.cookies.token;
    if (!token) {return res.status(401).json({ error: "Unauthorized" })};

    const userId = req.user?.id;
    const spotifyToken = await redisClient.get(`spotify:${userId}`);
    if (!spotifyToken) return res.status(401).json({ error: "Spotify token expired" });

    const now = Date.now();
    const cacheEntry = playlistFollowersCache[userId];
    if (cacheEntry && (now - cacheEntry.timestamp < CACHE_TTL)) {
        console.log("Returning cached playlist followers count");
        return res.json({ followers: cacheEntry.followers });
    }

    const headers = { Authorization: `Bearer ${spotifyToken}` };
    try {
        const url = `${API_BASE_URL}/me/playlists`;
        const playlistsRes = await axios.get(url, { headers });
        const playlists = playlistsRes.data.items;

        const filteredPlaylists = playlists.filter(
            (playlist) => playlist.owner.id === userId
        );

        let followers = 0;
        for (const playlist of filteredPlaylists) {
            const playlistId = playlist.id;
            const url = `${API_BASE_URL}/playlists/${playlistId}`;
            const res = await axios.get(url, { headers });
            if (res.data.followers) {
                followers += res.data.followers.total;
            }
        }

        playlistFollowersCache[userId] = {
            followers,
            timestamp: now
        };

        return res.json({followers});
    } catch (error) {
        console.error("Error fetching playlist followers:", error.message);
        res.status(500).json({ error: error.message });
    }
    }
