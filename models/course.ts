import { Identifiable } from ".";

export interface CreateCourseRequest {
    name: string,
    description: string,
    schedule: {
        participants: string[]
        dayOfWeek: string,
        startTime: string,
    }[],
    capacity: number,
    trainer: string,
}

export interface Course extends CreateCourseRequest, Identifiable { }
