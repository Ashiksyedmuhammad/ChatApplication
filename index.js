const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
let socketConnected = new Set()

const server = app.listen(PORT, () =>
  console.log(`💬 Server On Port ${PORT}`)
);

const io = require('socket.io')(server);

io.on('connection', onConnected)

function onConnected(socket){
    console.log("Client connected:", socket.id);  
    socketConnected.add(socket.id);

    io.emit('clients-total',socketConnected.size)

    socket.on('disconnect',() =>{
        console.log("Socket Disconnected",socket.id);
        socketConnected.delete(socket.id);

        io.emit('clients-total',socketConnected.size)
    });

    socket.on('message',(data)=>{
        socket.broadcast.emit('chat-message',data)
    });

    socket.on('feedback',(data) =>{
        socket.broadcast.emit('feedback',data)
    })
}
