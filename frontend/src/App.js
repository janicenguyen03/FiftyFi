import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TopTracks from "./pages/TopTracks";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        {/* <Route path="/top-artists" element={<TopArtists />} /> */}
        {/* <Route path="/top-genres" element={<TopGenres />} /> */}
        {/* <Route path="/recommendations" element={<Recommendations />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
