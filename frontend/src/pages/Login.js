import React from "react";

function Login() {
  return (
    <div className="flex flex-col h-screen items-center justify-center background text-white">
      <h1 className="text-4xl font-bold mb-6">Trackify</h1>
      <a href="http://localhost:5000/login">
        <button className="btn">
          Login with Spotify
        </button>
      </a>
      <p className="text-l mt-16 text-gray-300">@ 2025 Developed by Janice Nguyen.</p>
      {/* icon */}
    </div>
  );
}

export default Login;
