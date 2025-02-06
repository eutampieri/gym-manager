export interface TrainerAvailabilities {
    [key: string]: DailyAvailability
};
interface DailyAvailability {
    [key: string]: boolean
}
