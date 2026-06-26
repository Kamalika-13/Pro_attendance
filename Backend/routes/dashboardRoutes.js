const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", verifyToken, async (req, res) => {

    try {

        const [totalEmployees] = await db.promise().query(
            "SELECT COUNT(*) AS total FROM employees"
        );

        const [activeEmployees] = await db.promise().query(
            "SELECT COUNT(*) AS total FROM employees WHERE status='active'"
        );

        const [presentToday] = await db.promise().query(
            "SELECT COUNT(*) AS total FROM attendance WHERE status='Present'"
        );

        const [absentToday] = await db.promise().query(
            "SELECT COUNT(*) AS total FROM attendance WHERE status='Absent'"
        );

        res.json({
            totalEmployees: totalEmployees[0].total,
            activeEmployees: activeEmployees[0].total,
            presentToday: presentToday[0].total,
            absentToday: absentToday[0].total
        });

    } catch (err) {

        res.status(500).json(err);

    }

});

module.exports = router;