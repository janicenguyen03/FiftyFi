import session from "express-session";
import express from "express";

function isAuthenticated(req, res, next) {
    if (req.session.access_token || req.session.refresh_token) {
        console.log("User is authenticated");
        next();
    } else {
        console.log("User is not authenticated");
        res.status(401).json({ error: "Unauthorized" });
    }
}

export default isAuthenticated;