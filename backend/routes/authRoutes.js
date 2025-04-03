import express from "express";
import env from "dotenv";
import axios from "axios";
import querystring from "querystring";

const router = express.Router();

env.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const TOKEN_URL = "https://accounts.spotify.com/api/token";

router.get("/login", (req, res) => {
    const scopes =
        "user-top-read user-read-recently-played user-follow-read \
        user-read-currently-playing";

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: CLIENT_ID,
                scope: scopes,
                redirect_uri: REDIRECT_URI,
        })
    );
});

router.get("/callback", async (req, res) => {
    const code = req.query.code || null;

    try {
    const response = await axios.post(
      TOKEN_URL,
      querystring.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    req.session.access_token = response.data.access_token;
    req.session.refresh_token = response.data.refresh_token;
    req.session.save();

    res.redirect(`http://localhost:3000/home`);
  } catch (error) {
    console.error("Error getting token: ", error);
    res.status(500).send("Authenticaiton failed");
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.session.access_token || req.session.refresh_token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch user data" });
    }

    const data = await response.json();

    res.json({
      name: data.display_name,
      profilePicture: data.images.length > 0 ? data.images[0].url : null,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("http://localhost:3000/");
  });
});

export default router;