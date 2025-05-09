import axios from "axios";

const API_BASE_URL = "https://api.spotify.com/v1";
let cachedRecentPlayed = null;
let lastFetchedDate = null;

function getYesterdayTimeRange() {
    const now = new Date();

    const midnightTodayUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));

    const midnightYesterdayUTC = new Date(midnightTodayUTC);
    midnightYesterdayUTC.setUTCDate(midnightTodayUTC.getUTCDate() - 1);

    const endOfYesterdayUTC = new Date(midnightTodayUTC.getTime() -1);
    return {
        start: midnightYesterdayUTC.getTime(),
        end: endOfYesterdayUTC.getTime(),
    };
    
}

function splitTracksByTime(recentlyPlayed) {
    const { start } = getYesterdayTimeRange();
    const noonYesterday = start + 12 * 60 * 60 * 1000;

    const before12PM = [];
    const after12PM = [];

    recentlyPlayed.forEach((track) => {
        const playedAt = new Date(track.played_at).getTime();

        if (playedAt < noonYesterday) {
            before12PM.push(track);
        } else {
            after12PM.push(track);
        }
    });

    return { before12PM, after12PM };
}

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

export async function getRecentlyPlayed(token) {
    const todayUTC = new Date().toISOString().split("T")[0];
    if (cachedRecentPlayed && lastFetchedDate === todayUTC) {
        console.log("Returning cached recently played tracks");
        return cachedRecentPlayed;
    }
    
    console.log("Fetching recently played tracks from Spotify API");

    const { start, end } = getYesterdayTimeRange();

    const limit = 50;
    let allTracks = [];
    let nextBefore = end;

    try {
        while (true) {
            // console.log(`Fetched so far: ${allTracks.length}`);
            const url = `${API_BASE_URL}/me/player/recently-played?limit=${limit}&before=${nextBefore}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.items.length === 0) break;
            
            const recentTracks = response.data.items.filter(item => {
                const playedAt = new Date(item.played_at).getTime();
                return playedAt >= start && playedAt <= end;
            });

            allTracks = [...allTracks, ...recentTracks];

            const lastTrack = response.data.items[0];
            nextBefore = new Date(lastTrack.played_at).getTime();
            console.log("-----------------------")
            console.log(`Fetched so far: ${allTracks.length}`);
            console.log("Last track played at:", new Date(lastTrack.played_at).toISOString());
            console.log("Next before:", new Date(nextBefore).toISOString());

            if (nextBefore < start) break;
        }
        const { before12PM, after12PM } = splitTracksByTime(allTracks);

        cachedRecentPlayed = {
            before12PM,
            after12PM,
            allTracks,
        };
        lastFetchedDate = todayUTC;
        
        console.log("----------------Before 12PM tracks:", before12PM.length);
        console.log("----------------After 12PM tracks:", after12PM.length);
        console.log("----------------All tracks:", allTracks.length);
        return cachedRecentPlayed;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error("Spotify access token is invalid or expired. Clearing cache.");
            // cachedRecentPlayed = null;
            // lastFetchedDate = null;
            throw new Error("Spotify access token is invalid or expired. Please log in again.");
        } else {
            console.error("Error fetching recently played tracks:", error.message);
            throw error;
        }
    }
};
