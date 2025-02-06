export enum EventType {
    Authenticate,
    ChatRequest,
    Error,
    Message,
    AcceptChatRequest,
    ChatEstablished,
    MessageDelivery,
    CloseChat,
}


export type AuthenticateEvent = [EventType.Authenticate, string];
export type ChatRequestEvent = [EventType.ChatRequest, string];