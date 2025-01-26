const http = require('http');
const socketIO = require('socket.io');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Chat server is running\n');
});

// Attach Socket.IO to the server
const io = socketIO(server, {
  cors: {
    origin: "http://127.0.0.1:5501", // specify the front-end origin
    methods: ["GET", "POST"]
  }
});

// Users object to keep track of connected users
const users = {};

io.on('connection', socket => {
  console.log('New user connected:', socket.id);

  socket.on('new-user', name => {
    users[socket.id] = name;
    console.log(name + ' has joined the chat');
    socket.broadcast.emit('user-connected', name);
  });

  socket.on('send-chat-message', message => {
    console.log('Message received:', message);
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    console.log(users[socket.id] + ' has disconnected');
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

// Listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
