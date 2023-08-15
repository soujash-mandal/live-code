import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Attempt",
    timeout: 10000,
    transports: ["websocket"],
  };
  return io(process.env.PORT || process.env.REACT_APP_BACKEND_URL, options);
};
