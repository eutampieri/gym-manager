import sha256 from "sha256";
import { Identifiable } from ".";

export interface BasicInfo {
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
// User
export interface User extends CompleteInfo, Identifiable { }

export interface CreateUserRequest extends CompleteInfo {
    password: string
}
// Trainer
export interface Trainer extends RichInfo, Identifiable { }

export interface CreateTrainerRequest extends RichInfo {
    password: string
}
// Admin
interface BaseAdmin extends BasicInfo {
    hasFullPrivileges: boolean
}

interface CreateAdminRequest extends BaseAdmin {
    password: string
}

export interface Admin extends BaseAdmin, Identifiable { }

export interface BasicIdentifiable extends BasicInfo, Identifiable { }

export interface LoginRequest {
    username: string,
    password: string,
}