function getArtistDetail(item, count, type) {
    if (item) {
        return {
            id: item.id,
            name: item.name,
            image: item.images[0]?.url,
            spotifyUrl: item.external_urls.spotify,
            genres: item.genres,
            count,
            type,
    }};
};

function getMainstreamArtist(artists) {
    return artists.reduce((most, current) => {
        return current.popularity > most.popularity ? current : most;
    }, artists[0]);
};

function getUnderratedArtist(artists) {
    return artists.reduce((least, current) => {
        return current.popularity < least.popularity ? current : least;
    }, artists[0]);
};

export function getMainstreamUnderrated(artists) {
    if (!artists || artists.length === 0) return null;

    const mainstream = getMainstreamArtist(artists);
    const underrated = getUnderratedArtist(artists);
    const mainstreamDetail = getArtistDetail(mainstream, mainstream.popularity, "mainstream");
    const underratedDetail = getArtistDetail(underrated, underrated.popularity, "underrated");

    return { mainstreamArtist: mainstreamDetail, underratedArtist: underratedDetail };
};

export function getRepeatedSkipped(recentlyPlayed, keyExtractor) {
    let repeated = {};
    let skipped = {};

    for (let i = 0; i < recentlyPlayed.length - 1; i++) {
        const current = recentlyPlayed[i];
        const previous = recentlyPlayed[i + 1];

        const playDuration = new Date(current.played_at) - new Date(previous.played_at);
        const actualDuration = current.track.duration_ms;
        const key = keyExtractor(current);

        if (playDuration >= actualDuration * 0.5) {
            repeated[key] = (repeated[key] || 0) + 1;

        } else if (playDuration > 0 && playDuration < actualDuration * 0.2) {
            skipped[key] = (skipped[key] || 0) + 1;
        }
    }

    return { repeatedArtists: repeated, skippedArtists: skipped };
}

export function getMostRepeatedOrSkipped(artists, artistData, type) {
    if (!artists || Object.keys(artistData).length === 0) return null;
    const sortedArtists = Object.entries(artistData).sort((a, b) => b[1] - a[1])[0];
    const artist = artists.find(item => item.id === sortedArtists[0]);
    const count = sortedArtists[1];
    const artistDetail = getArtistDetail(artist, count, type);

    return artistDetail;
}

export function getLoveHateArtist(repeated, skipped, artists) {
    if (!artists || !repeated || !skipped || Object.keys(repeated).length === 0 || Object.keys(skipped).length === 0)
        {return null};
    const overlap = Object.keys(repeated).filter(id => id in skipped);

    const artistId = overlap[0];
    const artist = artists.find(item => item.id === artistId);
    const artistDetail = getArtistDetail(artist, 0, "love-hate");

    return artistDetail;
};

export function getMostFeaturedArtistID(tracks) {
    let artistFrequency = {};
    let artistID = {};

    const featuredArtists = tracks.flatMap(track => {
        if (track.track && track.track.artists && track.track.artists.length > 1) {
            return track.track.artists.slice(1).map(artist => artist.id);
        }
        return [];
    });

    featuredArtists.forEach(artistId => {
        artistFrequency[artistId] = (artistFrequency[artistId] || 0) + 1;
    });

    artistID = Object.entries(artistFrequency).sort((a, b) => b[1] - a[1])[0];

    return { mostFeaturedArtistID: artistID[0], count: artistID[1] };
};