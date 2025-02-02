import { CreateUserRequest } from "@gym-manager/models/user";


export class Client {

    private apiRequest(method: string, endpoint: string, body?: object, headers?: Headers) {
        const h = headers || new Headers;
        //h.append("Authorization", "Bearer " + "pizza");
        h.append("Content-Type", "application/json");
        return fetch(`//localhost:3000${endpoint}`, { method: method, body: JSON.stringify(body), headers: h })
    }

    public addUser(user: CreateUserRequest) {
        return this.apiRequest("POST", "/customers", user);
    }
} 