import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">

      {/* ── Left branding panel ── */}
      <motion.div
        className="login-left"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="brand-icon">⏱</div>

        <p className="brand-label">Pro Attendance System</p>

        <h2>
          Track your team,<br />
          <span>effortlessly.</span>
        </h2>

        <p>
          A smarter way to monitor attendance, manage employees,
          and get real-time insights — all from one dashboard.
        </p>

        <div className="stat-row">
          <div className="stat-item">
            <span className="stat-num">99%</span>
            <span className="stat-lbl">Uptime</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">500+</span>
            <span className="stat-lbl">Companies</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">24/7</span>
            <span className="stat-lbl">Support</span>
          </div>
        </div>
      </motion.div>

      {/* ── Right form panel ── */}
      <div className="login-right">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        >
          <div className="login-right-header">
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: "#f43f5e",
                fontSize: 13,
                marginBottom: 12,
                padding: "10px 14px",
                background: "rgba(244,63,94,0.08)",
                borderRadius: 8,
                border: "1px solid rgba(244,63,94,0.2)",
              }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </motion.button>

          <p className="login-footer">
            Having trouble? <span>Contact your administrator</span>
          </p>
        </motion.div>
      </div>

    </div>
  );
}

export default Login;
