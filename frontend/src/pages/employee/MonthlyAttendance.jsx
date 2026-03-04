import { useEffect, useState } from "react";
import { getMonthlyAttendance } from "../../services/attendance.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./MonthlyAttendance.css";

const ITEMS_PER_PAGE = 10;

const MonthlyAttendance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // UI vs PDF helpers
  const uiMark = (v) => (v ? "✔" : "-");
  const pdfMark = (v) => (v ? "Yes" : "-");

  // 🔹 FETCH
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await getMonthlyAttendance(month, year);
      setAttendance(data);
      setCurrentPage(1);
    } catch {
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  // 🔹 PAGINATION
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

  const summary = calculateSummary();
  const totalDays =
    summary.day + summary.half * 0.5 + summary.double * 2;

  // 🔹 PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("STANDARD INTERIOR EMPLOYEE ATTENDANCE", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(
      `Employee: ${user?.name.toUpperCase()} - ${user?.email}`,
      14,
      30
    );
    doc.text(
      `Month: ${new Date(0, month - 1).toLocaleString("en", {
        month: "long",
      })} ${year}`,
      14,
      38
    );

    const tableColumns = [
      "Date",
      "Present",
      "Day",
      "Half",
      "Double",
      "Night",
      "Approved",
      "Check In",
      "Approved By",
    ];

    const tableRows = attendance.map((item) => [
      item.date,
      item.presentMarked ? "Yes" : "-",
      pdfMark(item.day),
      pdfMark(item.half),
      pdfMark(item.double),
      pdfMark(item.night),
      item.approvedByAdmin ? "Yes" : "Pending",
      item.checkInTime || "-",
      item.approvedBy?.name || "-",
    ]);

    autoTable(doc, {
      startY: 45,
      head: [tableColumns],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 9, halign: "center" },
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
      },
    });

    // 🔹 SUMMARY IN PDF
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text("Summary", 14, finalY);

    doc.setFontSize(10);
    doc.text(`Total Attendance: ${totalDays}`, 14, finalY + 8);
    doc.text(`Day: ${summary.day}`, 14, finalY + 16);
    doc.text(`Half: ${summary.half}`, 14, finalY + 22);
    doc.text(`Double: ${summary.double}`, 14, finalY + 28);
    doc.text(`Night: ${summary.night}`, 14, finalY + 34);

    doc.save(`Attendance_${user?.name}_${month}_${year}.pdf`);
  };

  return (
    <div className="ma-container">
      {/* HEADER */}
      <div className="ma-header">
        <h3>Monthly Attendance</h3>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>

      {/* FILTER */}
      <div className="ma-filter">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("en", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[year, year - 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* SUMMARY UI */}
      {attendance.length > 0 && (
        <div className="summary-card">
          <strong>Total Attendance: {totalDays}</strong>
          <p>
            <span>Day: {summary.day}</span>
            <span>Half: {summary.half}</span>
            <span>Double: {summary.double}</span>
            <span>Night: {summary.night}</span>
          </p>
        </div>

      )}

      {/* DOWNLOAD */}
      <button
        className="download-btn"
        onClick={handleDownloadPDF}
        disabled={attendance.length === 0}
      >
        Download PDF
      </button>

      {/* TABLE */}
      {loading ? (
        <p className="ma-loading">Loading...</p>
      ) : attendance.length === 0 ? (
        <p className="ma-empty">No attendance found</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="ma-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Present</th>
                  <th>Day</th>
                  <th>Half</th>
                  <th>Double</th>
                  <th>Night</th>
                  <th>Approved</th>
                  <th>Check In</th>
                  <th>Approved By</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.date}</td>
                    <td>{item.presentMarked ? "Yes" : "-"}</td>
                    <td>{uiMark(item.day)}</td>
                    <td>{uiMark(item.half)}</td>
                    <td>{uiMark(item.double)}</td>
                    <td>{uiMark(item.night)}</td>
                    <td>
                      {item.approvedByAdmin ? "Yes" : "Pending"}
                    </td>
                    <td>{item.checkInTime || "-"}</td>
                    <td>{item.approvedBy?.name || "-"}</td>
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
        </>
      )}
    </div>
  );
};

export default MonthlyAttendance;
