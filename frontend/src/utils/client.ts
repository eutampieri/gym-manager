import { Admin, Course, CreateAdminRequest, CreateCourseRequest, CreateTrainerRequest, CreateUserRequest, LoginRequest, Role, Trainer, User } from "@gym-manager/models";

export class Client {
    private jwt?: string = undefined;

    public get isLoggedIn(): boolean {
        return this.jwt !== undefined;
    }

    private apiRequest(method: string, endpoint: string, body?: object, headers?: Headers) {
        const h = headers || new Headers;
        if (this.jwt !== undefined) {
            h.append("Authorization", "Bearer " + this.jwt);
        }
        h.append("Content-Type", "application/json");
        return fetch(`/api${endpoint}`, { method: method, body: JSON.stringify(body), headers: h })
    }

    public async login(username: string, password: string): Promise<boolean> {
        // TODO API request
        const request: LoginRequest = {
            username: username,
            password: password
        }
        const response = await this.apiRequest("POST", "/auth/authenticate", request);
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
        return Role.Admin;
    }

    public addUser(user: CreateUserRequest) {
        return this.apiRequest("POST", "/customers", user);
    }

    public async listUsers(): Promise<Array<User>> {
        /*const x = await this.apiRequest("GET", "/customers");
        return await x.json();*/
        return [
            {
                id: "1",
                dateOfBirth: "2021-01-01",
                fiscalCode: "mockCF",
                address: "Abbey Road 21, SW234E1 London",
                email: "info@abbey-road.com",
                phoneNumber: "+44 0071 194893845",
                username: "abbeyroad",
                firstName: "Abbey",
                lastName: "Road"
            }
        ];
    }

    public async listCourses(): Promise<Array<Course>> {
        /*const x = await this.apiRequest("GET", "/customers");
        return await x.json();*/
        return [
            {
                id: "1",
                name: "Zumba",
                description: "Sad course description, nothing to see here...",
                capacity: 20,
                trainer: "McMuscle",
                schedule: [{
                    dayOfWeek: "Wednesday",
                    startTime: "10:00",
                    participants: [],
                }]
            }
        ];
    }

    public addAdmin(admin: CreateAdminRequest) {
        return this.apiRequest("POST", "/admins", admin);
    }

    public addCourse(course: CreateCourseRequest) {
        return this.apiRequest("POST", "/courses", course);
    }

    public addTrainer(trainer: CreateTrainerRequest) {
        return this.apiRequest("POST", "/trainers", trainer);
    }
}
