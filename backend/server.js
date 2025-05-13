import cors from "cors";
import express from "express";
import session from "express-session";
import env from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
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
app.use('/api/artist', artistRoutes);

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});

{/* Top 6 songs
  Top 6 artists
  Tracks:
    trend setter/ hidden gem seeker
    recommend 1 song
  Artists:
    most repeated, skipped, lovehate
    most featured
    most mainstream, underrated
    most likely to belong to
    recommend 1 artist
  Time:
    time period with most activity
    rec song in morning
    rec song at night */}