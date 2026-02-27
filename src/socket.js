import { io } from "socket.io-client";

// In production, socket server is on the same domain.
// In development, connect to localhost:5000.
const SOCKET_URL = import.meta.env.DEV
    ? "http://localhost:5000"
    : window.location.origin;

export const socket = io(SOCKET_URL, {
    autoConnect: false,
});

