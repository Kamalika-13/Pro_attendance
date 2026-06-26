import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/attendance.css";
import { CSVLink } from "react-csv";

function Attendance() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [history, setHistory] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: "",
    check_in: "",
    check_out: "",
    status: "Present",
  });

  // ==========================
  // LOAD DATA
  // ==========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchEmployees();
    fetchAttendance();
  }, []);

  // ==========================
  // GET EMPLOYEES
  // ==========================
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // GET ALL ATTENDANCE
  // ==========================
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance");
      setAttendance(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // GET HISTORY (FIXED)
  // ==========================
  const fetchHistory = async (employeeId) => {
    try {
      if (!employeeId) return; // 🔥 prevent 404

      const res = await API.get(`/attendance/${employeeId}`);
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // HANDLE FORM CHANGE
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // MARK ATTENDANCE
  // ==========================
  const markAttendance = async () => {
    try {
      await API.post("/attendance", formData);

      alert("Attendance Marked Successfully");

      fetchAttendance();

      setFormData({
        employee_id: "",
        attendance_date: "",
        check_in: "",
        check_out: "",
        status: "Present",
      });
    } catch (err) {
      console.log(err);
      alert("Error Marking Attendance");
    }
  };

  // ==========================
  // CSV DATA
  // ==========================
  const csvData = attendance.map((att) => ({
    AttendanceID: att.attendance_id,
    EmployeeCode: att.employee_code,
    EmployeeName: att.name,
    Date: new Date(att.attendance_date).toLocaleDateString(),
    CheckIn: att.check_in,
    CheckOut: att.check_out,
    Status: att.status,
  }));

  return (
    <>
      <Sidebar />

      <div className="attendance-page">
        <h1 className="page-title">Attendance Management</h1>

        {/* ================= FORM ================= */}
        <div className="attendance-form">
          <h2>Mark Attendance</h2>

          <div className="form-grid">
            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="attendance_date"
              value={formData.attendance_date}
              onChange={handleChange}
            />

            <input
              type="time"
              name="check_in"
              value={formData.check_in}
              onChange={handleChange}
            />

            <input
              type="time"
              name="check_out"
              value={formData.check_out}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          <button onClick={markAttendance} className="attendance-btn">
            Mark Attendance
          </button>
        </div>

        {/* ================= HISTORY ================= */}
        <div className="attendance-card">
          <h2>Employee Attendance History</h2>

          <select
            value={selectedEmployee}
            onChange={(e) => {
              const id = e.target.value;

              setSelectedEmployee(id);

              
              if (id) {
                fetchHistory(id);
              } else {
                setHistory([]);
              }
            }}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.name}
              </option>
            ))}
          </select>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {history.map((att) => (
                <tr key={att.attendance_id}>
                  <td>{new Date(att.attendance_date).toLocaleDateString()}</td>
                  <td>{att.check_in}</td>
                  <td>{att.check_out}</td>
                  <td>{att.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= ALL RECORDS ================= */}
        <div className="attendance-card">
          <h2>Attendance Records</h2>

          <CSVLink
            data={csvData}
            filename={"attendance-report.csv"}
            className="export-btn"
          >
            Export CSV
          </CSVLink>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Code</th>
                <th>Name</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((att) => (
                <tr key={att.attendance_id}>
                  <td>{att.attendance_id}</td>
                  <td>{att.employee_code}</td>
                  <td>{att.name}</td>
                  <td>{new Date(att.attendance_date).toLocaleDateString()}</td>
                  <td>{att.check_in}</td>
                  <td>{att.check_out}</td>
                  <td>{att.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Attendance;