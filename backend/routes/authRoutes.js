import express from "express";
import env from "dotenv";
import axios from "axios";
import querystring from "querystring";
import crypto from "crypto";
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

function base64url(buffer) {
    return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

function generateCodeVerifier() {
    return base64url(crypto.randomBytes(64));
};

function generateCodeChallenge(codeVerifier) {
    const hash = crypto.createHash("sha256").update(codeVerifier).digest();
    return base64url(hash);
};

router.get("/login", (req, res) => {
    const scopes =
        "user-top-read user-read-recently-played user-follow-read \
        user-read-currently-playing playlist-read-private playlist-read-collaborative";

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = crypto.randomBytes(16).toString("hex");

    res.cookie("pkce_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 5 * 60 * 1000,
    });

    const authUrl =
      AUTH_URL +
      querystring.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scopes,
        redirect_uri: REDIRECT_URI,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });

    res.redirect(authUrl);
});

router.get("/callback", async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    try {
        const codeVerifier = req.cookies.pkce_verifier;

        if (!codeVerifier) {
            return res.status(400).send("Code verifier missing");
        }

        const response = await axios.post(
            TOKEN_URL,
            querystring.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,           // include client_id
                code_verifier: codeVerifier,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
                },
            }
        );

        res.clearCookie("pkce_verifier");
        
        const access_token = response.data.access_token;

        let userResponse;
        try {
            userResponse = await axios.get(USER_URL, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    return res.status(401).send("Unauthorized account");
                }
                if (error.response.status === 429) {
                    return res.status(429).send("Out of token (rate limited)");
                }
            }
            return res.status(500).send("Error fetching user profile");
        }

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
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/api/auth/refresh"
        });

        await redisClient.set(`spotify:${userData.id}`, access_token, { EX: 3600 }); // expires in 1 hour

        console.log("Redirecting to home page");

        res.redirect(`${FRONTEND_URL}/home`);

    } catch (error) {
        console.error("Error getting token: ", error);

        res.status(500).send("Authentication failed");
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
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
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
    });
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