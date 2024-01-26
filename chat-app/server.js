const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'join.html'));
});

app.get('/chat', (req, res) => {
  const nickname = req.query.nickname || 'Anonymous';
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

io.on('connection', (socket) => {
  console.log('Новое подключение');

  socket.on('sendMessage', (data) => {
    const message = `${data.nickname}: ${data.message}`;
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Подключение разорвано');
  });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
