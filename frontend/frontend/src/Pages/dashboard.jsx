import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import API from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });

  const [departmentStats, setDepartmentStats] = useState([]);

  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    halfDay: 0,
    leave: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const empRes = await API.get("/employees");
      const attRes = await API.get("/attendance");

      const employees = empRes.data;
      const attendance = attRes.data;

      const activeEmployees = employees.filter(
        (emp) =>
          emp.status &&
          emp.status.toLowerCase() === "active"
      ).length;

      const presentToday = attendance.filter(
        (att) => att.status === "Present"
      ).length;

      const absentToday = attendance.filter(
        (att) => att.status === "Absent"
      ).length;

      setStats({
        totalEmployees: employees.length,
        activeEmployees,
        presentToday,
        absentToday,
      });

      setAttendanceSummary({
        present: attendance.filter(
          (att) => att.status === "Present"
        ).length,

        absent: attendance.filter(
          (att) => att.status === "Absent"
        ).length,

        halfDay: attendance.filter(
          (att) => att.status === "Half Day"
        ).length,

        leave: attendance.filter(
          (att) => att.status === "Leave"
        ).length,
      });

      const departmentData = Object.values(
        employees.reduce((acc, emp) => {
          const dept = emp.department || "Unknown";

          if (!acc[dept]) {
            acc[dept] = {
              department: dept,
              employees: 0,
            };
          }

          acc[dept].employees++;

          return acc;
        }, {})
      );

      setDepartmentStats(departmentData);

    } catch (err) {
      console.log(err);
    }
  };

  const chartData = [
    {
      name: "Present",
      value: stats.presentToday,
    },
    {
      name: "Absent",
      value: stats.absentToday,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444",
  ];

  return (
    <>
      <Sidebar />

      <div className="dashboard-page">

        <div className="dashboard-header">

          <div>
            <h1 className="dashboard-title">
              Employee Attendance Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Monitor employees and attendance statistics
            </p>
          </div>

          <div className="date-box">
            {new Date().toLocaleDateString()}
          </div>

        </div>

        {/* Dashboard Cards */}

        <div className="stats-grid">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card blue"
          >
            <h2>{stats.totalEmployees}</h2>
            <p>👨‍💼 Total Employees</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card green"
          >
            <h2>{stats.activeEmployees}</h2>
            <p>🟢 Active Employees</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card orange"
          >
            <h2>{stats.presentToday}</h2>
            <p>✅ Present Today</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card red"
          >
            <h2>{stats.absentToday}</h2>
            <p>❌ Absent Today</p>
          </motion.div>

        </div>

        {/* Charts */}

        <div className="chart-section">

          <div className="chart-box">

            <h2 className="chart-title">
              Attendance Overview
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

          <div className="chart-box">

            <h2 className="chart-title">
              Department Wise Employees
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={departmentStats}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="department" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="employees"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Attendance Summary */}

        <div style={{ marginTop: "40px" }}>

          <h2 className="chart-title">
            Attendance Summary
          </h2>

          <div className="stats-grid">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="dashboard-card green"
            >
              <h2>{attendanceSummary.present}</h2>
              <p>✅ Present</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="dashboard-card red"
            >
              <h2>{attendanceSummary.absent}</h2>
              <p>❌ Absent</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="dashboard-card orange"
            >
              <h2>{attendanceSummary.halfDay}</h2>
              <p>🕒 Half Day</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="dashboard-card blue"
            >
              <h2>{attendanceSummary.leave}</h2>
              <p>🌴 Leave</p>
            </motion.div>

          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;
