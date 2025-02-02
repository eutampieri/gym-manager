import { Admin, CreateUserRequest, Role, Trainer, User } from "@gym-manager/models";
import { CourseModel } from "@gym-manager/models/course";

export class Client {
    private jwt?: string = undefined;

    public get isLoggedIn(): boolean {
        return this.jwt !== undefined;
    }

    private apiRequest(method: string, endpoint: string, body?: object, headers?: Headers) {
        const h = headers || new Headers;
        //h.append("Authorization", "Bearer " + "pizza");
        h.append("Content-Type", "application/json");
        return fetch(`/api/${endpoint}`, { method: method, body: JSON.stringify(body), headers: h })
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

    public getCourses(): Promise<Array<CourseModel>> {
        const user = this.getUserDetails;
        return this.apiRequest("GET", "/customers/courses/" + user?.username)
            .then(res => res.json())
            .then(cs => Promise.all(
                cs.map((c: CourseModel) => 
                    this.apiRequest("GET", "/trainer/" + c.trainer)
                    .then(res2 => res2.json())
                    .then(res3 => {
                        c.trainer = res3.username;
                        return c;
                    })
                )
            ))
        // TEST
        // const courses = [{
        //     name: "cico",
        //     description: "cico",
        //     schedule: [{
        //         dayOfWeek: "cico",
        //         startTime: "cico",
        //     },{
        //         dayOfWeek: "afh",
        //         startTime: "cihhhhhhco",
        //     }],
        //     capacity: "cico",
        //     trainer: "1"
        // },{
        //     name: "afijdjgh",
        //     description: "afijdjgh",
        //     schedule: [{
        //         dayOfWeek: "afijdjgh",
        //         startTime: "afijdjgh",
        //     }],
        //     capacity: "afijdjgh",
        //     trainer: "2"
        // }]
        // const trainers = {
        //     username: "CKINADSNPOIN"
        // }
        // return Promise.resolve(courses)
        //     // .then(res => res.json())
        //     .then(cs => Promise.all(
        //         cs.map((c: CourseModel) => 
        //             Promise.resolve(trainers)
        //             // .then(res2 => res2.json())
        //             .then(res3 => {
        //                 c.trainer = res3.username;
        //                 return c;
        //             })
        //         )
        //     ))
    }
} 