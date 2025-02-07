import { Identifiable, Trainer, User } from ".";

interface SessionData {
    dayOfWeek: string,
    startTime: string,
}

export interface CreateSessionRequest extends SessionData {
    participant: string | User,
    trainer: string | Trainer,
}

export interface SessionInfo extends SessionData, Identifiable { }
export interface Session extends CreateSessionRequest, Identifiable { }