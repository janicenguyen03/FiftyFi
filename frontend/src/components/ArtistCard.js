import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

function ArtistCard({ data, onRevealComplete }) {

    const PLACEHOLDER_IMAGE = process.env.PUBLIC_URL + "/Portrait.png";

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
                <ExternalLink size={16} className="external-link" />
            </a>
            <div className="tooltip bottom-full">Open in Spotify</div>
            </div>
        </div>
        ) },
        { key: "genres", render: () =>
        Array.isArray(data.content.genres) && data.content.genres.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
            {data.content.genres.map((genre) => (
                <span key={genre}
                    className="px-3 py-1 rounded-full bg-black/50 text-white text-sm
                    font-semibold hover:bg-neutral-100/20 transition"
                >{genre}</span>
            ))}
            </div>
        ) : null},
        { key: "count", render: () => {
            if (data.content.count !== undefined && data.content.count !== null) {
            if (data.type === "Most Repeated Artist") {
                return <div>In last 50 tracks, you have repeated this artist <span className="font-bold">{data.content.count} time(s).</span></div>;
            } else if (data.type === "Most Skipped Artist") {
                return <div>In last 50 tracks, you have skipped this artist <span className="font-bold">{data.content.count} time(s).</span></div>;
            } else if (data.type === 'Love Hate Artist') {
                return
            } else if (data.type === 'Most Featured Artist') {
                return <div>In last 50 tracks, this artist has been featured in your playlists <span className="font-bold">{data.content.count} time(s).</span></div>;
            } else if (data.type === 'Most Mainstream Artist') {
                return <div><span className="font-bold">Popularity:</span> {data.content.count}</div>
            } else if (data.type === 'Most Underrated Artist') {
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
                            alt={data.content.name}
                        />
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

            {data.type === "Most Underrated Artist" ? (
                <div className="click-to-reveal">
                    Click anywhere within the card to return home
                </div>
            ) : (
                <div className="click-to-reveal">
                    Click anywhere within the card to reveal your next card
                </div>
            )}
        </div>
    );
    }

export default ArtistCard;