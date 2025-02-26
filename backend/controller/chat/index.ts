import { Server as NodeServer } from 'node:http';
import { Server } from 'socket.io';
import { EventType, SubscriptionEntity } from '@gym-manager/models/chat.js';
import { verifyJWT } from '../../utils.js';
import { ulid } from 'ulidx';
import { parseRole, Role } from '@gym-manager/models/role.js';

const ROOMS = {
    admin: "admin"
}

const ACCEPTED_CHATS = new Set<string>();

let availableAdmins = 0;

export function createSocketIoServer(server: NodeServer) {
    const io = new Server(server, {
        path: "/api/socketio/",
        serveClient: false,
    });
    io.on('connection', (socket) => {
        console.log("New connection");
        let userData: any | undefined = undefined;
        let roomID: string | undefined;

        // Authentication
        socket.on(EventType.Authenticate.toString(), async (jwt) => {
            const token = (await verifyJWT(jwt)).payload as { error?: boolean };
            if (token.error === undefined) {
                userData = token;
                if (parseRole((userData as any).role) === Role.Admin) {
                    socket.join(ROOMS.admin);
                    availableAdmins += 1;
                    socket.on('disconnect', () => availableAdmins -= 1)
                }
            } else {
                socket.emit(EventType.Error.toString(), "Invalid token received");
            }
        });

        // Chat request
        socket.on(EventType.ChatRequest.toString(), () => {
            if (userData !== undefined) {
                if (availableAdmins > 0) {
                    roomID = ulid();
                    socket.join(roomID);
                    io.to(ROOMS.admin).emit(EventType.ChatRequest.toString(), { user: userData.profile, kind: userData.role, room: roomID });
                } else {
                    setTimeout(() => {
                        socket.emit(EventType.Error.toString(), "Support is not available now, please try again later.")
                    }, 3000);
                }
            }
        });

        // Accept chat request
        socket.on(EventType.AcceptChatRequest.toString(), (room) => {
            if (userData !== undefined && parseRole((userData as any).role) === Role.Admin) {
                if (ACCEPTED_CHATS.has(room)) {
                    socket.emit(EventType.Error.toString(), "The chat was already taken.");
                } else {
                    roomID = room;
                    socket.join(room);
                    io.to(room).emit(EventType.ChatEstablished.toString());
                    availableAdmins -= 1;
                }
            }
        });

        // Handle messages
        socket.on(EventType.Message.toString(), ({ message }) => {
            if (userData !== undefined) {
                io.to(roomID!).emit(EventType.MessageDelivery.toString(), { message, sender: userData.profile._id });
            }
        });

        // Handle leave
        socket.on(EventType.CloseChat.toString(), () => {
            if (userData !== undefined) {
                io.to(roomID!).emit(EventType.CloseChat.toString(), userData.profile._id);
                ACCEPTED_CHATS.delete(roomID!);
            }
        });
        socket.on(EventType.LeaveRoom.toString(), () => {
            if (userData !== undefined) {
                if (parseRole(userData.role) === Role.Admin) {
                    availableAdmins += 1;
                }
                socket.leave(roomID!);
                roomID = undefined;
            }
        });

        //Backend-initiated push subscriptions
        socket.on(EventType.Subscribe.toString(), async (data: { token: string, entity: SubscriptionEntity }) => {
            const token = (await verifyJWT(data.token)).payload as { error?: boolean };
            if (token.error === undefined) {
                socket.join(data.entity.toString());
            }
        });

    })
    return io;
}
