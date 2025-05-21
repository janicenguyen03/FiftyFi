// import { Typewriter } from "react-simple-typewriter";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Profile from "../components/Profile";
import PlayTrack from "../components/PlayTrack";

function Home() {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

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
        console.log(`${BACKEND_URL}/me`);
        console.error("Error fetching user data: ", error);
        navigate("/");
      });
  }, [navigate, BACKEND_URL]);

  // Get last track played
  useEffect(() => {
    fetch(BACKEND_URL + "/api/home/latest-track", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setLastTrack(data || {});
        if (!process.env.NODE_ENV) {
          console.log("Last track played:", data);
        }
      })
      .catch((err) =>
        console.error("Error fetching most repeated tracks:", err)
      );
  }, [BACKEND_URL]);

  // Get playlist followers
  useEffect(() => {
    fetch(BACKEND_URL + "/api/home/playlist-saved-count", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setPlaylistFollowers(data || 0);
        if (!process.env.NODE_ENV) {
          console.log("Playlist followers count:", data);
        }
      })
      .catch((err) =>
        console.error("Error fetching most repeated tracks:", err)
      );
  }, [BACKEND_URL]);

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
    <div className="p-10 min-h-screen md:h-screen background text-neutral-100">
      <div className="lg:max-w-screen-xl max-w-screen-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl my-5 py-10 mx-auto">
            <PlayTrack track={lastTrack} />
            <div
              onClick={() => navigate("/tracks")}
              className="home-card home-card-btn"
            >
              Trackify
            </div>
            <div
              onClick={() => navigate("/time")}
              className="home-card home-card-btn"
            >
              Timify
            </div>
            <div
              onClick={() => navigate("/artists")}
              className="home-card home-card-btn"
            >
              Artify
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-center mt-10 pt-20 lg:pt-0">
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
        <footer className="font-bold text-gray-300 text-md text-center mt-auto">
          @ 2025 Developed by Janice. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Home;
