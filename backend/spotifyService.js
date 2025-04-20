import axios from "axios";

const API_BASE_URL = "https://api.spotify.com/v1/me";

export const getTopItems = async (token, type, timeRange) => {
    const url = `${API_BASE_URL}/top/${type}?limit=10&time_range=${timeRange}`;
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
    const lastDay = Date.now() - 24 * 60 * 60 * 1000;

    let allTracks = [];
    let nextBefore = Date.now();

    try {
        while (true) {
            // console.log(`Fetched so far: ${allTracks.length}`);
            const url = `${API_BASE_URL}/player/recently-played?limit=${limit}&before=${nextBefore}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.items.length === 0) break;
            
            const recentTracks = response.data.items.filter(item => {
                const playedAt = new Date(item.played_at).getTime();
                return playedAt >= lastDay;
            });

            allTracks = [...allTracks, ...recentTracks];

            let lastTrack = response.data.items[0];
            nextBefore = new Date(lastTrack.played_at).getTime();

            if (nextBefore < lastDay) break;
            
            // Debug
            // console.log(`Last track: ${lastTrack.track.name} by ${lastTrack.track.artists[0].name}`);
            // console.log(`All tracks length: ${allTracks.length}`);
        }

        return allTracks;
    } catch (error) {
        console.error("Error fetching recently played tracks:", error.message);
        throw error;
    }
};
