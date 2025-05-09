import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function PackOne() {
    const BACKEND_URL = "http://localhost:5000";

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
            setPartOfDayBefore(data.before12PM.partOfDayPercentage);
            console.log("1");
            setPartOfDayAfter(data.after12PM.partOfDayPercentage);
            console.log("2");
            setPartOfDay(data.allTracks.partOfDayPercentage);
            console.log("3");

            setTotalTimeBefore(data.before12PM.totalTime);
            console.log("4");
            setTotalTimeAfter(data.after12PM.totalTime);
            console.log("5");
            setTotalTime(data.allTracks.totalTime);
            console.log("6");

            setMostRepeatedBefore(data.before12PM.mostRepeatedTrack);
            console.log("7");
            setMostRepeatedAfter(data.after12PM.mostRepeatedTrack);
            console.log("8");

            setMostSkippedBefore(data.before12PM.mostSkippedTrack);
            console.log("9");
            setMostSkippedAfter(data.after12PM.mostSkippedTrack);
            console.log("10");
        })
        .catch(err => console.error('Error fetching time insights:', err));
    }, []);

    return (
        <div className="background text-white pack-one">
            <h1>Pack One</h1>
            <button className="btn" onClick={() => {
                navigate("/home")}}>
                Back 
            </button>
            <p>This is the first pack of insights.</p>

            { partOfDayBefore && (
                <div>
                    <p>You have listened to Spotify for {partOfDayBefore}% of the time before 12PM</p>
                </div>    
            )}

            { partOfDayAfter && (
                <div>
                    <p>You have listened to Spotify for {partOfDayAfter}% of the time after 12PM</p>
                </div>    
            )}
            { partOfDay && (
                <div>
                    <p>You have listened to Spotify for {partOfDay}% of the time in total</p>
                </div>    
            )}
            { totalTimeBefore && (
                <div>
                    <p>You have listened to Spotify for 
                        a total of {totalTimeBefore.hours} hours {totalTimeBefore.minutes} minutes 
                        and {totalTimeBefore.second} seconds before 12PM</p>
                </div>    
            )}
            { totalTimeAfter && (
                <div>
                    <p>You have listened to Spotify for 
                        a total of {totalTimeAfter.hours} hours {totalTimeAfter.minutes} minutes 
                        and {totalTimeAfter.second} seconds after 12PM</p>
                </div>    
            )}
            { totalTime && (
                <div>
                    <p>You have listened to Spotify for 
                        a total of {totalTime.hours} hours {totalTime.minutes} minutes 
                        and {totalTime.second} seconds in total</p>
                </div>    
            )}
            { mostRepeatedBefore && (
                <div>
                    <h2>Most Repeated Track Before 12PM</h2>
                    <p>{mostRepeatedBefore.name}</p>
                    <p>{mostRepeatedBefore.artists}</p>
                    <a href={mostRepeatedBefore.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>    
            )}
            { mostRepeatedAfter && (
                <div>
                    <h2>Most Repeated Track After 12PM</h2>
                    <p>{mostRepeatedAfter.name}</p>
                    <p>{mostRepeatedAfter.artists}</p>
                    <a href={mostRepeatedAfter.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>    
            )}
            { mostSkippedBefore && (
                <div>
                    <h2>Most Skipped Track Before 12PM</h2>
                    <p>{mostSkippedBefore.name}</p>
                    <p>{mostSkippedBefore.artists}</p>
                    <a href={mostSkippedBefore.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>    
            )}
            { mostSkippedAfter && (
                <div>
                    <h2>Most Skipped Track After 12PM</h2>
                    <p>{mostSkippedAfter.name}</p>
                    <p>{mostSkippedAfter.artists}</p>
                    <a href={mostSkippedAfter.spotifyUrl} target="_blank" rel="noopener noreferrer">🔗 Listen on Spotify</a>
                </div>
            )}

        </div>
    );
}

export default PackOne;