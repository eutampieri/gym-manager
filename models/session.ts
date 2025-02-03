import { Identifiable } from ".";

export interface CreateSessionRequest {
    participant: string,
    dayOfWeek: string,
    startTime: string,
    trainer: string,
}

export interface Session extends CreateSessionRequest, Identifiable { }