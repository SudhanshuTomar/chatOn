const path = require('path');
const http = require('http');
const express = require('express');
//we need to pass raw http server to socketio so we can use it
//so we need to create a server outside of express 
//as express does it behind the scenes and we dont have access to it
const socketio = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/messages');
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection',(socket)=>{
    console.log('New WebSocket connection');

    socket.on('join',({username,room},callback)=>{
        const {error,user} = addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message',generateMessage('Admin','Welcome!'));
    
    socket.broadcast.to(user.room).emit('message',generateMessage("Admin",`${user.username} has joined!`));
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
    callback()

    })

    socket.on('sendMessage',(message, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,message));
        callback();
    })
    socket.on('sendLocation',(coords, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(user.username,`${user.username} has left!`));
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})