import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Library from "./pages/Library";
import TopTracks from "./pages/TopTracks";
import PackOne from "./pages/PackOne";
import PackTwo from "./pages/PackTwo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/pack-one" element={<PackOne />} />
        <Route path="/pack-two" element={<PackTwo />} />
      </Routes>
    </Router>
  );
}

export default App;
