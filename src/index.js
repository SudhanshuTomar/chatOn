const path = require('path');
const http = require('http');
const express = require('express');
//we need to pass raw http server to socketio so we can use it
//so we need to create a server outside of express 
//as express does it behind the scenes and we dont have access to it
const socketio = require('socket.io');

const app = express();
const Server = http.createServer(app);
const io = socketio(Server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection',(socket)=>{
    console.log('New WebSocket connection');
})




server.listen(port,(req,res)=>{
    console.log('Server is up on port '+port);
})