import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { toast } from "react-toastify";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await registerUser({ name, email, password });

      toast.success("Registration successful. Please login.");
      navigate("/login");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-company">Standard Interior</div>
        <div className="auth-subtitle">Create your account</div>

        {/* NAME */}
        <div className="auth-group">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className="auth-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD WITH TOGGLE */}
        <div className="auth-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* ROLE SELECT */}
        {/* <div className="auth-group">
          <select
            className="auth-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div> */}

        <button
          type="button"
          className="auth-btn"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <div className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
