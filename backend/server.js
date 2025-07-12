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
import { RedisStore } from "connect-redis";

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
};

app.set('trust proxy', 1);

if (process.env.NODE_ENV === "production") {
  console.log("Production mode");
  const redisClient = createClient({ url: process.env.REDIS_URL });
  await redisClient.connect();

  console.log("Redis client connected");
  // const RedisStore = connectRedis(session);

  app.use(session({
    ...sessionOptions,
    name: '__Host-sid',
    cookie: { 
      maxAge: 24 * 60 * 60 * 1000,
      secure: true, 
      sameSite: "none",
      httpOnly: true,
      partitioned: true },
    store: new RedisStore({ 
      client: redisClient,
      prefix: 'session:',
    }),
  }));
} else {
  app.use(session(sessionOptions));
}

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log("Incoming request:", req.method);
  next();
});

app.use('/', authRoutes);

app.use('/api/home', homeRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/time-spent', timeRoutes);
app.use('/api/artist', artistRoutes);

app.get("/", (req, res) => {
  res.send("FiftyFi backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/check-session", (req,res) => {
  res.json({session: req.session});
});


app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
