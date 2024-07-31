import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session Expired, login again");
      handleLogout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
