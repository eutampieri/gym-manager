export interface CreateUserRequest {
    username: String
    password: String
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    dateOfBirth: String
    fiscalCode: String
    address: String
    id: String
}

export class ConcreteCreateUserRequest implements CreateUserRequest {
    username!: String
    password!: String
    firstName!: String
    lastName!: String
    email!: String
    phoneNumber!: String
    dateOfBirth!: String
    fiscalCode!: String
    address!: String
    id!: String
}
