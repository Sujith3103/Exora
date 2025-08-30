import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:8800/api",
  // baseURL:"https://exora-giu2.onrender.com/api",
});

server.interceptors.request.use(config => {
  const accessToken = sessionStorage.getItem("token");
  
  if(accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    // console.log("Access Token set in request headers:", accessToken);
  }

  return config;
},(err) => Promise.reject(err));

export default server;