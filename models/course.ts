export interface CourseModel {
    name: string
    description: string
    schedule: {
        dayOfWeek: string;
        startTime: string;        
    }[];
    capacity: string
    trainer: string
}
