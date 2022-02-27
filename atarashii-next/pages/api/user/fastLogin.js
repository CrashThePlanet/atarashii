import { Server } from 'socket.io'

import jwt from 'jsonwebtoken'

import { jwtSecret } from "./../../../config/index";

const SocketHandler = (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io
        res.socket.server.io.on('connection', socket => {
            socket.on('checkID', data => {
                if(io.sockets.adapter.rooms[data.id]) {
                    socket.emit('answerID', {result: false})
                } else {
                    socket.join(data.id);
                    socket.emit('answerID', {result: true})
                }
            });
            socket.on('joinRoom', data => {
                if (io.sockets.adapter.rooms.get(data.id)) {
                    socket.join(data.id);
                    socket.emit('connectSuccessfull');
                } else {
                    socket.emit('roomNotFound');
                }
            });
            socket.on('emitToken', data => {
                jwt.verify(data.token, jwtSecret, (err, decoded) => {
                    if (err) {
                        socket.emit('invalidToken')
                    } else {
                        socket.to(data.room).emit('token', {token: data.token})
                    }
                });
            });
            socket.on('closeRoom', data => {
                socket.broadcast.emit('closeRoom');
                io.in(data.room).socketsLeave(data.room);
            });
        });
    }
    res.end()
}

export default SocketHandler