require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require('./database/db');
const userRoute = require('./routes/user_route');
const taskRoute = require('./routes/task_route');
const challengeRoute = require('./routes/challenge_route');
const { Server } = require("socket.io");
const http = require("http");
const dashboardRoute = require('./routes/dashboard_route');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for API requests
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

const io = new Server(server, {
  cors: corsOptions, // ✅ same options for Socket.IO
});

app.set("io", io);
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

connectToDB();

app.use('/api/auth', userRoute);
app.use('/api/task', taskRoute);
app.use('/api/challenge', challengeRoute);
app.use('/api/dashboard', dashboardRoute);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
