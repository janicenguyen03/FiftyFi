// import { Typewriter } from "react-simple-typewriter";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Profile from "../components/Profile";

function Home() {
  const BACKEND_URL = "http://localhost:5000";

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [showAnimation, setShowAnimation] = useState(false);

  const [lastTrack, setLastTrack] = useState({});
  const [playlistFollowers, setPlaylistFollowers] = useState(0);

  const [loading, setLoading] = useState(true);

  // Get user profile info
  useEffect(() => {
    axios
      .get(BACKEND_URL + "/me", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data: ", error);
        navigate("/");
      });
  }, [navigate]);

  // Get last track played
  useEffect(() => {
    fetch(BACKEND_URL + "/api/home/latest-track", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setLastTrack(data || {});
        console.log("Last track played:", data);
      })
      .catch((err) =>
        console.error("Error fetching most repeated tracks:", err)
      );
  }, []);

  // Get playlist followers
  useEffect(() => {
    fetch(BACKEND_URL + "/api/home/playlist-saved-count", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setPlaylistFollowers(data || 0);
        console.log("Playlist followers:", data);
      })
      .catch((err) =>
        console.error("Error fetching most repeated tracks:", err)
      );
  }, []);

  // Check if homepage is visited, if not load the framer motion
  useEffect(() => {
    const visited = localStorage.getItem("visitedHome");
    if (!visited) {
      setShowAnimation(true);
      localStorage.setItem("visitedHome", "true");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("visitedHome");
    window.location.href = BACKEND_URL + "/logout";
  };

  if (loading) {
    return null;
  }

  return (
    <div className="p-10 h-screen background text-neutral-100">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold">
              <img
                src={process.env.PUBLIC_URL + "white-icon.png"}
                className="w-12 h-12 inline-block mr-5 mb-4"
                alt="Janice Nguyen Logo"
              />
              FiftyFi
            </h1>
          </div>
          <Profile user={user} playlistFollowers={playlistFollowers} />
        </div>

        {/* Stats */}
        <div className="flex-grow flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl py-10 mx-auto">
          <div className="home-card">Your Recent Listening</div>
          <div onClick={() => navigate("/tracks")} className="home-card text-center">
            Trackify
          </div>
          <div onClick={() => navigate("/time")} className="home-card text-center">
            Timify
          </div>
          <div onClick={() => navigate("/artists")} className="home-card text-center">
            Artify
          </div>
        </div>
        </div>
        

        <button className="btn" onClick={handleLogout}>
            Logout
          </button>
          <footer className="absolute bottom-8 font-bold text-gray-300 text-md">
            @ 2025 Developed by Janice. All rights reserved.
          </footer>
      </div>
    </div>
  );
}

export default Home;
