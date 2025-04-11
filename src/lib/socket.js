import {Server} from 'socket.io';
import {createServer as httpsServer} from 'https';
import {createServer as httpServer} from 'http';
import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
let server;
if (process.env.node_env === 'production'){
    const sslOptions = {
        key: fs.readFileSync(path.resolve(import.meta.dirname,'key.pem')),  // Or 'server.key'
        cert: fs.readFileSync(path.resolve(import.meta.dirname,'cert.pem')) // Or 'server.cert'
    };
     server =httpsServer(sslOptions,app);
    
} else {
     server =httpServer(app);

    
}

const io =new Server(server,{
    cors:{
        origin:process.env.node_env ==="production" ? process.env.client_url : "http://localhost:5173",
    },
    })
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//store online users
const userSocketMap = {}; // {userId:socketId}

io.on('connection',(socket)=>{
    console.log('A User connected',socket.id);

    const userId = socket.handshake.query.userId;

    if (userId){
        userSocketMap[userId] = socket.id;
    }
    //send events to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        console.log('A User disconnected',socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export  {io,server,app};