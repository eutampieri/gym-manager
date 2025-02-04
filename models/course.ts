import { Identifiable } from ".";

export interface CreateCourseRequest {
    name: string,
    description: string,
    capacity: number,
    trainer: string,
    schedule: CourseScheduleEntry[],
}

export interface CourseScheduleEntry {
    dayOfWeek: string,
    startTime: string,
    participants: string[],
}

export interface Course extends CreateCourseRequest, Identifiable { }
