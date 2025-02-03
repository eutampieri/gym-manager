import { Identifiable } from ".";

export interface CreateCourseRequest {
    name: string,
    description: string,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    capacity: number,
    trainer: string,
    participants: string[]

}

export interface Course extends CreateCourseRequest, Identifiable { }
