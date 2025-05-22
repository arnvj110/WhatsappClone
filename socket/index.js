
import { Server } from 'socket.io';

let users = [];

const addUser = (userData, socketId) => {
  !users.some(user => user.sub == userData.sub) && users.push({ ...userData, socketId });
}

const getUser = (userId) => {
  return users.find(user => user.sub === userId);
}

const io = new Server(9000, {
  cors: {
    origin: "http://localhost:5173", 
    
  }
});

io.on("connection", (socket) => {
  console.log("User connected!");

  socket.on("addUsers", userData => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  })

  socket.on("sendMessage", data => {
    const user = getUser(data.receiverId);
    io.to(user.socketId).emit("getMessage", data);
  })
});


