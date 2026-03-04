import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔒 HARD LOCK
  const loginLock = useRef(false);

  const handleLogin = async () => {
    if (loginLock.current) return;
    loginLock.current = true;

    if (!email || !password) {
      toast.error("Email and password are required");
      loginLock.current = false;
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({ email, password });
      login(data.user, data.token);

      toast.success("Login successful");

      navigate(data.user.role === "admin" ? "/admin" : "/employee");

    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
      loginLock.current = false;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-company">Standard Interior</div>
        <div className="auth-subtitle">
          Welcome back, please login
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

        {/* FORGOT PASSWORD */}
        <div className="auth-forgot">
          <span onClick={() => navigate("/forgot-password")}>
            Forgot password?
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="button"
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* REGISTER */}
        <div className="auth-switch">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
