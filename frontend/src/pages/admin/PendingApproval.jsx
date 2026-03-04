import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./PendingApproval.css";
import { toast } from "react-toastify";

const PendingApproval = () => {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch pending approvals
  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        "/admin/attendance/pending"
      );

      // attach local checkbox state
      const formatted = res.data.approvals.map((item) => ({
        ...item,
        selected: {
          day: false,
          half: false,
          double: false,
          night: false,
        },
      }));

      setApprovals(formatted);
    } catch (error) {
      console.error("Pending fetch error", error);
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  // 🔹 Toggle checkbox
  const toggleOption = (attendanceId, field) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item._id === attendanceId
          ? {
              ...item,
              selected: {
                ...item.selected,
                [field]: !item.selected[field],
              },
            }
          : item
      )
    );
  };

  // 🔹 Approve attendance
  const approveAttendance = async (item) => {
    const { day, half, double, night } = item.selected;

    if (!day && !half && !double && !night) {
      alert("Please select at least one option");
      return;
    }

    try {
      await axiosInstance.put(
        `/admin/attendance/${item._id}`,
        {
          day,
          half,
          double,
          night,
        }
      );
      toast.success("Attendance approved successfully");

      // remove approved item from UI
      setApprovals((prev) =>
        prev.filter((a) => a._id !== item._id)
      );
    } catch (error) {
      console.error("Approval error", error);
      alert("Approval failed");
    }
  };

  return (
    <div className="pending-container">
      {/* HEADER */}
      <div className="pending-header">
        <h2>Pending Approvals</h2>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>Loading...</p>
      ) : approvals.length === 0 ? (
        <p className="empty-text">
          No pending approvals 🎉
        </p>
      ) : (
        approvals.map((item) => (
          <div className="approval-card" key={item._id}>
            {/* INFO */}
            <div className="approval-info">
              <h4>{item.userId?.name}</h4>
              <p className="email">
                {item.userId?.email}
              </p>

              <div className="meta">
                <span>
                  <strong>Date:</strong>{" "}
                  {item.date}
                </span>
                <span>
                  <strong>Check In:</strong>{" "}
                  {item.checkInTime || "-"}
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="approval-actions">
              <div className="approval-checkboxes">
                {["day", "half", "double", "night"].map(
                  (type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        checked={
                          item.selected[type]
                        }
                        onChange={() =>
                          toggleOption(
                            item._id,
                            type
                          )
                        }
                      />
                      <span>{type}</span>
                    </label>
                  )
                )}
              </div>

              <button
                className="approve-btn"
                onClick={() =>
                  approveAttendance(item)
                }
              >
                Approve Attendance
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingApproval;
