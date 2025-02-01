import sha256 from "sha256";

interface BasicInfo {
    username: string,
    firstName: string,
    lastName: string,
}
interface RichInfo extends BasicInfo {
    email: string,
    phoneNumber: string
}
interface CompleteInfo extends RichInfo {
    dateOfBirth: string
    fiscalCode: string
    address: string
}
function computeProfileIconLink(username?: string) {
    const hash = sha256(username || 'default');
    return 'https://gravatar.com/avatar/' + hash + '?d=identicon';
}
export function getProfileIcon(user: BasicInfo | RichInfo): string {
    return computeProfileIconLink(('email' in user) ? user.email : user.username);
}
export enum Role {
    Admin, Trainer, User
}
// User
export interface User extends CompleteInfo {
    id: string
}
export interface CreateUserRequest extends CompleteInfo {
    password: string
}
// Trainer
export interface Trainer extends RichInfo {
    id: string
}
export interface CreateTrainerRequest extends RichInfo {
    password: string
}
// Admin
export interface Admin extends BasicInfo {
    id: string
}
export interface CreateAdminRequest extends BasicInfo {
    password: string
}