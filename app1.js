const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const path = require('path');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(router);

app.use(express.static(path.join(__dirname, './template')));

io.on('connect', (socket) => {
  console.log("new connection")
  socket.on('join', ({ name, room }, callback) => {
    console.log({ name, room })
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('sendimage', (imageurl, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('image', { user: user.name, imageurl: imageurl });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  })
});

server.listen(process.env.PORT || 5000, "192.168.1.19", () => console.log(`Server has started.`));