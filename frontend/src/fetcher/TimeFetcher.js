import { useEffect, useMemo, useState } from "react";
import Carousel from "../components/Carousel";
import { motion } from "framer-motion";

function TimeFetcher() {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    const [ partOfDayBefore, setPartOfDayBefore ] = useState(null);
    const [ partOfDayAfter, setPartOfDayAfter ] = useState(null);
    const [ partOfDay, setPartOfDay ] = useState(null);

    const [ totalTimeBefore, setTotalTimeBefore ] = useState(null);
    const [ totalTimeAfter, setTotalTimeAfter ] = useState(null);
    const [ totalTime, setTotalTime ] = useState(null);

    const [ mostRepeatedBefore, setMostRepeatedBefore ] = useState(null);
    const [ mostRepeatedAfter, setMostRepeatedAfter ] = useState(null);

    const [ mostSkippedBefore, setMostSkippedBefore ] = useState(null);
    const [ mostSkippedAfter, setMostSkippedAfter ] = useState(null);

    const [ showInsights, setShowInsights ] = useState(false);

    useEffect(() => {
        fetch(BACKEND_URL + "/api/time-spent", {credentials: "include"})
        .then((response) => response.json())
        .then((data) => {
            setPartOfDayBefore(data.percentage.before12PM || 0);
            setPartOfDayAfter(data.percentage.after12PM || 0);
            setPartOfDay(data.percentage.allTracks || 0);

            setTotalTimeBefore(data.time.before12PM || {});
            setTotalTimeAfter(data.time.after12PM || {});
            setTotalTime(data.time.allTracks || {});

            setMostRepeatedBefore(data.tracks.repeatedBefore || {});
            setMostRepeatedAfter(data.tracks.repeatedAfter || {});

            setMostSkippedBefore(data.tracks.skippedBefore || {});
            setMostSkippedAfter(data.tracks.skippedAfter || {});
        })
        .catch(err => console.error('Error fetching time insights:', err));
    }, [BACKEND_URL]);

    const items = useMemo(() => {
        const items = [
            { type: "Percentage of Time Spent Before 12PM", content: partOfDayBefore },
            { type: "Exact Time Spent Before 12PM", content: totalTimeBefore },
            { type: "Most Repeated Track Before 12PM", content: mostRepeatedBefore },
            { type: "Most Skipped Track Before 12PM", content: mostSkippedBefore },

            { type: "Percentage of Time Spent After 12PM", content: partOfDayAfter },
            { type: "Exact Time Spent After 12PM", content: totalTimeAfter },
            { type: "Most Repeated Track After 12PM", content: mostRepeatedAfter },
            { type: "Most Skipped Track After 12PM", content: mostSkippedAfter },

            { type: "Percentage of Time Spent All Tracks", content: partOfDay },
            { type: "Exact Time Spent All Tracks", content: totalTime },
        ].filter(item => item.content && (!item.type.startsWith("Most")|| item.content?.name));

        return items;
    }, [partOfDayBefore, partOfDayAfter, partOfDay, totalTimeBefore, totalTimeAfter, totalTime, 
        mostRepeatedBefore, mostRepeatedAfter, mostSkippedBefore, mostSkippedAfter]);

    return (
        <motion.div
            className="fetcher-container"
            animate={{ rotateY: showInsights ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            {/* Front Side */}
            <div className="front-side" onClick={() => setShowInsights(true)}>
                <h3>Reveal Your Time Analysis</h3>
            </div>

            {/* Back Side */}
            <div className="back-side">
                <Carousel items={items} />
            </div>
        </motion.div>
    );
}

export default TimeFetcher;