import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // removes token + all stored data
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>Attendance Pro</h2>

      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/employees">Employees</Link></li>
        <li><Link to="/attendance">Attendance</Link></li>

        <li>
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;