// import { Typewriter } from "react-simple-typewriter";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState({});

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("access_token");

        if (!token) {
            navigate("/");
        } else {
            setToken(token);
            localStorage.setItem("token", token);
        }
    }, [navigate]);

    useEffect(() => {
        if (!token) return;

        fetch(`http://localhost:5000/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => response.json())
        .then((data) => {
            setUser(data || {});
        })
        .catch((err) => console.error("Error fetching top tracks:", err));
    }, [token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-600 to-black text-white">
        { user ? (
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
      <h2 className="font-bold text-4xl mb-10 text-gray-300">Welcome to Trackify!</h2>

      {/*  */}
      {/* Total time spent today*/}

      {/* New song listen to recently */}

      {/* People download playlist, if no then different topic */}

      <button
        onClick={() => navigate("/top-tracks")}
        className="px-6 py-3 mb-5 text-lg font-medium bg-green-500 hover:bg-green-600 hover:shadow-lg active:shadow-sm hover:text-gray-100 transition duration-300 rounded-full shadow-md"
      >
        Get Top Tracks
      </button>
      <button
        className="px-6 py-3 text-lg font-medium bg-green-500 hover:bg-green-600 hover:shadow-lg active:shadow-sm hover:text-gray-100 transition duration-300 rounded-full shadow-md"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
