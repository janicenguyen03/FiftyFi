import React, { useState, useEffect } from "react";
import { fetchTopData } from "../utils/fetchTopData";
import { getTopArtists, getTopSongs, getTopGenres } from "../utils/dataProcessor";

function TopItem({ type }) {
    const [getTopItems, setTopItems] = useState(null);
    const [timeRange, setTimeRange] = useState("short_term")

    useEffect(() => {
        async function fetchData() {
            const data = await fetchTopData(type, timeRange);
            let topItem = null;

            if (type === "tracks") {
                topItem = getTopSongs(data);
            } else if (type === "artists") {
                topItem = getTopArtists(data);
            } else if (type === "genres") {
                topItem = getTopGenres(data);
            }

            setTopItems(topItem.length ? topItem[0] : null);            
            
        }
        fetchData();
    }, [type, timeRange]);
}