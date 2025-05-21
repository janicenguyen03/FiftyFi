import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tracks() {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const navigate = useNavigate();
    const [topTracks, setTopTracks] = useState([]);
    const [mostRepeatedTrack, setMostRepeatedTrack] = useState({});
    const [mostSkippedTrack, setMostSkippedTrack] = useState({});
    const [loveHateTrack, setLoveHateTrack] = useState({});
    const [mainstreamTrack, setMainstreamTrack] = useState({});
    const [underratedTrack, setUnderratedTrack] = useState({});

    // Top Tracks
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/tracks/top`, {
            credentials: "include"})
        .then((response) => response.json())
        .then((data) => {
            setTopTracks(data.topTracks || []);
        })
        .catch(err => console.error('Error fetching top tracks:', err));
    }, []);

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/tracks/insights`, {
            credentials: "include"
        })
        .then((response) => response.json())
        .then((data) => {
            setMostRepeatedTrack(data.mostRepeatedTrack || {})
            setMostSkippedTrack(data.mostSkippedTrack || {});
            setLoveHateTrack(data.loveHateTrack || {});
            setMainstreamTrack(data.mainstreamTrack || {});
            setUnderratedTrack(data.underratedTrack || {});
        })
        .catch(err => console.error('Error fetching tracks insights:', err));
    }, [])

    return (
        <div className="background text-white">
            <h1 className="text-2xl font-extrabold py-10">Tracks Insights in the latest 50 tracks</h1>

            <button className="btn" onClick={() => {
                navigate("/home")}}>
                Back 
            </button>
            {/* Top tracks list */}
            <h2 className="text-xl font-bold py-5">Top Tracks</h2>
            <ul>
                {topTracks.map((track) => (
                    <div key={track.id} className="mb-5">
                        <img src={track.image} alt={track.name} />
                        <h3 className="font-semibold text-lg mb-1">{track.name}</h3>
                        <p className="mb-1">🎤 {track.artists}</p>
                        <p className="mb-1">📀 {track.album}</p>
                        <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                    </div>
                ))}
            </ul>

            {/* most repeated song */}
            { mostRepeatedTrack.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Most Repeated Track</h2>
                    <img src={mostRepeatedTrack.image} alt={mostRepeatedTrack.name} />
                    <p>{mostRepeatedTrack.name} - {mostRepeatedTrack.artists}</p>
                    <p>Count: {mostRepeatedTrack.count}</p>
                    <a href={mostRepeatedTrack.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}
            
            {/* guilty pleasure song */}
            {/* the song you skipped the most */}
            { mostSkippedTrack.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Most Skipped Track</h2>
                    <img src={mostSkippedTrack.image} alt={mostSkippedTrack.name} />
                    <p>{mostSkippedTrack.name} - {mostSkippedTrack.artists}</p>
                    <p>Count: {mostSkippedTrack.count}</p>
                    <a href={mostSkippedTrack.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

            {/* love hate song */}
            { loveHateTrack.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Love Hate Track</h2>
                    <img src={loveHateTrack.image} alt={loveHateTrack.name} />
                    <p>{loveHateTrack.name} - {loveHateTrack.artists}</p>
                    <a href={loveHateTrack.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

                
            {/* most mainstream song */}
            { mainstreamTrack.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Most Mainstream Track</h2>
                    <img src={mainstreamTrack.image} alt={mainstreamTrack.name} />
                    <p>{mainstreamTrack.name} - {mainstreamTrack.artists}</p>
                    <p>Popularity: {mainstreamTrack.count}</p>
                    <a href={mainstreamTrack.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

            {/* most underrated song */}
            { underratedTrack.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Most Underrated Track</h2>
                    <img src={underratedTrack.image} alt={underratedTrack.name} />
                    <p>{underratedTrack.name} - {underratedTrack.artists}</p>
                    <p>Popularity: {underratedTrack.count}</p>
                    <a href={underratedTrack.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

        </div>
    );
}

export default Tracks;
