import { getMainstreamUnderrated, getRepeatedSkipped, getMostRepeatedOrSkipped, getLoveHateArtist, getMostFeaturedArtistID } from "../middlewares/artistUtils.js";
import { getTopItems, getRecentlyPlayed, getArtistInfo } from "../middlewares/spotifyService.js";

//  Artists:
// most repeated, skipped, lovehate
// most featured
// most mainstream, underrated
// most likely to belong to
// recommend 1 artist

export async function getTopArtists(req, res) {
    
    const token = req.session.access_token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const artists = await getTopItems(token, 'artists');
        if (!artists || artists.length === 0) {
            return res.status(404).json({ error: "No tracks found" });
        };

        const formattedArtists = artists.map(item => ({
            id: item.id,
            name: item.name,
            image: item.images[0]?.url,
            spotifyUrl: item.external_urls.spotify,
            genres: item.genres
        }));

        res.json({ topArtists: formattedArtists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


function getArtistIDList(tracks) {
    return tracks.flatMap(track => {
        if (track.track && track.track.artists && track.track.artists.length > 0) {
            return track.track.artists.map(artist => artist.id);
        }
        return [];
    }).filter(id => id !== null);
};


function getArtistID(item) {
    if (item && item.track && item.track.artists && item.track.artists.length > 0) {
        return item.track.artists[0].id;
    }
    return null;
};

export async function getArtistInsights(req, res) {
    const token = req.session.access_token;

    if (!token) {
        return res.status(401).json({ error: "Get Artist Insights Unauthorized" });
    }

    try {
        const recentlyPlayed = await getRecentlyPlayed(req, token);
        const allTracks = recentlyPlayed.allTracks;
        const allArtistsID = getArtistIDList(allTracks);
        const allArtists = await getArtistInfo(token, allArtistsID);

        const {repeatedArtists, skippedArtists} = getRepeatedSkipped(allTracks, getArtistID);
        const mostRepeatedArtist = getMostRepeatedOrSkipped(allArtists, repeatedArtists, 'repeated');
        const mostSkippedArtist = getMostRepeatedOrSkipped(allArtists, skippedArtists, 'skipped');

        const loveHateArtist = getLoveHateArtist(repeatedArtists, skippedArtists, allArtists);
        const { mainstreamArtist, underratedArtist } = getMainstreamUnderrated(allArtists);
        
        const {mostFeaturedArtistID, count} = getMostFeaturedArtistID(allTracks);
        let mostFeaturedArtist = allArtists.find(item => item.id === mostFeaturedArtistID);
        mostFeaturedArtist = {
            id: mostFeaturedArtistID,
            name: mostFeaturedArtist?.name,
            image: mostFeaturedArtist?.images[0]?.url,
            spotifyUrl: mostFeaturedArtist?.external_urls.spotify,
            genres: mostFeaturedArtist?.genres,
            count,
            type: "featured",
        }

        res.json({ 
            mostRepeatedArtist: mostRepeatedArtist || {},
            mostSkippedArtist: mostSkippedArtist || {},
            loveHateArtist: loveHateArtist || {},
            mainstreamArtist: mainstreamArtist || {},
            underratedArtist: underratedArtist || {},
            mostFeaturedArtist: mostFeaturedArtist || {},
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};