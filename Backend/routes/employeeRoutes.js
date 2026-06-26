const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Add Employee
router.post("/", verifyToken, (req, res) => {

    console.log("BODY:", req.body);

    const {
        employee_code,
        name,
        email,
        mobile,
        department,
        designation,
        status
    } = req.body;

    const sql = `
        INSERT INTO employees
        (
            employee_code,
            name,
            email,
            mobile,
            department,
            designation,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee_code,
            name,
            email,
            mobile,
            department,
            designation,
            status
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Employee Added Successfully"
            });

        }
    );

});

// Get All Employees
router.get("/", verifyToken, (req, res) => {

    const sql = "SELECT * FROM employees";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});

// Update Employee
router.put("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    const {
        name,
        email,
        mobile,
        department,
        designation,
        status
    } = req.body;

    const sql = `
        UPDATE employees
        SET
        name=?,
        email=?,
        mobile=?,
        department=?,
        designation=?,
        status=?
        WHERE employee_id=?
    `;

    db.query(
        sql,
        [
            name,
            email,
            mobile,
            department,
            designation,
            status,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Employee Updated Successfully"
            });

        }
    );

});
// Delete Employee
router.delete("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM employees WHERE employee_id=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Employee Deleted Successfully"
        });

    });

});
// Search Employees
router.get("/search/name", verifyToken, (req, res) => {

    const keyword = req.query.keyword;

    const sql =
        "SELECT * FROM employees WHERE name LIKE ?";

    db.query(
        sql,
        [`%${keyword}%`],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
module.exports = router;