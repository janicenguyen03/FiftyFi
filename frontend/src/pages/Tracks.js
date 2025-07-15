import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";
import TrackFetcher from "../fetcher/TrackFetcher";

function Tracks() {
    const navigate = useNavigate();

    return (
        <div className="category-page">
            <div className="header">
                <button className="home-btn" aria-label="Home Button"
                    onClick={() => navigate("/home")}
                >
                    <House size={24} className="text-white" aria-label="Home Icon" />
                </button>
                <h1>Trackify</h1>
            </div>
            <p>Track insights based on your latest 50 tracks</p>
            <TrackFetcher />
        </div>
    );
}

export default Tracks;
