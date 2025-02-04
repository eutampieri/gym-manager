import { Identifiable } from ".";

interface SessionData {
    dayOfWeek: string,
    startTime: string,
}

export interface CreateSessionRequest extends SessionData {
    participant: string,
    trainer: string,
}

export interface SessionInfo extends SessionData, Identifiable { }
export interface Session extends CreateSessionRequest, Identifiable { }