import React from "react";

function Login() {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-br from-green-600 to-black text-white">
      <h1 className="text-4xl font-bold mb-6">Trackify</h1>
      <a href="http://localhost:5000/login">
        <button className="px-6 py-3 text-lg font-medium bg-green-500 hover:bg-green-600 hover:shadow-lg active:shadow-sm hover:text-gray-100 transition duration-300 rounded-full shadow-md">
          Login with Spotify
        </button>
      </a>
      <p className="text-l mt-16 text-gray-300">@ 2025 Developed by Janice Nguyen.</p>
      {/* icon */}
    </div>
  );
}

export default Login;
