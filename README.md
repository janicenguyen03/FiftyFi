# FiftyFi

FiftyFi is a music analytics tool that helps you gain insights into your listening habits by tracking your last 50 played tracks and analyzing your top items from the past month.

- **Live Frontend:** https://fiftyfi.vercel.app/ (Deployed with Vercel)
- **Live Backend:** https://fiftyfi.onrender.com (Deployed with Render)

## Categories:

- **Home page:** Display the playlist popularity and currently playing track (or latest played track)
- **Trackify:** Discover track insights such as top 6 tracks of the month and other track analysis
- **Timify:** Analyze listening patterns by time of day, including breakdowns of tracks played before and after noon
- **Artify:** Explore insights about top 6 artists and other analysis including but not limited to most repeated or skipped artist

## Features

- **Latest Played Track:** Instantly view the most recently played track on the home page.
- **Playlist Popularity:** See the total number of times your playlists have been saved by other users.
- **Top Artists (Last Month):** Discover your most listened-to artists over the past month.
- **Track Analysis (Last 50 Tracks):**
    - Most repeated tracks and artists
    - Most skipped tracks and artists
    - "Love-Hate" tracks and artists (frequently played but often skipped)
    - Most featured artists
    - Most mainstream and most underrated artists
- **Top Tracks (Last Month):** Explore your most played tracks from the last month.
- **Listening Patterns by Time of Day:**
    - Percentage of listening before and after 12pm
    - Total listening time before and after 12pm, and overall
    - Most repeated and most skipped tracks before and after 12pm

## Required Spotify Scopes

To provide these insights, FiftyFi requests the following Spotify API scopes:

- `user-top-read`
- `user-read-recently-played`
- `user-follow-read`
- `user-read-currently-playing`
- `playlist-read-private`
- `playlist-read-collaborative`

## Getting Started locally

1. Clone the repository.
2. Set up your Spotify API credentials.
3. Run npm i in frontend folder
4. Run npm i in backend folder
5. Run the frontend app with npm start
6. Run the backend app with node/nodemon server.js
7. Connect your Spotify account.

## License

MIT
