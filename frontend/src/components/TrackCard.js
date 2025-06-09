// function getTrackDetail(item, count, type) {
//     if (item) {
//         return {
//             id: item.track.id,
//             name: item.track.name,
//             artists: item.track.artists.map(artist => artist.name).join(", "),
//             album: item.track.album.name,
//             image: item.track.album.images[0]?.url,
//             spotifyUrl: item.track.external_urls.spotify,
//             release: item.track.album.release_date,
//             duration: item.track.duration_ms,
//             count,
//             type,
//         };
//     }};

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

function TrackCard({ data, onRevealComplete }) {
    const PLACEHOLDER_IMAGE = process.env.PUBLIC_URL + "/Landscape.png";

    const IMAGE = data.content.image ? data.content.image : PLACEHOLDER_IMAGE;
    const infoItems = [
        { key: "image", render: () => (
        <div className="left">
            <img src={IMAGE}
             alt={data.content.name} />
        </div>
        ) },
        { key: "name", render: () => (
        <div className="flex items-center gap-2">
            <h2>{data.content.name}</h2>
            <div className="relative group">
            <a href={data.content.spotifyUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="text-neutral-400 hover:text-white transition" />
            </a>
            <div className="tooltip bottom-full">Open in Spotify</div>
            </div>
        </div>
        ) },
        { key: "artists", render: () => (
            <div className="text-md">
                {data.content.artists.length > 1 ? (
                    <span className="font-bold">Artists: </span>
                ) : (
                    <span className="font-bold">Artist: </span>
                )}
                {data.content.artists.map(artist => artist.name).join(", ")}
            </div>
        )},
        { key: "count", render: () => {
            if (data.content.count !== undefined && data.content.count !== null) {
            if (data.type === "Most Repeated Track") {
                return <div>In last 50 tracks, you have repeated this track <span className="font-bold">{data.content.count} time(s).</span></div>;
            } else if (data.type === "Most Skipped Track") {
                return <div>In last 50 tracks, you have skipped this track <span className="font-bold">{data.content.count} time(s).</span></div>;
            } else if (data.type === 'Love Hate Track') {
                return
            }  else if (data.type === 'Most Mainstream Track') {
                return <div><span className="font-bold">Popularity:</span> {data.content.count}</div>
            } else if (data.type === 'Most Underrated Track') {
                return <div><span className="font-bold">Popularity:</span> {data.content.count}</div>;
            }
            return <div>Count: {data.content.count}</div>;
            }
            return null;
        }},
    ];

    const [shown, setShown] = useState(0);

    useEffect(() => {
        if (shown < infoItems.length) {
            const timer = setTimeout(() => setShown((prev) => prev + 1), 300);
            return () => clearTimeout(timer);
        } else {
            onRevealComplete?.();
        }
    }, [shown, infoItems.length, onRevealComplete]);

    return (
        <div className="analysis-card">
        <div className="title">
            <h1>{data.type}</h1>
        </div>
        <div className="general">
            <div className="left">
            {IMAGE && (
                <img
                src={IMAGE}
                alt={data.content.name}/>
            )}
            </div>
            <div className="content">
                {infoItems.slice(1).map((item, i) => (
                <div key={item.key}>
                    {item.render()}
                </div>
                ))}
            </div>
        </div>

        {/* {shown >= infoItems.length && ( */}
            <div className="click-to-reveal">
                Click anywhere to reveal your next card
            </div>
        {/* )} */}
        </div>
    );
    }

export default TrackCard;