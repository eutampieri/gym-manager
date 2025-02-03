import { CreateTrainerRequest } from "@gym-manager/models/trainer";
export class Trainer {

    private apiRequest(method: string, endpoint: string, body?: object, headers?: Headers) {
        const h = headers || new Headers;
        //h.append("Authorization", "Bearer " + "pizza");
        h.append("Content-Type", "application/json");
        return fetch(`/api${endpoint}`, { method: method, body: JSON.stringify(body), headers: h })
    }

    public addTrainer(trainer: CreateTrainerRequest) {
        return this.apiRequest("POST", "/trainers", trainer);
    }
} 