interface BaseTrainer {
    username: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
}


export interface CreateTrainerRequest extends BaseTrainer {
    password: string
}