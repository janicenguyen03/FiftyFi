import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function Time() {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    const navigate = useNavigate();
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

    useEffect(() => {
        fetch(BACKEND_URL + "/api/time-spent", {
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {
            setPartOfDayBefore(data.before12PM.partOfDayPercentage || 0);
            setPartOfDayAfter(data.after12PM.partOfDayPercentage || 0);
            setPartOfDay(data.allTracks.partOfDayPercentage || 0);

            setTotalTimeBefore(data.before12PM.totalTime || {});
            setTotalTimeAfter(data.after12PM.totalTime || {});
            setTotalTime(data.allTracks.totalTime || {});

            setMostRepeatedBefore(data.before12PM.mostRepeatedTrack || {});
            setMostRepeatedAfter(data.after12PM.mostRepeatedTrack || {});

            setMostSkippedBefore(data.before12PM.mostSkippedTrack || {});
            setMostSkippedAfter(data.after12PM.mostSkippedTrack || {});
        })
        .catch(err => console.error('Error fetching time insights:', err));
    }, []);

    return (
        <div className="background min-h-screen text-white pack-one flex flex-col items-center gap-4">
            <button className="btn mt-3" onClick={() => {
                navigate("/home")}}>
                Back 
            </button>
            <h1 className="text-2xl font-extrabold">Your Time Insights for the past 50 tracks</h1>

            { partOfDayBefore && (
                <div className="analysis-card">
                    <p>You have listened to Spotify for <b>{partOfDayBefore}% </b>of the time before 12PM</p>
                </div>    
            )}

            { partOfDayAfter && (
                <div className="analysis-card">
                    <p>You have listened to Spotify for <b>{partOfDayAfter}% </b>of the time after 12PM</p>
                </div>    
            )}
            { partOfDay && (
                <div className="analysis-card">
                    <p>You have listened to Spotify for {partOfDay}% of the time in total</p>
                </div>    
            )}
            { totalTimeBefore && (
                <div className="analysis-card">
                    <p>You have listened to Spotify for 
                        a total of {totalTimeBefore.hours} hours {totalTimeBefore.minutes} minutes 
                        and {totalTimeBefore.second} seconds before 12PM</p>
                </div>    
            )}
            { totalTimeAfter && (
                <div className="analysis-card">
                    <p>You have listened to Spotify for 
                        a total of {totalTimeAfter.hours} hours {totalTimeAfter.minutes} minutes 
                        and {totalTimeAfter.second} seconds after 12PM</p>
                </div>    
            )}
            { totalTime && (
                <div className="analysis-card">
                    <p>You have listened to Spotify for 
                        a total of {totalTime.hours} hours {totalTime.minutes} minutes 
                        and {totalTime.second} seconds in total</p>
                </div>    
            )}
            { mostRepeatedBefore && mostRepeatedBefore.name && (
                <div className="analysis-card">
                    <h2>Most Repeated Track Before 12PM</h2>
                    <p>{mostRepeatedBefore.name}</p>
                    <p>{mostRepeatedBefore.artists}</p>
                    <a href={mostRepeatedBefore.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>    
            )}
            { mostRepeatedAfter && mostRepeatedAfter.name && (
                <div className="analysis-card">
                    <h2>Most Repeated Track After 12PM</h2>
                    <p>{mostRepeatedAfter.name}</p>
                    <p>{mostRepeatedAfter.artists}</p>
                    <a href={mostRepeatedAfter.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>    
            )}
            { mostSkippedBefore && mostSkippedBefore.name && (
                <div className="analysis-card">
                    <h2>Most Skipped Track Before 12PM</h2>
                    <p>{mostSkippedBefore.name}</p>
                    <p>{mostSkippedBefore.artists}</p>
                    <a href={mostSkippedBefore.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>    
            )}
            { mostSkippedAfter && mostSkippedAfter.name &&  (
                <div className="analysis-card">
                    <h2>Most Skipped Track After 12PM</h2>
                    <p>{mostSkippedAfter.name}</p>
                    <p>{mostSkippedAfter.artists}</p>
                    <a href={mostSkippedAfter.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

        </div>
    );
}

export default Time;