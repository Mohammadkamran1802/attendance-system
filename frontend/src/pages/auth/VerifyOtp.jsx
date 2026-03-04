import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import "./Auth.css";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from ForgotPassword page
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // safety check (direct access protection)
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/auth/verify-otp", {
        email,
        otp,
      });

      toast.success("OTP verified");

      // move to reset password page
      navigate("/reset-password", {
        state: { email, otp },
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP"
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
          Verify OTP
        </div>

        <p className="auth-info">
          OTP sent to <strong>{email}</strong>
        </p>

        <div className="auth-group">
          <input
            type="text"
            placeholder="Enter 6 digit OTP"
            value={otp}
            maxLength={6}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        <button
          type="button"
          className="auth-btn"
          onClick={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="auth-switch">
          Wrong email?{" "}
          <span onClick={() => navigate("/forgot-password")}>
            Change email
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
