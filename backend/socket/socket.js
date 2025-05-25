// socket.js
import { Server } from "socket.io";

let users = [];

const addUser = (userData, socketId) => {
  !users.some(user => user.sub == userData.sub) && users.push({ ...userData, socketId });
};

const getUser = (userId) => {
  return users.find(user => user.sub === userId);
};

export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "https://whatsapp-clone-onbx.vercel.app/", 
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected!");

    socket.on("addUsers", userData => {
      addUser(userData, socket.id);
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", data => {
      const user = getUser(data.receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", data);
      }
    });
  });
}
