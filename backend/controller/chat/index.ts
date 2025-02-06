import { Server as NodeServer } from 'node:http';
import { Server } from 'socket.io';
import { ChatRequestEvent, EventType } from '@gym-manager/models/chat.js';
import { verifyJWT } from '../../utils.js';


export function createSocketIoServer(server: NodeServer) {
    console.log(verifyJWT)
    const io = new Server(server, {
        path: "/api/socketio/",
        serveClient: false,
    });
    io.on('connection', (socket) => {
        console.log("New connection");
        let userData = undefined;

        // Authentication
        socket.on(EventType.Authenticate.toString(), async (jwt) => {
            const token = (await verifyJWT(jwt)).payload as { error?: boolean };
            if (token.error === undefined) {
                userData = token;
            } else {
                socket.emit(EventType.Error.toString(), "Invalid token received");
            }
        });

        // 
    })
    return io;
}