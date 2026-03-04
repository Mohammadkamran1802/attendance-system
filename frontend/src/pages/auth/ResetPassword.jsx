import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import "./Auth.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // data from VerifyOtp page
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // protect direct access
  if (!email || !otp) {
    navigate("/forgot-password");
    return null;
  }

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      toast.success("Password reset successful");

      // redirect to login
      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-company">Standard Interior</div>
        <div className="auth-subtitle">
          Create New Password
        </div>

        <p className="auth-info">
          Reset password for <strong>{email}</strong>
        </p>

        <div className="auth-group">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="auth-group">
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />
        </div>

        <button
          type="button"
          className="auth-btn"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="auth-switch">
          Back to{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
