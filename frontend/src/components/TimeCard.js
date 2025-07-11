import { useEffect } from "react";

function TimeCard({ data, onRevealComplete }) {
    
    useEffect(() => {
        onRevealComplete?.();
    }, [onRevealComplete]);
    return (
        <div className="time-card">
            <div className="title">
                <h1>{data.type}</h1>
            </div>
            <div className="general">
                <div className="left">
                    In exact, you have listened to Spotify for
                    <b> {data.content.hours} {data.content.hours > 1 ? " hours " : " hour "}
                        {data.content.minutes} {data.content.minutes > 1 ? " minutes " : " minute "}
                        {data.content.seconds} {data.content.seconds > 1 ? " seconds " : " second "}</b>.
                </div>
            </div>

        {data.type !== "Exact Time Spent All Tracks" ? (
            <div className="click-to-reveal">
                Click anywhere within the card to reveal your next card
            </div>
        ) : (
            <div className="click-to-reveal">
                Click anywhere within the card to return home
            </div>
        )}
        </div>
    );
}

export default TimeCard;