import React, { useEffect, useState } from "react";

function TopTracks() {
    const [timeRange, setTimeRange ] = useState("short_term");
    const [topTracks, setTopTracks] = useState([]);
    const [mostRepeatedTrack, setMostRepeatedTrack] = useState([]);
    const [mostSkippedTrack, setMostSkippedTrack] = useState([]);

    // Top Tracks

    useEffect(() => {
        fetch(`http://localhost:5000/api/tracks/top?time_range=${timeRange}`, {
            credentials: "include"})
        .then((response) => response.json())
        .then((data) => {
            setTopTracks(data.topTracks || []);
        })
        .catch(err => console.error('Error fetching top tracks:', err));
    }, [timeRange]);

    useEffect(() => {
        fetch("http://localhost:5000/api/tracks/most-repeated", {
            credentials: "include"
        })
        .then((response) => response.json())
        .then((data) => {
            setMostRepeatedTrack(data || {})
        })
        .catch(err => console.error('Error fetching most repeated tracks:', err));
    }, []);
    
    useEffect(() => {
        fetch("http://localhost:5000/api/tracks/most-skipped", {
            credentials: "include"
        })
        .then((response) => response.json())
        .then((data) => {
            setMostSkippedTrack(data || {});
            console.log(data);
        })
        .catch(err => console.error('Error fetching most skipped tracks:', err));
    }, []);

    return (
        <div className="background text-white">
            <h1>Top Tracks</h1>

            {/* Top tracks list */}
            <h2>Top Tracks</h2>
            <select onChange={(e) => {
                console.log(e.target.value);
                setTimeRange(e.target.value);
            }} value={timeRange} className="btn">
                <option value="short_term">Last month</option>
                <option value="medium_term">Last 6 months</option>
                <option value="long_term">All time</option>
            </select>
            <ul>
                {topTracks.map((track) => (
                    <div key={track.id} className="track-card">
                        <img src={track.image} alt={track.name} />
                        <h3>{track.name}</h3>
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
                    <p>{mostRepeatedTrack.name} - {mostRepeatedTrack.artist}</p>
                    <p>Count: {mostRepeatedTrack.count}</p>
                </div>
            )}
            
            {/* guilty pleasure song */}
            {/* the song you skipped the most */}
            { mostSkippedTrack.name && (
                <div>
                    <h2>Most Skipped Track</h2>
                    <p>{mostSkippedTrack.name} - {mostSkippedTrack.artist}</p>
                    <p>Count: {mostSkippedTrack.count}</p>
                </div>
            )}

        </div>
    );
}

export default TopTracks;
