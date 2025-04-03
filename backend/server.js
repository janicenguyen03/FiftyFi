import cors from "cors";
import express from "express";
import session from "express-session";
import env from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";

const app = express();
const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

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

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const PORT = process.env.PORT || 5000;

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/check-session", (req,res) => {
  res.json({session: req.session});
});


app.use('/', authRoutes);
app.use('/api/tracks', trackRoutes);

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
