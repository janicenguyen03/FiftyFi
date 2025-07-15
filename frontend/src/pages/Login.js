function Login() {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    return (
        <div className="login-page">
            <h1 className="text-5xl font-bold mb-10 pr-5">
                <img src={process.env.PUBLIC_URL + "white-icon.png"} alt="Janice Nguyen Logo" />
            FiftyFi
            </h1>
            <a href={`${BACKEND_URL}/login`}>
                <button className="btn text-xl">Login with Spotify</button>
            </a>
            <p className="lg:text-xl text-lg mt-16 text-neutral-200">
                @ {new Date().getFullYear()} Developed by Janice Nguyen.
            </p>
            <footer className="absolute bottom-8 font-semibold text-gray-300 text-md">
                This app uses the Spotify Web API but is not affiliated with or endorsed by Spotify.
            </footer>
        </div>
    );
}

export default Login;
