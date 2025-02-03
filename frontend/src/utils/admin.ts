import { CreateAdminRequest } from "@gym-manager/models/admin";
export class Admin {

    private apiRequest(method: string, endpoint: string, body?: object, headers?: Headers) {
        const h = headers || new Headers;
        //h.append("Authorization", "Bearer " + "pizza");
        h.append("Content-Type", "application/json");
        return fetch(`//localhost:3000${endpoint}`, { method: method, body: JSON.stringify(body), headers: h })
    }

    public addAdmin(admin: CreateAdminRequest) {
        return this.apiRequest("POST", "/admins", admin);
    }
} 