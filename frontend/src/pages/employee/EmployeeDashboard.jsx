import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  markAttendance,
  getMonthlyAttendance,
} from "../../services/attendance.service";
import { toast } from "react-toastify";
import "./Employee.css";

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // 📅 Today date formatted
  const todayDate = new Date();
  const todayISO = todayDate.toISOString().split("T")[0]; // YYYY-MM-DD
  const month = todayDate.getMonth() + 1;
  const year = todayDate.getFullYear();

  const todayReadable = todayDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 🔹 Fetch today attendance from monthly data
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const monthlyData = await getMonthlyAttendance(month, year);

        const todayRecord = monthlyData.find(
          (item) => item.date === todayISO
        );

        setTodayAttendance(todayRecord || null);
      } catch (error) {
        setTodayAttendance(null);
      }
    };

    fetchTodayAttendance();
  }, [month, year, todayISO]);

  // 🔹 Mark attendance
  const handleMarkAttendance = async () => {
    try {
      setLoadingAttendance(true);

      await markAttendance();
      toast.success("Attendance marked successfully");

      // Refresh today status
      const monthlyData = await getMonthlyAttendance(month, year);
      const todayRecord = monthlyData.find(
        (item) => item.date === todayISO
      );

      setTodayAttendance(todayRecord || null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Attendance already marked"
      );
    } finally {
      setLoadingAttendance(false);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="emp-container">
      {/* HEADER */}
      <div className="emp-header">
        <div className="emp-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3>Welcome, {user?.name}</h3>
          <p>Standard Interior</p>
        </div>
      </div>

      {/* TODAY CARD */}
      <div className="emp-card">
        <h4>Today</h4>
        <p className="emp-date">{todayReadable}</p>

        <p
          className={`emp-status ${
            todayAttendance ? "marked" : "not-marked"
          }`}
        >
          {todayAttendance
            ? "Attendance Marked"
            : "Attendance Not Marked"}
        </p>

        {!todayAttendance && (
          <button
            className="primary-btn"
            onClick={handleMarkAttendance}
            disabled={loadingAttendance}
          >
            {loadingAttendance ? "Marking..." : "Mark Attendance"}
          </button>
        )}
      </div>

      {/* SUMMARY */}
      <div className="emp-summary">
        <div>
          <span>Status</span>
          <strong>
            {todayAttendance ? "Present" : "—"}
          </strong>
        </div>
        <div>
          <span>Approved</span>
          <strong>
            {todayAttendance
              ? todayAttendance.approvedByAdmin
                ? "Yes"
                : "Pending"
              : "—"}
          </strong>
        </div>
        <div>
          <span>Type</span>
          <strong>Day</strong>
        </div>
      </div>

      {/* ACTIONS */}
      <button
        className="secondary-btn"
        onClick={() => navigate("/employee/attendance")}
      >
        View Monthly Attendance
      </button>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default EmployeeDashboard;
