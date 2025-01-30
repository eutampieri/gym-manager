interface BaseUser {
    username: String
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    dateOfBirth: String
    fiscalCode: String
    address: String
}

export interface User extends BaseUser {
    id: String
}
export interface CreateUserRequest extends BaseUser {
    password: String
}
