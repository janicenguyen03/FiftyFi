import axios from "axios";

const API_BASE_URL = "https://api.spotify.com/v1";

function splitTracksByTime(recentlyPlayed) {
    const before12PM = [];
    const after12PM = [];

    recentlyPlayed.forEach((track) => {
        const playedAt = new Date(track.played_at);
        const hours = playedAt.getHours();

        if (hours >= 0 && hours < 12) {
            before12PM.push(track);
        } else {
            after12PM.push(track);
        }
    });

    return { before12PM, after12PM };
}

function cleanRecentlyPlayed(recentlyPlayed) {
    const sorted = recentlyPlayed.slice().sort((a, b) => new Date(b.played_at) - new Date(a.played_at));

    let seen = new Set();
    let repeated = 0;
    const deduped = sorted.filter(item => {
        const playedAt = item.played_at;
        const trackId = item.track?.id;
        if (!playedAt || !trackId) {
            console.warn("Missing data for item", item);
            return false;
        }
        const key = trackId + playedAt;
        if (seen.has(key)) {
            repeated++;
            return false;
        }
        seen.add(key);
        return true;
    });

    const cleaned = [];
    for (let i = 0; i < deduped.length - 1; i++) {
        const current = deduped[i];
        const next = deduped[i + 1];
        const duration = new Date(current.played_at) - new Date(next.played_at);
        if (duration >= 0) {
            cleaned.push(current);
        }
    }

    if (deduped.length > 0) {
        cleaned.push(deduped[deduped.length - 1]);
    }

    return cleaned;
}

export async function getArtistInfo(token, artistIds) {
    const allArtists = [];
    const chunkSize = 50;
    const chunks = [];

    for (let i = 0; i < artistIds.length; i += chunkSize) {
        chunks.push(artistIds.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
        const idsParam = chunk.join(",");
        const url = `${API_BASE_URL}/artists?ids=${idsParam}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            allArtists.push(...response.data.artists);
        } catch (error) {
            console.error("Failed to fetch artist chunk:", error.message);
        }
    }
    return allArtists;
};

export async function getTopItems(token, type) {
    const url = `${API_BASE_URL}/me/top/${type}?limit=6&time_range=short_term`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.items;
    } catch (error) {
        console.error("Error fetching top items:", error.message);
        throw error;
    }
};

export async function getRecentlyPlayed(req, token) {
    const now = new Date();
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const lastFetchedTimeDate = req.session.lastFetchedTime ? new Date(req.session.lastFetchedTime) : null;


    if (req.session.cachedRecentPlayed && 
        req.session.lastFetchedTime && 
        (now - lastFetchedTimeDate) < 60 * 60 * 1000) {
        console.log("Returning cached recently played tracks");
        return req.session.cachedRecentPlayed;
    }
    
    console.log("Fetching recently played tracks from Spotify API");

    let allTracks = [];

    try {
        const url = `${API_BASE_URL}/me/player/recently-played?limit=50`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        allTracks = response.data.items;        
       
        let { before12PM, after12PM } = splitTracksByTime(allTracks);

        allTracks = cleanRecentlyPlayed(allTracks);
        before12PM = cleanRecentlyPlayed(before12PM);
        after12PM = cleanRecentlyPlayed(after12PM);

        req.session.cachedRecentPlayed = {
            before12PM,
            after12PM,
            allTracks,
        };

        req.session.lastFetchedTime = now;
        return req.session.cachedRecentPlayed;
    } catch (error) {
        console.error("Error fetching recently played tracks:", error.message);
        throw error;
    }
};
