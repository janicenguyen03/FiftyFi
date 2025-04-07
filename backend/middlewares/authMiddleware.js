function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        console.log("User is authenticated");
        next();
    } else {
        console.log("User is not authenticated");
        res.status(401).json({ error: "Unauthorized" });
    }
}

export default isAuthenticated;