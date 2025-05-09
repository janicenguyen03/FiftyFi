function getTrackDetail(item, count, type) {
    if (item) {
        return {
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists.map(artist => artist.name).join(", "),
            album: item.track.album.name,
            image: item.track.album.images[0]?.url,
            spotifyUrl: item.track.external_urls.spotify,
            duration: item.track.duration_ms,
            count,
            type,
        };
    }};


function getMainstreamTrack(tracks) {
    return tracks.reduce((most, current) => {
        return current.track.popularity > most.track.popularity ? current : most;
    }, tracks[0]);
};

function getUnderratedTrack(tracks) {
    return tracks.reduce((least, current) => {
        return current.track.popularity < least.track.popularity ? current : least;
    }, tracks[0]);
};

export function getMainstreamUnderrated(tracks) {
    if (!tracks || tracks.length === 0) return null;

    const mainstream = getMainstreamTrack(tracks);
    const underrated = getUnderratedTrack(tracks);
    const mainstreamDetail = getTrackDetail(mainstream, mainstream.track.popularity, "mainstream");
    const underratedDetail = getTrackDetail(underrated, underrated.track.popularity, "underrated");

    return { mainstreamTrack: mainstreamDetail, underratedTrack: underratedDetail };
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

    return { repeatedTracks: repeated, skippedTracks: skipped };
}

export function getMostRepeatedOrSkipped(tracks, trackData, type) {
    if (!tracks || Object.keys(trackData).length === 0) return null;
    const sortedTracks = Object.entries(trackData).sort((a, b) => b[1] - a[1])[0];
    const track = tracks.find(item => item.track.id === sortedTracks[0]);
    const count = sortedTracks[1];
    const trackDetail = getTrackDetail(track, count, type);

    return trackDetail;
}

export function getLoveHateTrack(repeated, skipped, tracks) {
    if (!tracks || !repeated || !skipped || Object.keys(repeated).length === 0 || Object.keys(skipped).length === 0)
        {return null};
    const overlap = Object.keys(repeated).filter(id => id in skipped);

    const trackId = overlap[0];
    const track = tracks.find(item => item.track.id === trackId);
    const trackDetail = getTrackDetail(track, 0, "love-hate");

    return trackDetail;
}