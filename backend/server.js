import cors from "cors";
import express from "express";
import session from "express-session";
import env from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import timeRoutes from "./routes/timeRoutes.js";
import { createClient } from "redis";
import { createRequire } from "module";
import { RedisStore } from "connect-redis";
import path from "path";

const require = createRequire(import.meta.url);

const app = express();

env.config();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production", 
    httpOnly: true }
};


if (process.env.NODE_ENV === "production") {
  const redisClient = createClient({ url: process.env.REDIS_URL });
  await redisClient.connect();

  // const RedisStore = connectRedis(session);

  app.use(session({
    ...sessionOptions,
    store: new RedisStore({ 
      client: redisClient,
      prefix: 'session:',
    }),
  }));
} else {
  app.use(session(sessionOptions));
}

// app.use(session({sessionOptions}));

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