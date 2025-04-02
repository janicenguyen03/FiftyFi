import cors from "cors";
import express from "express";
import axios from "axios";
import env from "dotenv";
import querystring from "querystring";
import trackRoutes from "./routes/trackRoutes.js";

const app = express();
const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

app.use(cors());
app.use(express.json());

env.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const PORT = process.env.PORT || 5000;

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use('/api/tracks', trackRoutes);

app.get("/login", (req, res) => {
  // const state = generateRandomString(16);
  const scopes = "user-top-read user-read-recently-played user-follow-read user-library-read";
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

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  // const state = req.query.state || null;

  try {
    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = response.data.access_token;
    res.redirect(`http://localhost:3000/home?access_token=${access_token}`);
    
  } catch (error) {
    console.error("Error getting token: ", error);
    res.status(500).send("Authenticaiton failed");
  }
});

app.get("/api/user", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch user data" });
        }

        const data = await response.json();
        
        res.json({
            name: data.display_name,
            profilePicture: data.images.length > 0 ? data.images[0].url : null,
        })
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
    
app.get("/api/top-tracks", async (req, res) => {
  const { access_token } = req.query;
  const topTracksResponse = await axios.get(
    "https://api.spotify.com/v1/me/top/tracks",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  res.json(topTracksResponse.data);
});

// app.get('/refresh_token', function(req, res) {

//   var refresh_token = req.query.refresh_token;
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: {
//       'content-type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
//     },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token,
//           refresh_token = body.refresh_token || refresh_token;
//       res.send({
//         'access_token': access_token,
//         'refresh_token': refresh_token
//       });
//     }
//   });
// });

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
