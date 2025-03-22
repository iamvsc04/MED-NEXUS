const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectToDb = require('./Config/connectToDb');
const cors = require('cors');
const authRoutes = require("./Routes/apis/authRoutes");
const doctorRoutes = require("./Routes/apis/doctors/doctorsRoutes");
const patientRoutes = require('./Routes/apis/patients/makeAppointment');
const videoRoutes = require('./Routes/apis/videoRoutes'); // Adjust if needed

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

require('dotenv').config();
connectToDb();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/", authRoutes);
app.use("/", doctorRoutes);
app.use("/", patientRoutes);
app.use("/", videoRoutes);

app.get("/", (req, res) => {
  console.log(req.body);
  res.send("API is running");
});

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", (roomId, role) => {
    socket.join(roomId);
    console.log(`${role} joined room: ${roomId}`);
    socket.to(roomId).emit("user-connected", socket.id);
  });

  socket.on("offer", (offer, roomId) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate, roomId) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  socket.on("join-room", (roomId, role) => {
    socket.join(roomId);
    console.log(`${role} joined room: ${roomId}`);
    socket.to(roomId).emit("user-connected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
