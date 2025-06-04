import { useNavigate } from "react-router-dom";
import ArtistFetcher from "../fetcher/ArtistFetcher";
import { House } from "lucide-react";
// import { motion } from "framer-motion";

function Artists() {
    const navigate = useNavigate();

    return (
        <div className="category-page">
            <div className="header">
                <button className="home-btn" aria-label="Home Button"
                onClick={() => navigate("/home")}>
                    <House size={24} className="text-white" 
                        aria-label="Home Icon" />
                </button>
                <h1>Artify</h1>
            </div>
            <p>Artist insights based on your latest 50 tracks</p>
            <ArtistFetcher />
        </div>
    );
}

export default Artists;