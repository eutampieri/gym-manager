export enum EventTypes {
    Authenticate,
    ChatRequest,
}


export type AuthenticateEvent = [EventTypes.Authenticate, string];
export type ChatRequestEvent = [EventTypes.ChatRequest, string];