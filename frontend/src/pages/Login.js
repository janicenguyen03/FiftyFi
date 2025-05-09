import React from "react";

function Login() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center login-background text-gray-100">
      <h1 className="text-5xl font-bold mb-6">DailyPocket</h1>
      <a href="http://localhost:5000/login">
        <button className="btn text-xl">
          Login with Spotify
        </button>
      </a>
      <p className="text-xl mt-16 text-neutral-300">@ 2025 Developed by Janice Nguyen.</p>
      {/* icon */}
    </div>
  );
}

export default Login;
