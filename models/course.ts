export interface CourseModel {
    name: String
    description: String
    schedule: {
        dayOfWeek: string;
        startTime: string;        
    }[];
    capacity: String
    trainer: String
}
