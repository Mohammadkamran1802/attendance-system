import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import "./Admin.css";

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [presentEmployees, setPresentEmployees] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 CREATE ADMIN MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // 🔹 Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const empRes = await axiosInstance.get("/admin/employees");
      setTotalEmployees(empRes.data.totalEmployees);

      const pendingRes = await axiosInstance.get(
        "/admin/attendance/pending"
      );
      setPendingCount(pendingRes.data.totalPending);
    } catch (error) {
      console.error("Stats error", error);
    }
  };

  // 🔹 Fetch present employees
  const fetchPresentEmployees = async () => {
    try {
      const res = await axiosInstance.get(
        `/admin/attendance/by-date?date=${date}`
      );
      setPresentEmployees(res.data.employees);
      setCurrentPage(1);
    } catch {
      setPresentEmployees([]);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPresentEmployees();
  }, [date]);

  // pagination
  const totalPages = Math.ceil(
    presentEmployees.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = presentEmployees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔹 CREATE ADMIN HANDLER
  const handleCreateAdmin = async () => {
    if (!adminName || !adminEmail || !adminPassword) {
      toast.error("All fields are required");
      return;
    }

    try {
      setCreating(true);

      await axiosInstance.post("/admin/create-admin", {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
      });

      toast.success("Admin created successfully");
      setShowModal(false);
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="admin-container">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h2>Standard Interior</h2>
          <p>Welcome, {user?.name}</p>
        </div>
        <div>
          <button
            className="admin-create-btn"
            onClick={() => setShowModal(true)}
          >
             Admin
          </button>
        </div>

        <div >
          <button className="logout-btn small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        <div className="stat-card">
          <h3>{totalEmployees}</h3>
          <p>Total Employees</p>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => navigate("/admin/pending")}
        >
          <h3>{pendingCount}</h3>
          <p>Pending Approvals</p>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => navigate("/admin/monthly")}
        >
          <h3>View</h3>
          <p>Monthly Attendance</p>
        </div>
      </div>

      {/* PRESENT EMPLOYEES */}
      <div className="admin-card">
        <div className="present-header">
          <h3>Present Employees</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {currentData.length === 0 ? (
          <p>No employees present</p>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Check In</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.checkInTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* CREATE ADMIN MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Create Admin</h3>

            <input
              placeholder="Name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />

            <input
              placeholder="Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleCreateAdmin} disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </button>
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
