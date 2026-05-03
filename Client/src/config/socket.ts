import { io } from "socket.io-client";

// const URL = "http://localhost:3000";  
const URL = "https://exora-giu2.onrender.com";  

export const socket = io(URL, {
  autoConnect:false,
  withCredentials: true, // allows cookies if you use them
  transports: ["websocket"], // force websocket
//   auth: {
//     token: localStorage.getItem("token") // send JWT if required
//   }
});
