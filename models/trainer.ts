interface BaseTrainer {
    username: String
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
}


export interface CreateTrainerRequest extends BaseTrainer {
    password: String
}