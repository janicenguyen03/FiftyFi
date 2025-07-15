import { getLoveHateTrack, getRepeatedSkipped, getMostRepeatedOrSkipped, getMainstreamUnderrated } from "../middlewares/trackUtils.js";
import { getTopItems, getRecentlyPlayed, getSpotifyToken } from "../middlewares/spotifyService.js";

export async function getTopTracks(req, res) {
    const token = req.cookies.token;
    if (!token) {return res.status(401).json({ error: "Get Top Tracks Token Unauthorized" })};

    const {userId, spotifyToken} = await getSpotifyToken(req);
    if (!spotifyToken) {
        return res.status(401).json({ error: "Get Top Tracks Spotify Token Unauthorized" });
    }

    try {
        const tracks = await getTopItems(spotifyToken, 'tracks');

        if (!tracks || tracks.length === 0) {
            return res.status(404).json({ error: "No tracks found" });
        }  
        const formattedTracks = tracks.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists,
            album: track.album.name,
            image: track.album.images[0]?.url,
            spotifyUrl: track.external_urls.spotify,
            release: track.album.release_date,
            duration: track.duration_ms,
        }));


        res.json({ topTracks: formattedTracks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTrackID = (item) => item.track.id;
  
export async function getTrackInsights(req, res) {
    const token = req.cookies.token;
    if (!token) {return res.status(401).json({ error: "Get Track Insights Token Unauthorized" })};

    const {userId, spotifyToken} = await getSpotifyToken(req);
    if (!spotifyToken) {
        return res.status(401).json({ error: "Get Track Insights Spotify Token Unauthorized" });
    }

    try {
        const recentlyPlayed = await getRecentlyPlayed(userId, spotifyToken);
        const allTracks = recentlyPlayed.allTracks;

        const {repeatedTracks, skippedTracks} = getRepeatedSkipped(allTracks, getTrackID);
        const mostRepeatedTrack = getMostRepeatedOrSkipped(allTracks, repeatedTracks, 'repeated');
        const mostSkippedTrack = getMostRepeatedOrSkipped(allTracks, skippedTracks, 'skipped');

        const loveHateTrack = getLoveHateTrack(repeatedTracks, skippedTracks, allTracks);
        const { mainstreamTrack, underratedTrack } = getMainstreamUnderrated(allTracks);

        res.json({ 
            mostRepeatedTrack: mostRepeatedTrack || {},
            mostSkippedTrack: mostSkippedTrack || {},
            loveHateTrack: loveHateTrack || {},
            mainstreamTrack: mainstreamTrack || {},
            underratedTrack: underratedTrack || {},
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}