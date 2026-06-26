const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {

        const token = jwt.sign(
            {
                username: username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            message: "Login Successful",
            token
        });
    }

    return res.status(401).json({
        message: "Invalid Credentials"
    });
});

module.exports = router;