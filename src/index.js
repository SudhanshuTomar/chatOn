const path = require('path');
const http = require('http');
const express = require('express');
//we need to pass raw http server to socketio so we can use it
//so we need to create a server outside of express 
//as express does it behind the scenes and we dont have access to it
const socketio = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/messages');


const app = express();
const Server = http.createServer(app);
const io = socketio(Server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection',(socket)=>{
    console.log('New WebSocket connection');
    
    socket.emit('message',generateMessage('Welcome!'));
    
    socket.broadcast.emit('message',generateMessage('A new user has joined!'));
    
    socket.on('sendMessage',(message)=>{
        io.emit('message',generateMessage(message));
    })
    socket.on('sendLocation',(coords)=>{
        io.emit('message',generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
    })

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user has left!'));
    }
    )
})




server.listen(port,(req,res)=>{
    console.log('Server is up on port '+port);
})