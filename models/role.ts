export enum Role {
    Admin, Trainer, User
}

export function parseRole(role: string): Role | undefined {
    if (role === 'customer') {
        return Role.User;
    } else if (role === 'trainer') {
        return Role.Trainer;
    } else if (role === 'admin') {
        return Role.Admin;
    } else {
        return undefined;
    }
}