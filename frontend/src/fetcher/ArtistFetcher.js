import { useMemo, useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import { motion } from "framer-motion";

function ArtistFetcher() {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    const [ topArtists, setTopArtists ] = useState([]);
    const [ mostRepeatedArtist, setMostRepeatedArtist ] = useState({});
    const [ mostSkippedArtist, setMostSkippedArtist ] = useState({});
    const [ loveHateArtist, setLoveHateArtist ] = useState({});
    const [ mostFeaturedArtist, setMostFeaturedArtist ] = useState({});
    const [ mainstreamArtist, setMainstreamArtist ] = useState({});
    const [ underratedArtist, setUnderratedTrack ] = useState({});

    const [ showInsights, setShowInsights ] = useState(false);
    
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/artist/top`, {
            credentials: "include"})
        .then((response) => response.json())
        .then((data) => {
            setTopArtists(data.topArtists || []);
        })
        .catch(err => console.error('Error fetching top artists:', err));
    }, [BACKEND_URL]);
    
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
    }, [BACKEND_URL]);

    const items = useMemo(() => {
        const insights = [
            { type: "Most Repeated Artist", content: mostRepeatedArtist },
            { type: "Most Skipped Artist", content: mostSkippedArtist },
            { type: "Love Hate Artist", content: loveHateArtist },
            { type: "Most Featured Artist", content: mostFeaturedArtist },
            { type: "Most Mainstream Artist", content: mainstreamArtist },
            { type: "Most Underrated Artist", content: underratedArtist }
        ].filter(item => item.content && item.content.id);

        return [
            ...[...topArtists].reverse().map((artist, i) => ({
                type: "Top Artist #" + (6 - i), content: artist
            })).filter(item => item.content && item.content.id),
            ...insights];
    }, [topArtists, mostRepeatedArtist, mostSkippedArtist, loveHateArtist, 
            mostFeaturedArtist, mainstreamArtist, underratedArtist]);

    return (
        <motion.div
            className="fetcher-container"
            animate={{ rotateY: showInsights ? 180 : 0 }}
            transition={{ duration: 0.7 }}
        >
            {/* Front Side */}
            <div className="front-side" onClick={() => setShowInsights(true)}>
                <h3>Reveal Your Artist Analysis</h3>
            </div>

            {/* Back Side */}
            <div className="back-side">
                <Carousel items={items} />
            </div>
        </motion.div>
    );
}

export default ArtistFetcher;