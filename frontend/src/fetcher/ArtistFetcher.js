import { useMemo, useEffect, useState } from "react";
// import Carousel from "../components/Carousel";
import Artists from "../pages/Artists";

function ArtistFetcher({}) {
    const BACKEND_URL = "http://localhost:5000";
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
            console.log("Artist insights fetched successfully:", data);
        })
        .catch(err => console.error('Error fetching artists insights:', err));
    }, []); 

    const items = useMemo(() => {
        return [
            ...[...topArtists].reverse().map((artist, i) => ({
            type: "Top Artist #" + (i + 1),
            content: artist
            })),
            { type: "Most Repeated Artist", content: mostRepeatedArtist },
            { type: "Most Skipped Artist", content: mostSkippedArtist },
            { type: "Love Hate Artist", content: loveHateArtist },
            { type: "Most Featured Artist", content: mostFeaturedArtist },
            { type: "Most Mainstream Artist", content: mainstreamArtist },
            { type: "Most Underrated Artist", content: underratedArtist}
        ];
    }, [topArtists, mostRepeatedArtist, mostSkippedArtist, loveHateArtist, 
        mostFeaturedArtist, mainstreamArtist, underratedArtist]);

    return (
        <div>
            <ul>
                {items.map((item, index) => {
                    // item.content could be an array (for top artists) or an object (for insights)
                    const artistData = Array.isArray(item.content) ? item.content[0] : item.content;
                    if (!artistData) return null;
                    return (
                        <div
                            key={index}
                            className={index !== items.length - 1 ? "mb-5" : ""}
                        >
                            <h2 className="font-semibold text-xl">{item.type}</h2>
                            <img src={artistData.image} alt={artistData.name} />
                            <h3 className="font-semibold text-lg mb-1">{artistData.name}</h3>
                            <a href={artistData.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                        </div>
                    );
                })}

            </ul>
        </div>
        
    );
}

export default ArtistFetcher;