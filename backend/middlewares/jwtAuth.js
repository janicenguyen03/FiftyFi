import jwt from "jsonwebtoken";

function jwtAuth(req, res, next) {
    let token;
    const auth = req.headers.authorization || "";
    if (auth.startsWith("Bearer ")) {token = auth.split(" ")[1]};
    
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.sendStatus(401);
        req.user = payload;
        next();
    });
}

export default jwtAuth;