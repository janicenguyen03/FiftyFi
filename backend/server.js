import cors from "cors";
import express from "express";
import session from "express-session";
import env from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";
// import artistRoutes from "./routes/artistRoutes.js";
import timeRoutes from "./routes/timeRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

env.config();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

const PORT = process.env.PORT || 5000;

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/check-session", (req,res) => {
  res.json({session: req.session});
});

app.use('/', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/time-spent', timeRoutes);

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});

{/* Top 6 songs
  Top 6 artists
  Tracks:
    most repeated, skipped, lovehate
    most mainstream, underrated
    trend setter/ hidden gem seeker
    recommend 1 song
  Artists:
    most repeated, skipped, lovehate
    most featured
    most mainstream, underrated
    most likely to belong to
    recommend 1 artist
  Time:
    time spent last 24 hours
    time spent morning
    time spent afternoon
    time period with most activity
    top song in morning
    rec song in morning
    top song at night
    rec song at night */}