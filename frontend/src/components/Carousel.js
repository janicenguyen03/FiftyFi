import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtistCard from "./ArtistCard";
import TrackCard from "./TrackCard";
import TimeCard from "./TimeCard";
import PercentCard from "./PercentCard";

export default function Carousel({ items, onFinish }) {
    const navigate = useNavigate();
    
    const [index, setIndex] = useState(0);
    const [cardRevealed, setCardRevealed] = useState(false);

    if (!items || items.length === 0) return <p>No data to show.</p>;

    function next() {
        if (!cardRevealed) return;
        const isLast = index === items.length - 1;
        if (isLast){
            onFinish?.();
            navigate("/home");
        } else
        {
            setIndex((prev) => prev + 1);
            setCardRevealed(false);
        }
    };

    function renderCard(item) {
        if (item && item.type && item.type.includes("Artist")) {
            return <ArtistCard data={item}
                onRevealComplete={() => setCardRevealed(true)}
            />;
        }
        else if (item && item.type && item.type.includes("Exact")) {
            return <TimeCard data={item}
                onRevealComplete={() => setCardRevealed(true)}
            />;
        }
        else if (item && item.type && item.type.includes("Percentage")) {
            return <PercentCard data={item}
                onRevealComplete={() => setCardRevealed(true)}
            />;
        }
        else if (item.type && item.type.includes("Track")) {
            return <TrackCard data={item} 
                onRevealComplete={() => setCardRevealed(true)}
            />;
        }
    };

    return (
        <div onClick={next}>
            {renderCard(items[index])}
        </div>
    );
  }
