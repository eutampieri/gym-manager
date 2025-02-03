import { Identifiable } from ".";

export interface CreateCourseRequest {
    name: string
    description: string
    schedule: {
        dayOfWeek: string;
        startTime: string; 
        availableSpots: number;       
    }[];
    capacity: number
    trainer: string
}


export interface Course extends CreateCourseRequest, Identifiable { }
