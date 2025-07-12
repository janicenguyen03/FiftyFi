import { useEffect } from 'react';

function PercentCard({ data, onRevealComplete }) {
    let timeSlot = "";
    if (data.type.includes("Before 12PM")) {
        timeSlot = "before 12PM";
    } else if (data.type.includes("After 12PM")) {
        timeSlot = "after 12PM";
    } else if (data.type.includes("All Tracks")) {
        timeSlot = "in total";
    }

    useEffect(() => {
        onRevealComplete?.();
    }, [onRevealComplete]);

    return (
        <div className="time-card">
            <div className="title"><h1>{data.type}</h1></div>
            <div className="general mt-5 lg:mt-10">
                <div className="num">{data.content}%</div>
                <div className="content">
                    For your last 50 tracks, you have spent <span className="font-bold">{data.content}%</span> of the time listening to Spotify {timeSlot}.
                </div>
            </div>
            <div className="click-to-reveal">
                Click anywhere within the card to reveal your next card
            </div>
        </div>
    );
}

export default PercentCard;