import { useMemo, useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import { motion } from "framer-motion";

function TrackFetcher() {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    const [topTracks, setTopTracks] = useState([]);
    const [mostRepeatedTrack, setMostRepeatedTrack] = useState({});
    const [mostSkippedTrack, setMostSkippedTrack] = useState({});
    const [loveHateTrack, setLoveHateTrack] = useState({});
    const [mainstreamTrack, setMainstreamTrack] = useState({});
    const [underratedTrack, setUnderratedTrack] = useState({});
    
    const [ showInsights, setShowInsights ] = useState(false);

    // Top Tracks
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/tracks/top`, {
            credentials: "include"})
        .then((response) => response.json())
        .then((data) => {
            setTopTracks(data.topTracks || []);
        })
        .catch(err => console.error('Error fetching top tracks:', err));
    }, [BACKEND_URL]);

    // Track Insights
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
    }, [BACKEND_URL]);

    const items = useMemo(() => {
        const insights = [
            { type: "Most Repeated Track", content: mostRepeatedTrack },
            { type: "Most Skipped Track", content: mostSkippedTrack },
            { type: "Love Hate Track", content: loveHateTrack },
            { type: "Most Mainstream Track", content: mainstreamTrack },
            { type: "Most Underrated Track", content: underratedTrack }
        ].filter(item => item.content && item.content.id);
        return [
            ...[...topTracks].reverse().map((track, i) => ({
            type: "Top Track #" + (6 - i), content: track
            })).filter(item => item.content && item.content.id),
            ...insights];
    }, [topTracks, mostRepeatedTrack, mostSkippedTrack, loveHateTrack, mainstreamTrack, underratedTrack]);

    return (
        <motion.div
            className="fetcher-container"
            animate={{ rotateY: showInsights ? 180 : 0 }}
            transition={{ duration: 0.7 }}
        >
            {/* Front Side */}
            <div className="front-side" onClick={() => setShowInsights(true)}>
                <h3>Reveal Your Track Analysis</h3>
            </div>

            {/* Back Side */}
            <div className="back-side">
                <Carousel items={items} />
            </div>
        </motion.div>
    );
}

export default TrackFetcher;