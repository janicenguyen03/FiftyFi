import express from "express";
import env from "dotenv";
import axios from "axios";
import querystring from "querystring";
import jwt from "jsonwebtoken";
import jwtAuth from "../middlewares/jwtAuth.js";
import redisClient from "../middlewares/redisClient.js";

const router = express.Router();

env.config();

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const USER_URL = "https://api.spotify.com/v1/me";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const AUTH_URL = "https://accounts.spotify.com/authorize?";

router.get("/login", (req, res) => {
    const scopes =
        "user-top-read user-read-recently-played user-follow-read \
        user-read-currently-playing playlist-read-private playlist-read-collaborative";

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
      TOKEN_URL, querystring.stringify({
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

    const userResponse = await axios.get(USER_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userData = userResponse.data;

    const payload = {
        id: userData.id,
        display_name: userData.display_name,
        profile_picture: userData.images.length > 0 ? userData.images[0].url : null,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"});
    const refreshToken = jwt.sign(payload, JWT_SECRET, {expiresIn: "7d"});
    
    res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/api/auth/refresh"
    });

    await redisClient.set(`spotify:${userData.id}`, access_token, { EX: 3600 }); // expires in 1 hour

    console.log("Redirecting to home page");

    res.redirect(`${FRONTEND_URL}/home`);

  } catch (error) {
    console.error("Error getting token: ", error);
    res.status(500).send("Authenticaiton failed");
  }
});

router.post("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
    }

    try {
        const payload = jwt.verify(refreshToken, JWT_SECRET);
        if (!payload) {
            return res.status(401).json({ error: "Invalid refresh token" });
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        if (req.cookies.refreshToken) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: "/api/auth/refresh"
            })
        };

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error("Error refreshing token: ", error);
        res.status(401).json({ error: "Invalid refresh token" });
    }
});

router.get("/me", jwtAuth, (req, res) => {
  const user = req.user;
  res.json({
    name: user.display_name,
    profilePicture: user.profile_picture,
  })
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/api/auth/refresh"
    });
    return res.sendStatus(204);
})

export default router;