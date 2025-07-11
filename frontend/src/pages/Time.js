import { House } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TimeFetcher from "../fetcher/TimeFetcher";

function Time() {
    const navigate = useNavigate();

    return (
        <div className="category-page">
            <div className="header">
                <button className="home-btn" aria-label="Home Button"
                    onClick={() => navigate("/home")}>
                    <House size={24} className="text-white" 
                        aria-label="Home Icon" />
                </button>
                <h1>Timify</h1>
            </div>
            <p>Time insights based on your latest 50 tracks</p>
            <TimeFetcher />
        </div>
    )
}

export default Time;