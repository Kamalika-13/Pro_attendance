import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/employees.css";

function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employee_code: "",
    name: "",
    email: "",
    mobile: "",
    department: "",
    designation: "",
    status: "Active",
  });

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  fetchEmployees();

}, []);
  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Employee
  const addEmployee = async () => {
    try {
      await API.post("/employees", formData);

      alert("Employee Added Successfully");

      fetchEmployees();

      setFormData({
        employee_code: "",
        name: "",
        email: "",
        mobile: "",
        department: "",
        designation: "",
        status: "Active",
      });
    } catch (err) {
      console.log(err);
      alert("Error Adding Employee");
    }
  };
  const updateEmployee = async () => {
  try {
    await API.put(
      `/employees/${editingId}`,
      formData
    );

    alert("Employee Updated");

    setEditingId(null);

    fetchEmployees();

    setFormData({
      employee_code: "",
      name: "",
      email: "",
      mobile: "",
      department: "",
      designation: "",
      status: "Active",
    });

  } catch (err) {
    console.log(err);
  }
};

  // Delete Employee
  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/employees/${id}`);

      alert("Employee Deleted Successfully");

      fetchEmployees();
    } catch (err) {
      console.log(err);
      alert("Error Deleting Employee");
    }
  };

  return (
    <>
    <Sidebar />

    <div className="employee-page">
      <h1>Employee Management</h1>

      <h2>Add Employee</h2>

      <div className="employee-form">
      
        <input
          type="text"
          name="employee_code"
          placeholder="Employee Code"
          value={formData.employee_code}
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
        />

      <button
        onClick={
          editingId
           ? updateEmployee
           : addEmployee
        }
     >
        {editingId
         ? "Update Employee"
         : "Add Employee"}
     </button>
      </div>

      <hr />

      <h2>Employee List</h2>

      <input
        type="text"
        placeholder="Search Employee By Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "15px",
          padding: "8px",
          width: "300px",
        }}
      />

      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees
            .filter((emp) =>
              emp.name
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((emp) => (
              <tr key={emp.employee_id}>
                <td>{emp.employee_id}</td>
                <td>{emp.employee_code}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.mobile}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>{emp.status}</td>

                <td>
                  <button
                  onClick={() => {
                    setEditingId(emp.employee_id);
                    setFormData({
                      employee_code: emp.employee_code,
                      name: emp.name,
                      email: emp.email,
                      mobile: emp.mobile,
                      department: emp.department,
                      designation: emp.designation,
                      status: emp.status,
                    });
                   }}
                 >
                   Edit
                 </button>
                  <button
                    onClick={() =>
                      deleteEmployee(emp.employee_id)
                    }
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
        </div>
  </>
);
}

export default Employees;