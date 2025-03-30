import { getTopItems, getRecentlyPlayed } from "./spotifyService.js";

export const getTopTracks = async (req, res) => {
    
    const timeRange = req.query.timeRange || 'short_term';
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const tracks = await getTopItems(token, 'tracks', timeRange);
        res.json({ topTracks: tracks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMostRepeatedTracks = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const recentlyPlayed = await getRecentlyPlayed(token);
        
        let repeatedTracks = {};
        for (let i=0; i < recentlyPlayed.length - 1; i++) {
            let currentTrack = recentlyPlayed[i];
            let previousTrack = recentlyPlayed[i + 1];
            
            let playDuration = new Date(currentTrack.played_at) - new Date(previousTrack.played_at);
            let actualDuration = currentTrack.track.duration_ms;
            
            if (playDuration > 0 && playDuration > actualDuration * 0.75) {
                let trackId = currentTrack.track.id;
                repeatedTracks[trackId] = (repeatedTracks[trackId] || 0) + 1;
            }
        }
        
        
        const mostRepeated = Object.entries(repeatedTracks).sort((a, b) => b[1] - a[1])[0];
        const mostRepeatedTrack = recentlyPlayed.find(item => item.track.id === mostRepeated[0]);
        const highestCount = mostRepeated[1];
        res.json({ name: mostRepeatedTrack.track.name, artist: mostRepeatedTrack.track.artists[0].name, count: highestCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMostSkippedTracks = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const recentlyPlayed = await getRecentlyPlayed(token);

        let skippedTracks = {};
        for (let i=0; i < recentlyPlayed.length - 1; i++) {
            let currentTrack = recentlyPlayed[i];
            let previousTrack = recentlyPlayed[i + 1];
            
            let playDuration = new Date(currentTrack.played_at) - new Date(previousTrack.played_at);
            let actualDuration = currentTrack.track.duration_ms;
            
            if (playDuration > 0 && playDuration < actualDuration * 0.35) {
                let trackId = currentTrack.track.id;
                skippedTracks[trackId] = (skippedTracks[trackId] || 0) + 1;
            }
        }
        const mostSkipped = Object.entries(skippedTracks).sort((a, b) => b[1] - a[1])[0];
        console.log(mostSkipped);
        const mostSkippedTrack = recentlyPlayed.find(item => item.track.id === mostSkipped[0]);
        const highestSkip = mostSkipped[1];
        
        res.json({ name: mostSkippedTrack.track.name, artist: mostSkippedTrack.track.artists[0].name, count: highestSkip });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}