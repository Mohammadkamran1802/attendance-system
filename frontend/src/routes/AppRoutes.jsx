import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import PendingApproval from "../pages/admin/PendingApproval";
import AdminMonthlyAttendance from "../pages/admin/AdminMonthlyAttendance";
import ProtectedRoute from "../components/ProtectedRoute";
import MonthlyAttendance from "../pages/employee/MonthlyAttendance";
import { useAuth } from "../context/authContext";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";
const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <BrowserRouter>
            <Routes>

                {/* Default */}
                <Route
                    path="/"
                    element={
                        user
                            ? <Navigate to={user.role === "admin" ? "/admin" : "/employee"} />
                            : <Navigate to="/login" />
                    }
                />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />



                {/* Admin */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/pending"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <PendingApproval />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/monthly"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminMonthlyAttendance />
                        </ProtectedRoute>
                    }
                />

                {/* Employee */}
                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute allowedRole="employee">
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/employee/attendance"
                    element={
                        <ProtectedRoute allowedRole="employee">
                            <MonthlyAttendance />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
