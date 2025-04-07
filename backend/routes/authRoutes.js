import express from "express";
import env from "dotenv";
import axios from "axios";
import querystring from "querystring";
import isAuthenticated from "../middlewares/authMiddleware.js";

const router = express.Router();

env.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const USER_URL = "https://api.spotify.com/v1/me";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const AUTH_URL = "https://accounts.spotify.com/authorize?";

router.get("/login", (req, res) => {
    const scopes =
        "user-top-read user-read-recently-played user-follow-read \
        user-read-currently-playing";

    res.redirect(AUTH_URL +
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

    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;

    const userResponse = await axios.get(USER_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userData = userResponse.data;

    req.session.user = {
      id: userData.id,
      display_name: userData.display_name,
      profile_picture: userData.images.length > 0 ? userData.images[0].url : null,
    }

    req.session.access_token = access_token;
    req.session.refresh_token = refresh_token;
    req.session.save(err => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).send("Session error");
      }
      res.redirect("http://localhost:3000/home");
    });

  } catch (error) {
    console.error("Error getting token: ", error);
    res.status(500).send("Authenticaiton failed");
  }
});

router.get("/me", isAuthenticated, (req, res) => {
  const user = req.session.user;
  res.json({
    name: user.display_name,
    profilePicture: user.profile_picture,
  })
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