import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/login";
import Dashboard from "./Pages/dashboard";
import Employees from "./Pages/employees";
import Attendance from "./Pages/attendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;