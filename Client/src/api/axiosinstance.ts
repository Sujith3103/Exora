import axios from "axios";
import { toast } from "sonner";

const server = axios.create({
  // baseURL: "http://localhost:8800/api",
  // baseURL: "http://localhost:3000/api",
  baseURL:"https://exora-giu2.onrender.com/api",
});

server.interceptors.request.use(config => {
  const accessToken = sessionStorage.getItem("token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    // console.log("Access Token set in request headers:", accessToken);
  }

  return config;
}, (err) => Promise.reject(err));


server.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 429) {
      const retryAfter = error.response?.headers["retry-after"];

      toast.error(
        retryAfter
          ? `Too many requests. Try again in ${retryAfter}s`
          : "Too many requests. Slow down.", { style: { justifyContent: "center" } }
      );
    } else if (status === 401) {
      toast.error("Session expired. Please login again.", { style: { justifyContent: "center" }, duration: 1500 });
      sessionStorage.removeItem("token");
      window.location.href = "/auth/login"; // optional redirect
    } else if (status >= 500) {
      toast.error("Server error. Try again later.",{ style: { justifyContent: "center" }, duration: 1500 });
    } else {
      toast.error(error.response?.data?.message || "Something went wrong", { style: { justifyContent: "center" }, duration: 1500 });
    }

    return Promise.reject(error);
  }
);

export default server;