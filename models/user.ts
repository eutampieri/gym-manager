interface BasicInfo {
    username: String,
    firstName: String,
    lastName: String,
}
interface RichInfo extends BasicInfo {
    email: String,
    phoneNumber: String
}
interface CompleteInfo extends RichInfo {
    dateOfBirth: String
    fiscalCode: String
    address: String
}
export enum Role {
    Admin, Trainer, User
}
// User
export interface User extends CompleteInfo {
    id: String
}
export interface CreateUserRequest extends CompleteInfo {
    password: String
}
// Trainer
export interface Trainer extends RichInfo {
    id: String
}
export interface CreateTrainerRequest extends RichInfo {
    password: String
}
// Admin
export interface Admin extends BasicInfo {
    id: String
}
export interface CreateAdminRequest extends BasicInfo {
    password: String
}

export interface LoginRequest {
    username: string,
    password: string,
}