import { Admin, CreateUserRequest, Role, Trainer, User } from "@gym-manager/models";

export class Client {
    private jwt?: string = undefined;

    public get isLoggedIn(): boolean {
        return this.jwt !== undefined;
    }

    private apiRequest(method: string, endpoint: string, body?: object, headers?: Headers) {
        const h = headers || new Headers;
        //h.append("Authorization", "Bearer " + "pizza");
        h.append("Content-Type", "application/json");
        return fetch(`/api/${endpoint}`, { method: method, body: JSON.stringify(body), headers: headers })
    }

    public async login(username: string, password: string): Promise<boolean> {
        // TODO API request
        this.jwt = "";
        return true;
    }

    public get getUserDetails(): undefined | User | Trainer | Admin {
        // TODO
        const result: User = {
            username: 'Rox09',
            firstName: 'Rocco',
            lastName: 'Siffredi',
            id: '1',
            dateOfBirth: '10/10/2020',
            fiscalCode: 'RVLMLJC987DH43',
            address: 'Via sghemba 4',
            email: 'rsiffr@g.com',
            phoneNumber: '+399333444555',
        }
        return result;
    }
    public get getRole(): undefined | Role {
        // TODO
        return Role.User;
    }

    public addUser(user: CreateUserRequest) {
        return this.apiRequest("POST", "/customers", user);
    }
} 