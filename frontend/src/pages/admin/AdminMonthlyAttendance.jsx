import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axiosInstance from "../../utils/axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./AdminMonthlyAttendance.css";

const ITEMS_PER_PAGE = 10;

const AdminMonthlyAttendance = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [monthYear, setMonthYear] = useState(
    `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`
  );

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // helpers
  const uiMark = (v) => (v ? "✔" : "-");
  const pdfMark = (v) => (v ? "Yes" : "-");

  // 🔹 Load employees
  useEffect(() => {
    axiosInstance.get("/admin/employees").then((res) => {
      setEmployees(res.data.employees);
    });
  }, []);

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: `${emp.name} (${emp.email})`,
  }));

  // 🔹 Fetch attendance
  const fetchAttendance = async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/admin/attendance/monthly?employeeId=${employeeId}&month=${month}&year=${year}`
      );

      setAttendance(res.data.attendance);
      setEmployee(res.data.employee);
      setCurrentPage(1);
    } catch {
      setAttendance([]);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  // pagination
  const totalPages = Math.ceil(attendance.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = attendance.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // 🔹 SUMMARY CALCULATION
  const calculateSummary = () => {
    return attendance.reduce(
      (acc, a) => {
        if (a.day) acc.day += 1;
        if (a.half) acc.half += 1;
        if (a.double) acc.double += 1;
        if (a.night) acc.night += 1;
        return acc;
      },
      { day: 0, half: 0, double: 0, night: 0 }
    );
  };

  const calculateTotalDays = (summary) =>
    summary.day + summary.half * 0.5 + summary.double * 2;

  // 🔹 PDF DOWNLOAD
  const downloadPDF = () => {
    const doc = new jsPDF();

    // HEADER
    doc.setFontSize(18);
    doc.text("STANDARD INTERIOR EMPLOYEE ATTENDANCE ", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(
      `Employee: ${employee.name} - (${employee.email})`,
      14,
      28
    );
    doc.text(
      `Month: ${new Date(0, month - 1).toLocaleString("en", {
        month: "long",
      })} ${year}`,
      14,
      36
    );

    const columns = [
      "Date",
      "Day",
      "Half",
      "Double",
      "Night",
      "Approved",
      "Approved By",
    ];

    const rows = attendance.map((a) => [
      a.date,
      pdfMark(a.day),
      pdfMark(a.half),
      pdfMark(a.double),
      pdfMark(a.night),
      a.approvedByAdmin ? "Yes" : "No",
      a.approvedBy?.name || "-",
    ]);

    autoTable(doc, {
      startY: 45,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: { fontSize: 9, halign: "center" },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
      },
    });

    // SUMMARY
    const summary = calculateSummary();
    const totalDays = calculateTotalDays(summary);
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text("Summary", 14, finalY);

    doc.setFontSize(10);
    doc.text(`Total Working Days: ${totalDays}`, 14, finalY + 8);
    doc.text(`Day: ${summary.day}`, 14, finalY + 16);
    doc.text(`Half: ${summary.half}`, 14, finalY + 22);
    doc.text(`Double: ${summary.double}`, 14, finalY + 28);
    doc.text(`Night: ${summary.night}`, 14, finalY + 34);

    doc.save(`${employee.name}_${month}_${year}_attendance.pdf`);
  };

  return (
    <div className="monthly-container">
      {/* HEADER */}
      <div className="page-header">
        <h2>Monthly Attendance</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <Select
          options={employeeOptions}
          placeholder="Select employee"
          onChange={(opt) => setEmployeeId(opt.value)}
          className="employee-select"
          classNamePrefix="rs"
        />

        <input
          type="month"
          value={monthYear}
          onChange={(e) => {
            setMonthYear(e.target.value);
            const [y, m] = e.target.value.split("-");
            setYear(Number(y));
            setMonth(Number(m));
          }}
        />

        <button onClick={fetchAttendance}>View</button>
      </div>


      {/* CONTENT */}
      {loading ? (
        <p>Loading...</p>
      ) : attendance.length === 0 ? (
        <p>No attendance found</p>
      ) : (
        <>

          <div className="table-wrapper">
            <table className="monthly-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Half</th>
                  <th>Double</th>
                  <th>Night</th>
                  <th>Approved</th>
                  <th>Approved By</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((a) => (
                  <tr key={a._id}>
                    <td>{a.date}</td>
                    <td>{uiMark(a.day)}</td>
                    <td>{uiMark(a.half)}</td>
                    <td>{uiMark(a.double)}</td>
                    <td>{uiMark(a.night)}</td>
                    <td>{a.approvedByAdmin ? "Yes" : "No"}</td>
                    <td>{a.approvedBy?.name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
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

          <button className="download-btn" onClick={downloadPDF}>
            Download PDF
          </button>
        </>
      )}
    </div>
  );
};

export default AdminMonthlyAttendance;
