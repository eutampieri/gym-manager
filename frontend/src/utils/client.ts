import { CreateUserRequest } from "@gym-manager/models";

export class Client {
    private jwt?: string = undefined;

    public get isLoggedIn(): boolean {
        return this.jwt !== undefined;
    }

    private apiRequest(method: string, endpoint: string, body?: object, headers?: Headers) {
        const h = headers || new Headers;
        h.append("Authorization", "Bearer " + "pizza");
        h.append("Content-Type", "application/json");
        return fetch(`/api/${endpoint}`, { method: method, body: JSON.stringify(body), headers: headers })
    }

    public async login(username: string, password: string): Promise<boolean> {
        // TODO API request
        this.jwt = "";
        return true;
    }

    public addUser(user: CreateUserRequest) {
        return this.apiRequest("POST", "/customers", user);
    }
}