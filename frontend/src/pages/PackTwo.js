import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PackTwo() {
    const BACKEND_URL = "http://localhost:5000";

    const navigate = useNavigate();
    const [topArtists, setTopArtists] = useState([]);
    const [mostRepeatedArtist, setMostRepeatedArtist] = useState({});
    const [mostSkippedArtist, setMostSkippedArtist] = useState({});
    const [loveHateArtist, setLoveHateArtist] = useState({});
    const [mostFeaturedArtist, setMostFeaturedArtist] = useState({});
    const [mainstreamArtist, setMainstreamArtist] = useState({});
    const [underratedArtist, setUnderratedTrack] = useState({});
    
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/artist/top`, {
            credentials: "include"})
        .then((response) => response.json())
        .then((data) => {
            setTopArtists(data.topArtists || []);
        })
        .catch(err => console.error('Error fetching top artists:', err));
    }, []);
    
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/artist/insights`, {
            credentials: "include"
        })
        .then((response) => response.json())
        .then((data) => {
            setMostRepeatedArtist(data.mostRepeatedArtist || {});
            setMostSkippedArtist(data.mostSkippedArtist || {});
            setMostFeaturedArtist(data.mostFeaturedArtist || {});
            setLoveHateArtist(data.loveHateArtist || {});
            setMainstreamArtist(data.mainstreamArtist || {});
            setUnderratedTrack(data.underratedArtist || {});
        })
        .catch(err => console.error('Error fetching artists insights:', err));
    }, []);    

    return (
        <div className="background text-white pack-two">
            <h1>Pack Two</h1>
            <button className="btn" onClick={() => {
                navigate("/home")}}>
                Back 
            </button>

            <h2>Top Artists</h2>
            <ul>
                {topArtists.map((artist) => (
                    <div key={artist.id}>
                        <img src={artist.image} alt={artist.name} />
                        <h3>{artist.name}</h3>
                        <p>{artist.id}</p>
                        <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                    </div>
                ))}
            </ul>
            

            {/* most repeated song */}
            { mostRepeatedArtist.name && (
                <div>
                    <h2>Most Repeated Artist</h2>
                    <p>{mostRepeatedArtist.name}</p>
                    <p>Count: {mostRepeatedArtist.count}</p>
                </div>
            )}
            
            {/* guilty pleasure song */}
            {/* the song you skipped the most */}
            { mostSkippedArtist.name && (
                <div>
                    <h2>Most Skipped Artist</h2>
                    <p>{mostSkippedArtist.name}</p>
                    <p>Count: {mostSkippedArtist.count}</p>
                </div>
            )}

            {/* love hate song */}
            { loveHateArtist.name && (
                <div>
                    <h2>Love Hate Artist</h2>
                    <p>{loveHateArtist.name}</p>
                </div>
            )}

                
            {/* most mainstream song */}
            { mainstreamArtist.name && (
                <div>
                    <h2>Most Mainstream Artist</h2>
                    <p>{mainstreamArtist.name}</p>
                    <p>Popularity: {mainstreamArtist.count}</p>
                </div>
            )}

            {/* most underrated song */}
            { underratedArtist.name && (
                <div>
                    <h2>Most Underrated Artist</h2>
                    <p>{underratedArtist.name}</p>
                    <p>Popularity: {underratedArtist.count}</p>
                </div>
            )}

            { mostFeaturedArtist.name && (
                <div>
                    <h2>Most Featured Artist</h2>
                    <p>{mostFeaturedArtist.name}</p>
                    <p>Count: {mostFeaturedArtist.count}</p>
                </div>
            )}

        </div>
    );
}

export default PackTwo;