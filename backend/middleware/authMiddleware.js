const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
}

const token = authHeader.split(" ")[1]; // 👈 Bearer हटाने के लिए

jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) {
        return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
});

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, "secretkey", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;