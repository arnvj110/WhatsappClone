import express from 'express';
import { createServer } from 'http';
import { Connection } from './DB/db.js';
import route from './routes/route.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Database Connection
Connection();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://whatsapp-clone-onbx.vercel.app"],
  methods: ["GET", "POST"]
}));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Routes
app.use('/api', route);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://whatsapp-clone-onbx.vercel.app"],
    methods: ["GET", "POST"]
  }
});

// Socket logic
let users = [];

const addUser = (userData, socketId) => {
  const existingUser = users.find(user => user.sub === userData.sub);
  if (existingUser) {
    // Update existing user's socket ID
    existingUser.socketId = socketId;
    return;
  }
  users.push({ ...userData, socketId });
};

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find(user => user.sub === userId);
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  console.log(`Total users: ${users.length}`);

  socket.on("addUsers", userData => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
    console.log(`User added: ${userData.name}, Total: ${users.length}`);
  });

  socket.on("sendMessage", data => {
    const user = getUser(data.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", data);
      console.log(`Message sent to: ${data.receiverId}`);
    } else {
      console.log(`User not found: ${data.receiverId}`);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
    console.log(`User disconnected: ${socket.id}, Remaining: ${users.length}`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});