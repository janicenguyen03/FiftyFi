// import { Typewriter } from "react-simple-typewriter";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";
import PlayTrack from "../components/PlayTrack";

function Home() {
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
        setPlaylistFollowers(data.followers || 0);
        if (!process.env.NODE_ENV) {
          console.log("Playlist followers count:", data);
        }
      })
      .catch((err) =>
        console.error("Error fetching most repeated tracks:", err)
      );
  }, [BACKEND_URL]);

  // Handle Logout
  async function handleLogout() {
    try {
      await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="sm:p-10 p-5 min-h-screen md:h-screen background text-neutral-100">
      <div className="lg:max-w-screen-xl max-w-screen-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center sm:mb-8">
          <div className="flex items-center">
            <h1 className="md:text-5xl sm:text-3xl text-2xl font-bold">
              <img
                src={process.env.PUBLIC_URL + "white-icon.png"}
                className="md:w-12 md:h-12 sm:w-8 sm:h-8 w-6 h-6 inline-block sm:mr-5 sm:mb-4 mr-2 mb-2"
                alt="Janice Nguyen Logo"
              />
              FiftyFi
            </h1>
          </div>
          <Profile user={user} playlistFollowers={playlistFollowers} />
        </div>

        {/* Stats */}
        <div className="flex-grow flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl lg:my-7 py-10 mx-auto">
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
      <div className="absolute lg:bottom-10 bottom-4 left-0 right-0 mx-auto flex flex-col items-center justify-center">
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
        <footer className="md:font-bold font-light text-gray-300 md:text-md text-sm text-center">
          @ {new Date().getFullYear()} Developed by Janice. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Home;
