import { Server as NodeServer } from 'node:http';
import { Server } from 'socket.io';
import { ChatRequestEvent, EventTypes } from '@gym-manager/models/chat.js';
import { verifyJWT } from '../../utils.js';

export function createSocketIoServer(server: NodeServer) {
    console.log(verifyJWT)
    const io = new Server(server, {
        path: "/api/socketio/",
        allowRequest: (req, fn) => {
            const auth = req.headers.authorization;
            if (auth === undefined) {
                fn("Unauthorized", false);
            } else {
                const token = verifyJWT(auth.split(' ')[1])
            }
        },
    });
    io.on('connection', (socket) => {
        const userData = undefined;
        socket.on(EventTypes.Authenticate.toString(), (jwt) => {

        });
    })
    return io;
}