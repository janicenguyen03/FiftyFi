import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Artists() {
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
            <h1 className="text-2xl font-extrabold py-10">Artist Insights in your latest 50 tracks</h1>
            <button className="btn" onClick={() => {
                navigate("/home")}}>
                Back 
            </button>

            <h2 className="text-xl font-bold py-5">Top Artists</h2>
            <ul>
                {topArtists.map((artist) => (
                    <div key={artist.id} className="mb-5">
                        <img src={artist.image} alt={artist.name} />
                        <h3 className="font-semibold text-lg mb-1">{artist.name}</h3>
                        <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                    </div>
                ))}
            </ul>
            

            {/* most repeated song */}
            { mostRepeatedArtist.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Most Repeated Artist</h2>
                    <img src={mostRepeatedArtist.image} alt={mostRepeatedArtist.name} />
                    <h3 className="font-semibold text-lg mb-1">{mostRepeatedArtist.name}</h3>
                    <p>Count: {mostRepeatedArtist.count}</p>
                    <a href={mostRepeatedArtist.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}
            
            {/* guilty pleasure song */}
            {/* the song you skipped the most */}
            { mostSkippedArtist.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Most Skipped Artist</h2>
                    <img src={mostSkippedArtist.image} alt={mostSkippedArtist.name} />
                    <h3 className="font-semibold text-lg mb-1">{mostSkippedArtist.name}</h3>
                    <p>Count: {mostSkippedArtist.count}</p>
                    <a href={mostSkippedArtist.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

            {/* love hate song */}
            { loveHateArtist.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Love Hate Artist</h2>
                    <img src={loveHateArtist.image} alt={loveHateArtist.name} />
                    <h3 className="font-semibold text-lg mb-1">{loveHateArtist.name}</h3>
                    <a href={loveHateArtist.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

                
            {/* most mainstream song */}
            { mainstreamArtist.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Most Mainstream Artist</h2>
                    <img src={mainstreamArtist.image} alt={mainstreamArtist.name} />
                    <h3 className="font-semibold text-lg mb-1">{mainstreamArtist.name}</h3>
                    <p>Popularity: {mainstreamArtist.count}</p>
                    <a href={mainstreamArtist.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

            {/* most underrated song */}
            { underratedArtist.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Most Underrated Artist</h2>
                    <img src={underratedArtist.image} alt={underratedArtist.name} />
                    <h3 className="font-semibold text-lg mb-1">{underratedArtist.name}</h3>
                    <p>Popularity: {underratedArtist.count}</p>
                    <a href={underratedArtist.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

            { mostFeaturedArtist.name && (
                <div className="mb-5">
                    <h2 className="font-semibold text-xl">Most Featured Artist</h2>
                    <img src={mostFeaturedArtist.image} alt={mostFeaturedArtist.name} />
                    <h3 className="font-semibold text-lg mb-1">{mostFeaturedArtist.name}</h3>
                    <p>Count: {mostFeaturedArtist.count}</p>
                    <a href={mostFeaturedArtist.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

        </div>
    );
}

export default Artists;