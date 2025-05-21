import { getRecentlyPlayed } from "../middlewares/spotifyService.js";
import { getRepeatedSkipped, getMostRepeatedOrSkipped } from "../middlewares/trackUtils.js";

let before12PM = [];
let after12PM = [];
let allTracks = [];

function totalTimeListened(recentlyPlayed) {
    let totalTime = 0;
    const n = recentlyPlayed.length;

    for (let i = 0; i < n; i++) {
        const current = recentlyPlayed[i];
        const previous = recentlyPlayed[i + 1];

        if (i === n - 1) {
            totalTime += current.track.duration_ms;
            break;
        }
        let timeAdded = 0;

        const playDuration = new Date(current.played_at) - new Date(previous.played_at);
        const actualDuration = current.track.duration_ms;

        timeAdded = playDuration > actualDuration ? actualDuration : playDuration;
        totalTime += timeAdded;
    }
    if (process.env.NODE_ENV !== "production") {
        console.log("Total time listened in ms:", totalTime);
    };

    return totalTime;
}

function countTime(totalMs, time) {
    const partOfDay = totalMs / (time * 60 * 60 * 1000);
    const partOfDayPercentage = Math.round(partOfDay * 100);
    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

    return {
        partOfDayPercentage,
        totalTime: {
            ms: totalMs,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        }
    };
};

const getTrackID = (item) => item.track.id;

export async function getTimeInsights(req, res) {
    try {
        const token = req.session.access_token;
        const recentlyPlayed = await getRecentlyPlayed(req, token);

        before12PM = recentlyPlayed.before12PM || [];
        after12PM = recentlyPlayed.after12PM || [];
        allTracks = recentlyPlayed.allTracks || [];

        console.log("Before 12PM:");
        const totalMsBefore12PM = totalTimeListened(before12PM);
        console.log("After 12PM:");
        const totalMsAfter12PM = totalTimeListened(after12PM);
        console.log("All tracks:");
        const totalMs = totalTimeListened(allTracks);

        const { partOfDayPercentage: partOfDayPercentageBefore, 
            totalTime: totalTimeBefore } = countTime(totalMsBefore12PM, 12);
        const { partOfDayPercentage: partOfDayPercentageAfter, 
            totalTime: totalTimeAfter } = countTime(totalMsAfter12PM, 12);
        const { partOfDayPercentage, totalTime } = countTime(totalMs, 24);

        if (process.env.NODE_ENV !== "production") {
            console.log(partOfDayPercentageBefore, partOfDayPercentageAfter, partOfDayPercentage);
        }

        const { repeatedTracks: repeatedBefore12PM, 
            skippedTracks: skippedBefore12PM } = getRepeatedSkipped(before12PM, getTrackID);
        const { repeatedTracks: repeatedAfter12PM, 
            skippedTracks: skippedAfter12PM } = getRepeatedSkipped(after12PM, getTrackID);
        
        const mostRepeatedBefore12PM = getMostRepeatedOrSkipped(before12PM, repeatedBefore12PM, 'repeated');
        const mostSkippedBefore12PM = getMostRepeatedOrSkipped(before12PM, skippedBefore12PM, 'skipped');

        const mostRepeatedAfter12PM = getMostRepeatedOrSkipped(after12PM, repeatedAfter12PM, 'repeated');
        const mostSkippedAfter12PM = getMostRepeatedOrSkipped(after12PM, skippedAfter12PM, 'skipped');
  
        return res.json({
            before12PM: {
                partOfDayPercentage: partOfDayPercentageBefore,
                totalTime: totalTimeBefore,
                mostRepeatedTrack: mostRepeatedBefore12PM || {},
                mostSkippedTrack: mostSkippedBefore12PM || {},
            },
            after12PM: {
                partOfDayPercentage: partOfDayPercentageAfter,
                totalTime: totalTimeAfter,
                mostRepeatedTrack: mostRepeatedAfter12PM || {},
                mostSkippedTrack: mostSkippedAfter12PM || {},
            },
            allTracks: {
                partOfDayPercentage: partOfDayPercentage,
                totalTime: totalTime,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };