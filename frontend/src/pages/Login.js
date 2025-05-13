function Login() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center login-background text-gray-100">
      <h1 className="text-5xl font-bold mb-10 pr-5">
        <img
          src={process.env.PUBLIC_URL + "white-icon.png"}
          className="w-12 h-12 inline-block mr-6 mb-4
          lg:w-16 lg:h-16 lg:mr-8"
          alt="Janice Nguyen Logo"
        />
        FiftyFi
      </h1>
      <a href="http://localhost:5000/login">
        <button className="btn text-xl">Login with Spotify</button>
      </a>
      <p className="lg:text-xl text-lg mt-16 text-neutral-200">
        @ 2025 Developed by Janice Nguyen.
      </p>
      <footer className="absolute bottom-8 font-semibold text-gray-300 text-md">
        This app uses the Spotify Web API but is not affiliated with or endorsed
        by Spotify.
      </footer>
    </div>
  );
}

export default Login;
