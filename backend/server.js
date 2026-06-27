// backend/server.js
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// ✅ Database Connection (using the same pattern as debug server)
try {
  const { Connection } = await import('./DB/db.js');
  Connection();
} catch (error) {
  console.error("❌ Database connection error:", error.message);
}

app.use(morgan("dev"));
// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options('*', cors());

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes (using dynamic import like debug server)
try {
  const route = await import('./routes/route.js');
  app.use('/api', route.default);
  console.log("✅ Routes loaded successfully");
} catch (error) {
  console.error("❌ Routes loading error:", error.message);
}

// ✅ 404 handler - should be LAST
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.url,
    method: req.method
  });
});

// ✅ Error handling middleware - should be near the end
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
  }
});

// Socket logic
let users = [];

const addUser = (userData, socketId) => {
  const existingUser = users.find(user => user.sub === userData.sub);
  if (existingUser) {
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
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("addUsers", userData => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
    console.log(`👤 User added: ${userData.name}, Total: ${users.length}`);
  });

  socket.on("sendMessage", data => {
    const user = getUser(data.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", data);
      console.log(`📨 Message sent to: ${data.receiverId}`);
    } else {
      console.log(`❌ User not found: ${data.receiverId}`);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
    console.log(`❌ User disconnected: ${socket.id}, Remaining: ${users.length}`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`\n🚀 Server is running on PORT: ${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   ✅ Health: http://localhost:${PORT}/api/health`);
  console.log(`   ✅ Users: http://localhost:${PORT}/api/getUsers`);
  console.log(`   ✅ Add User: POST http://localhost:${PORT}/api/add`);
  console.log(`\n⚡ Socket.io running on: ws://localhost:${PORT}\n`);
});