export interface CreateCourseRequest {
    name: String
    description: String
    schedule: {
        dayOfWeek: string;
        startTime: string;        
    }[];
    capacity: String
    trainer: String
}
