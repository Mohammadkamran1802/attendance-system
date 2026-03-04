import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import "./Auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/auth/forgot-password", {
        email,
      });

      toast.success("OTP sent to your email");

      // go to verify OTP page
      navigate("/verify-otp", { state: { email } });

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP"
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
          Reset your password
        </div>

        <div className="auth-group">
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="auth-btn"
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <div className="auth-switch">
          Remember password?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
