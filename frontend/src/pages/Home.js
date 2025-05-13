// import { Typewriter } from "react-simple-typewriter";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    <div className="flex flex-col items-center p-6 h-screen background text-neutral-100">
      {showAnimation ? (
        <>
          <motion.img
            src={user.profilePicture}
            alt="Profile"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, y: 10 }}
            transition={{ duration: 0.8 }}
            className="w-24 h-24 rounded-full"
          />
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold py-10"
          >
            Hello {user.name}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="font-bold text-4xl mb-5 text-gray-300"
          >
            Welcome to DailyPocket!
            <br />
          </motion.h2>
          <motion.div
            className="mt-10 flex flex-col justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            <button className="btn" onClick={() => navigate("/top-tracks")}>
              Top Tracks
            </button>
            <button className="btn" onClick={() => navigate("/pack-one")}>
              Time Track
            </button>
            <button className="btn" onClick={() => navigate("/pack-two")}>
              Artist Track
            </button>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
            
          </motion.div>

          <motion.footer
            className="absolute bottom-8 font-bold text-gray-300 text-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          >
            @ 2025 Developed by Janice. All rights reserved.
          </motion.footer>
        </>
      ) : (
        <>
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <h1 className="font-bold text-6xl py-10">Hello {user.name}</h1>

          {/* <p>Loading user info... </p> */}

          <h2 className="font-bold text-4xl mb-5 text-gray-300">
            This is DailyPocket!
          </h2>

          {/* People download playlist, if no then different topic */}

          <button onClick={() => navigate("/top-tracks")} className="btn">
            Your Tracks Wrapped
          </button>
          <button onClick={() => navigate("/pack-one")} className="btn">
            Your Time Wrapped
          </button>
          <button onClick={() => navigate("/pack-two")} className="btn">
            Your Artist Wrapped
          </button>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
          <footer className="absolute bottom-8 font-bold text-gray-300 text-md">
            @ 2025 Developed by Janice. All rights reserved.
          </footer>
        </>
      )}
    </div>
  );
}

export default Home;
