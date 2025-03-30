import React, { useEffect, useState } from "react";

function TopTracks() {
    const [timeRange, setTimeRange ] = useState("short_term");
    const [topTracks, setTopTracks] = useState([]);
    const [mostRepeatedTrack, setMostRepeatedTrack] = useState([]);
    const [mostSkippedTrack, setMostSkippedTrack] = useState([]);
    const token = localStorage.getItem("token");

    // Top Tracks
    useEffect(() => {
        if (!token) return;

        fetch(`http://localhost:5000/api/tracks/top?time-range=${timeRange}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => response.json())
        .then((data) => {
            setTopTracks(data.items || [])
        })
        .catch(err => console.error('Error fetching top tracks:', err));
    }, [timeRange, token]);

    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:5000/api/tracks/most-repeated", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => response.json())
        .then((data) => {
            setMostRepeatedTrack(data || {})
        })
        .catch(err => console.error('Error fetching most repeated tracks:', err));
    }, [token]);
    
    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:5000/api/tracks/most-skipped", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => response.json())
        .then((data) => setMostSkippedTrack(data || {}))
        .catch(err => console.error('Error fetching most skipped tracks:', err));
    }, [token]);

    return (
        <div>
            <h1>Top Tracks</h1>
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

            {/* Top tracks list */}
            {/* <h2>Top Tracks</h2>
            <select onChange={(e) => setTimeRange(e.target.value)} value={timeRange}>
                <option value="short_term">Last 4 weeks</option>
                <option value="medium_term">Last 6 months</option>
                <option value="long_term">All time</option>
            </select>
            <ul>
                {topTracks.map((track, index) => (
                    <li key={index}>{track.name} by {track.artists[0].name}</li>
                ))}
            </ul> */}
        </div>
    );
}

export default TopTracks;
