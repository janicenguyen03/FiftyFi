import axios, { all } from "axios";

const API_BASE_URL = "https://api.spotify.com/v1";

export const getTopItems = async (token, type, timeRange) => {
    const url = `${API_BASE_URL}/me/top/${type}?limit=10&time-range=${timeRange}`;
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

export const getRecentlyPlayed = async (token) => {
    const limit = 50;
    const maxItems = 200;

    let allTracks = [];
    let nextBefore = Date.now();

    try {
        while (allTracks.length <= maxItems) {
            console.log(`Fetched so far: ${allTracks.length}`);
            const url = `${API_BASE_URL}/me/player/recently-played?limit=${limit}&before=${nextBefore}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.items.length === 0) break;
            
            allTracks = [...allTracks, ...response.data.items];
            let lastTrack = response.data.items[0];
            console.log(`Last track: ${lastTrack.track.name} by ${lastTrack.track.artists[0].name}`);
            nextBefore = new Date(lastTrack.played_at).getTime();
            console.log(`Next before: ${nextBefore}`);
            console.log(`All tracks length: ${allTracks.length}`);
        }

        return allTracks.slice(0, maxItems);
    } catch (error) {
        console.error("Error fetching recently played tracks:", error.message);
        throw error;
    }
};
