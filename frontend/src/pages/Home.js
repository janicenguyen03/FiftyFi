import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (!token) {
      navigate("/");
    } else {
      localStorage.setItem("token", token);
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-600 to-black text-white">
      <h1 className="font-bold text-6xl py-5">Hello </h1>
      <h2 className="font-bold text-4xl mb-10">Welcome to Trackify</h2>

      {/* Total time spent today*/}

      {/* New song listen to recently */}

      {/* People download playlist, if no then different topic */}
      
        <button onClick={() => navigate("/top-tracks")} className="px-6 py-3 mb-5 text-lg font-medium bg-green-500 hover:bg-green-600 hover:shadow-lg active:shadow-sm hover:text-gray-100 transition duration-300 rounded-full shadow-md">
          Get Top Tracks
        </button>
        <button onClick={() => navigate("/logout")} className="px-6 py-3 text-lg font-medium bg-green-500 hover:bg-green-600 hover:shadow-lg active:shadow-sm hover:text-gray-100 transition duration-300 rounded-full shadow-md">
          Logout
       </button>
    </div>
  );
}

export default Home;
