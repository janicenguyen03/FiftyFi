import axios from "axios";
import { getTopItems, getRecentlyPlayed } from "../spotifyService.js";

export const getTopTracks = async (req, res) => {
    
    const timeRange = req.query['time_range'] || 'short_term';
    const token = req.session.access_token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const tracks = await getTopItems(token, 'tracks', timeRange);
        // const items = tracks.items || [];

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

function getLoveHateTracks(repeatedTracks, skippedTracks) {
    const overlap = Object.keys(repeatedTracks).filter(trackId => trackId in skippedTracks);
    return overlap.length > 0 ? overlap[0] : null;
}

function getTrackDetail(item, highestCount) {
    if (item) {
        return {
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists.map(artist => artist.name).join(", "),
            album: item.track.album.name,
            image: item.track.album.images[0]?.url,
            spotifyUrl: item.track.external_urls.spotify,
            duration: item.track.duration_ms,
            count: highestCount
        };
    }};


export const getTrackInsights = async (req, res) => {
    const token = req.session.access_token;

    if (!token) {
        return res.status(401).json({ error: "Get Track Insights Unauthorized" });
    }

    try {
        const recentlyPlayed = await getRecentlyPlayed(token);

        let repeatedTracks = {};
        let skippedTracks = {};

        for (let i=0; i < recentlyPlayed.length - 1; i++) {
            let currentTrack = recentlyPlayed[i];
            let previousTrack = recentlyPlayed[i + 1];
            
            let playDuration = new Date(currentTrack.played_at) - new Date(previousTrack.played_at);
            let actualDuration = currentTrack.track.duration_ms;
            
            if (playDuration > 0 && playDuration > actualDuration * 0.75) {
                let trackId = currentTrack.track.id;
                repeatedTracks[trackId] = (repeatedTracks[trackId] || 0) + 1;
            }

            if (playDuration >= 0 && playDuration < actualDuration * 0.35) {
                let trackId = currentTrack.track.id;
                skippedTracks[trackId] = (skippedTracks[trackId] || 0) + 1;
            }
        }
        
        const mostRepeated = Object.entries(repeatedTracks).sort((a, b) => b[1] - a[1])[0];
        const mostRepeatedTrack = recentlyPlayed.find(item => item.track.id === mostRepeated[0]);
        const highestCount = mostRepeated[1];

        const mostSkipped = Object.entries(skippedTracks).sort((a, b) => b[1] - a[1])[0];
        const mostSkippedTrack = recentlyPlayed.find(item => item.track.id === mostSkipped[0]);
        const highestSkip = mostSkipped[1];

        let repeatedTrackDetail;
        let skippedTrackDetail;
        let loveHateTrackDetail;
        
        repeatedTrackDetail = skippedTrackDetail = loveHateTrackDetail = {
            id: "", name: "", artists: "", album: "", image: "", spotifyUrl: "", duration: 0, count: 0
        };

        repeatedTrackDetail = getTrackDetail(mostRepeatedTrack, highestCount);            
        skippedTrackDetail = getTrackDetail(mostSkippedTrack, highestSkip);

        const loveHateTrackId = getLoveHateTracks(repeatedTracks, skippedTracks);
        if (loveHateTrackId) {
            const loveHateTrackItem = recentlyPlayed.find(item => item.track.id === loveHateTrackId);
            if (loveHateTrackItem) {
                loveHateTrackDetail = getTrackDetail(loveHateTrackItem, 0);
        }}
        console.log(repeatedTrackDetail.name);
        console.log(skippedTrackDetail.name);
        console.log(loveHateTrackDetail.name);

        res.json({ 
            mostRepeatedTrack: repeatedTrackDetail,
            mostSkippedTrack: skippedTrackDetail,
            loveHateTrack: loveHateTrackDetail
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}