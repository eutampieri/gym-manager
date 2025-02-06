export enum EventType {
    Authenticate,
    ChatRequest,
    Error,
}


export type AuthenticateEvent = [EventType.Authenticate, string];
export type ChatRequestEvent = [EventType.ChatRequest, string];