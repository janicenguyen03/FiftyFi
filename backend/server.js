import cors from "cors";
import express from "express";
import session from "express-session";
import env from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";

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

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
