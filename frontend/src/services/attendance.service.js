import axiosInstance from "../utils/axiosInstance";

export const markAttendance = async () => {
  const res = await axiosInstance.post("/attendance/mark-present");
  return res.data;
};

export const getMonthlyAttendance = async (month, year) => {
  const res = await axiosInstance.get(
    `/attendance/my-monthly?month=${month}&year=${year}`
  );
  return res.data.attendance; // assuming backend sends { attendance: [] }
};
