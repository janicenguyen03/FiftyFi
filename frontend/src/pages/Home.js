import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate()
    const [token, setToken] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("access_token");

        if (!token) {
            navigate("/");
        } else {
            localStorage.setItem("token", token);
            setToken(token);
        }
    }, [navigate]);

    return (
        <div>
            <h1>Trackify</h1>
            {/* Total time spent today*/}

            {/* New song listen to recently */}

            {/* People download playlist, if no then different topic */}
            <button onClick={() => navigate("/top-tracks")}>Get Top Tracks</button>
            
        </div>
    )
}

export default Home;