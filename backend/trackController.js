import { getTopItems, getRecentlyPlayed } from "./spotifyService.js";

export const getTopTracks = async (req, res) => {
    
    const timeRange = req.query['time_range'] || 'short_term';
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const tracks = await getTopItems(token, 'tracks', timeRange);
        if (!tracks || tracks.length === 0) {
            return res.status(404).json({ error: "No tracks found" });
        }  
        const formattedTracks = tracks.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map(artist => artist.name).join(", "),
            album: track.album.name,
            image: track.album.images[0]?.url,
            spotifyUrl: track.external_urls.spotify,
            duration: track.duration_ms,
        }));

        res.json({ topTracks: formattedTracks });
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

        res.json({ name: mostRepeatedTrack.track.name, 
            artist: mostRepeatedTrack.track.artists[0].name, 
            count: highestCount });
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
        // console.log(mostSkipped);
        if (!mostSkipped) {
            return res.json({ name: "", artist: "", count: 0 });
        }
        const mostSkippedTrack = recentlyPlayed.find(item => item.track.id === mostSkipped[0]);
        const highestSkip = mostSkipped[1];
        
        res.json({ name: mostSkippedTrack.track.name, 
            artist: mostSkippedTrack.track.artists[0].name, 
            count: highestSkip });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}