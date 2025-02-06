import { Server as NodeServer } from 'node:http';
import { Server } from 'socket.io';
import { EventType } from '@gym-manager/models/chat.js';
import { verifyJWT } from '../../utils.js';
import { ulid } from 'ulidx';

const ROOMS = {
    admin: "admin"
}

const ACCEPTED_CHATS = new Set<string>();

export function createSocketIoServer(server: NodeServer) {
    console.log(verifyJWT)
    const io = new Server(server, {
        path: "/api/socketio/",
        serveClient: false,
    });
    io.on('connection', (socket) => {
        console.log("New connection");
        let userData: any | undefined = undefined;

        // Authentication
        socket.on(EventType.Authenticate.toString(), async (jwt) => {
            const token = (await verifyJWT(jwt)).payload as { error?: boolean };
            if (token.error === undefined) {
                userData = token;
                if ((userData as any).role === "admin") {
                    console.log("New admin joined");
                    socket.join(ROOMS.admin);
                }
            } else {
                socket.emit(EventType.Error.toString(), "Invalid token received");
            }
        });

        // Chat request
        socket.on(EventType.ChatRequest.toString(), () => {
            if (userData !== undefined) {
                const roomID = ulid();
                socket.join(roomID);
                io.to(ROOMS.admin).emit(EventType.ChatRequest.toString(), { user: userData.profile, kind: userData.role, room: roomID });
            }
        });

        // Accept chat request
        socket.on(EventType.AcceptChatRequest.toString(), (room) => {
            if (userData !== undefined && (userData as any).role === "admin") {
                if (ACCEPTED_CHATS.has(room)) {
                    socket.emit(EventType.Error.toString(), "The chat was already taken.");
                } else {
                    socket.join(room);
                    io.to(room).emit(EventType.ChatEstablished.toString(), room);
                }
            }
        });

        // Handle messages
        socket.on(EventType.Message.toString(), ({ message, room }) => {
            if (userData !== undefined) {
                io.to(room).emit(EventType.MessageDelivery.toString(), { message, sender: userData.profile.id });
            }
        });

    })
    return io;
}