import express from 'express';
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'


const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server,
  {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    }
  }
);

const users = {};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("New client connected : ", socket.id, "UserId : ", userId);

  if(userId){
    users[userId] = socket.id;
  }

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
  });

  socket.on('call-ended', () => {
    const roomId = socket.roomId;
    socket.to(roomId).emit('call-ended');
  });


  socket.on('disconnect', () => {
    console.log("User Disconnected : ", socket.id);
    for(let id in users){
      if(users[id] === socket.id){
        delete users[id]
        console.log("User Removed : ", id);
        break;
      }
    }
  });


});



export {app, io, server};






























