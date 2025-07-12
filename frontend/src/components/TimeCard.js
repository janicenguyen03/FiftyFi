import { useEffect } from "react";

function TimeCard({ data, onRevealComplete }) {
    
    useEffect(() => {
        onRevealComplete?.();
    }, [onRevealComplete]);
    // Helper to format numbers as two digits
    const formatTwoDigits = (num) => num.toString().padStart(2, '0');

    return (
        <div className="time-card">
            <div className="title">
                <h1>{data.type}</h1>
            </div>
            <div className="general exact-time">
                In exact, you have listened to Spotify for
                
                <div className="digital-num">
                    <div className="mb-2 font-extrabold">{formatTwoDigits(data.content.hours)} <span className="font-light text-white/50">HH</span></div>
                    <div className="mb-2 font-extrabold">{formatTwoDigits(data.content.minutes)} <span className="font-light text-white/50">MM</span></div>
                    <div className="font-extrabold">{formatTwoDigits(data.content.seconds)} <span className="font-light text-white/50">SS</span></div>
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