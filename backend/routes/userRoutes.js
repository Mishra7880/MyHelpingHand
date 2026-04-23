const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register API
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

            db.query(sql, [name, email, hashedPassword, role || "user"], (err, result) => {
        
        
            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({ message: "User registered successfully" });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

// Login API
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    "secretkey",
    { expiresIn: "1h" }
);

res.json({
    message: "Login successful",
    token: token
});
    });
});