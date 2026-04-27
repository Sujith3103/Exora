// src/socket.js
import { io } from "socket.io-client";

// If backend is running locally:
// const URL = "http://localhost:3000";  
const URL = "https://exora-giu2.onrender.com";  

// If deployed, replace with your backend URL
// e.g., "https://api.myapp.com"

export const socket = io(URL, {
  autoConnect:false,
  withCredentials: true, // allows cookies if you use them
  transports: ["websocket"], // force websocket
//   auth: {
//     token: localStorage.getItem("token") // send JWT if required
//   }
});
