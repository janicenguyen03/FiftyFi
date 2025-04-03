// import { Typewriter } from "react-simple-typewriter";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/me", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data: ", error);
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    const visited = localStorage.getItem("visitedHome");
    if (!visited) {
      setShowAnimation(true);
      localStorage.setItem("visitedHome", "true");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("visitedHome");
    window.location.href = "http://localhost:5000/logout";
  }

  return (
    <div className="flex flex-col items-center p-6 h-screen background text-white">
      {user && showAnimation ? (
        <>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold"
          >
            Hello {user.name}
          </motion.h1>
          <motion.img
            src={user.profilePicture}
            alt="Profile"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-24 h-24 rounded-full mt-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mt-4 text-lg"
          >
            Welcome to Trackify!
            <br />
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            <button className="btn" onClick={() => navigate("/top-tracks")}>
              Get Top Tracks
            </button>
            <button className="btn" onClick={handleLogout}>
                Logout
            </button>
          </motion.div>
        </>
      ) : (
        <>
          {user ? (
            <div className="flex flex-col items-center justify-center mb-10">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
              <h1 className="font-bold text-6xl py-5">Hello {user.name}</h1>
            </div>
          ) : (
            <p>Loading user info... </p>
          )}
          <h2 className="font-bold text-4xl mb-10 text-gray-300">
            Welcome to Trackify!
          </h2>

          {/*  */}
          {/* Total time spent today*/}

          {/* New song listen to recently */}

          {/* People download playlist, if no then different topic */}

          <button onClick={() => navigate("/top-tracks")} className="btn">
            Get Top Tracks
          </button>
            <button className="btn" onClick={ handleLogout }>
                Logout
            </button>
        </>
      )}
    </div>
  );
}

export default Home;
