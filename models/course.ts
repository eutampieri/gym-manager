import { Identifiable } from ".";

interface CourseData {
    name: string,
    description: string,
    capacity: number,
    trainer: string,
}

export interface CreateCourseRequest extends CourseData {
    schedule: CourseScheduleEntry[],
}

export interface CourseScheduleEntry {
    dayOfWeek: string,
    startTime: string,
    participants: string[],
}

export interface CourseInfo extends CourseData, Identifiable { }
export interface Course extends CreateCourseRequest, Identifiable { }
