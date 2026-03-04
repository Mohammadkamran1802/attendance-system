import axiosInstance from "../utils/axiosInstance";
export const getMyProfile = async()=> {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
}