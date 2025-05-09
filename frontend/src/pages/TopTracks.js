import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TopTracks() {
    const navigate = useNavigate();
    const [topTracks, setTopTracks] = useState([]);
    const [mostRepeatedTrack, setMostRepeatedTrack] = useState({});
    const [mostSkippedTrack, setMostSkippedTrack] = useState({});
    const [loveHateTrack, setLoveHateTrack] = useState({});
    const [mainstreamTrack, setMainstreamTrack] = useState({});
    const [underratedTrack, setUnderratedTrack] = useState({});

    // Top Tracks
    useEffect(() => {
        fetch(`http://localhost:5000/api/tracks/top`, {
            credentials: "include"})
        .then((response) => response.json())
        .then((data) => {
            setTopTracks(data.topTracks || []);
        })
        .catch(err => console.error('Error fetching top tracks:', err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/tracks/insights", {
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
        .catch(err => console.error('Error fetching most repeated tracks:', err));
    }, [])

    return (
        <div className="background text-white">
            <h1>Top Tracks</h1>

            <button className="btn" onClick={() => {
                navigate("/home")}}>
                Back 
            </button>
            {/* Top tracks list */}
            <h2>Top Tracks</h2>
            <ul>
                {topTracks.map((track) => (
                    <div key={track.id} className="track-card">
                        <img src={track.image} alt={track.name} />
                        <h3>{track.name}</h3>
                        <p>{track.id}</p>
                        <p>🎤 {track.artists}</p>
                        <p>📀 {track.album}</p>
                        <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                    </div>
                ))}
            </ul>

            {/* most repeated song */}
            { mostRepeatedTrack.name && (
                <div>
                    <h2>Most Repeated Track</h2>
                    <p>{mostRepeatedTrack.name} - {mostRepeatedTrack.artists}</p>
                    <p>Count: {mostRepeatedTrack.count}</p>
                </div>
            )}
            
            {/* guilty pleasure song */}
            {/* the song you skipped the most */}
            { mostSkippedTrack.name && (
                <div>
                    <h2>Most Skipped Track</h2>
                    <p>{mostSkippedTrack.name} - {mostSkippedTrack.artists}</p>
                    <p>Count: {mostSkippedTrack.count}</p>
                </div>
            )}

            {/* love hate song */}
            { loveHateTrack.name && (
                <div>
                    <h2>Love Hate Track</h2>
                    <p>{loveHateTrack.name} - {loveHateTrack.artists}</p>
                </div>
            )}

                
            {/* most mainstream song */}
            { mainstreamTrack.name && (
                <div>
                    <h2>Most Mainstream Track</h2>
                    <p>{mainstreamTrack.name} - {mainstreamTrack.artists}</p>
                    <p>Popularity: {mainstreamTrack.count}</p>
                </div>
            )}

            {/* most underrated song */}
            { underratedTrack.name && (
                <div>
                    <h2>Most Underrated Track</h2>
                    <p>{underratedTrack.name} - {underratedTrack.artists}</p>
                    <p>Popularity: {underratedTrack.count}</p>
                </div>
            )}

        </div>
    );
}

export default TopTracks;
