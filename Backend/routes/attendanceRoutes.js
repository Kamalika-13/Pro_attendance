const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();
console.log("Attendance routes loaded");

// ==========================
// 1. MARK ATTENDANCE
// ==========================
router.post("/", verifyToken, (req, res) => {
    const {
        employee_id,
        attendance_date,
        check_in,
        check_out,
        status
    } = req.body;

    const sql = `
        INSERT INTO attendance
        (employee_id, attendance_date, check_in, check_out, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [employee_id, attendance_date, check_in, check_out, status],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Attendance Marked Successfully",
                attendance_id: result.insertId
            });
        }
    );
});


// ==========================
// 2. GET ALL ATTENDANCE
// ==========================
router.get("/", verifyToken, (req, res) => {

    const sql = `
        SELECT
            a.attendance_id,
            e.employee_code,
            e.name,
            a.attendance_date,
            a.check_in,
            a.check_out,
            a.status
        FROM attendance a
        JOIN employees e ON a.employee_id = e.employee_id
        ORDER BY a.attendance_date DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});


// ==========================
// 3. GET ATTENDANCE BY EMPLOYEE ID (FIXED)
// ==========================
router.get("/:employeeId", verifyToken, (req, res) => {

    const employeeId = req.params.employeeId;

    const sql = `
        SELECT
            attendance_id,
            attendance_date,
            check_in,
            check_out,
            status
        FROM attendance
        WHERE employee_id = ?
        ORDER BY attendance_date DESC
    `;

    db.query(sql, [employeeId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});


module.exports = router;