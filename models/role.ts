export enum Role {
    Admin, Trainer, User
}

export function parseRole(role: string): Role | undefined {
    if (role === 'user') {
        return Role.User;
    } else if (role === 'trainer') {
        return Role.Trainer;
    } else if (role === 'admin') {
        return Role.Admin;
    }
}

export function roleToString(role: Role): string | undefined {
    if (role == Role.Admin) {
        return "admin";
    } else if (role == Role.Trainer) {
        return "trainer";
    } else if (role == Role.User) {
        return "user"
    }
}