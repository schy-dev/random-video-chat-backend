
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

db.sequelize.sync();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', ({ roomId, gender }) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room: ${roomId} with gender preference: ${gender}`);
  });

  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ice-candidate', (payload) => {
    io.to(payload.target).emit('ice-candidate', payload);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
