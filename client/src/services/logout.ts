import api from "@/services/axios"; 
import toast from "react-hot-toast";

const handleLogout = async () => {
  try {
    const res = await api.post<{message:string}>("/user/log-out");
    toast.success(res.data?.message || "Logged out");
    // optional: redirect to login
    window.location.href = "/login";
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Logout failed");
  }
};

export default handleLogout;