import { Admin, Course, CourseInfo, CourseScheduleEntry, CreateAdminRequest, CreateCourseRequest, CreateTrainerRequest, CreateUserRequest, LoginRequest, Role, Session, SessionInfo, Trainer, User } from "@gym-manager/models";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface UserJwt extends JwtPayload {
    profile: Admin,
    role: string,
}

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
        this.jwt = await response.text();
        return true;
    }
    public async logout(): Promise<boolean> {
        const ret = this.isLoggedIn;
        this.jwt = undefined;
        return ret;
    }

    public get userDetails(): undefined | User | Trainer | Admin {
        if (this.jwt !== undefined) {
            return jwtDecode<UserJwt>(this.jwt!).profile;
        } else {
            return undefined;
        }
    }
    public get getRole(): undefined | Role {
        if (this.jwt !== undefined) {
            const role = jwtDecode<UserJwt>(this.jwt!).role;
            if (role === 'customer') {
                return Role.User;
            } else if (role === 'trainer') {
                return Role.Trainer;
            } else if (role === 'admin') {
                return Role.Admin;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    public getUserById(id: string): Promise<undefined | User | Trainer | Admin> {
        // TODO
        return Promise.resolve(this.userDetails);
        return this.apiRequest("GET", "/customers/" + id).then(r => r.json());
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
        return this.apiRequest("GET", "/courses").then(x => x.json());
    }
    public getTrainer(trainerId: string): Promise<Trainer> {
        return Promise.resolve({
            username: 'fsdigbohfigpdsb',
            firstName: 'Boro',
            lastName: 'McSboro',
            email: 'fsdigbohfigpdsb',
            phoneNumber: 'fsdigbohfigpdsb',
            id: 'trainerID'
        })

        return this.apiRequest("GET", "/trainers/" + trainerId)
            .then(r => r.json());
    }

    public trainerProfilePath(trainerId: string) {
        return '/trainer/profile/' + trainerId;
    }
    public customerProfilePath(trainerId: string) {
        return '/user/profile/' + trainerId;
    }

    public getCustomerCourses(userId: string): Promise<Array<{ course: CourseInfo, dayOfWeek: string, startTime: string }>> {
        // return Promise.resolve([{
        //     course: {
        //         id: "c.id",
        //         name: "c.name",
        //         description: "c.description",
        //         capacity: 43,
        //         trainer: "c.trainer",
        //     },
        //     startTime: "s.startTime",
        //     dayOfWeek: "s.dayOfWeek",
        //     participants: [{
        //         firstName: "string", lastName: "string", id: "string"
        //     }]
        // }])

        return this.apiRequest("GET", `/customers/${userId}/courses`).then(r => r.json());
    }
    public getTrainerCourses(userId: string): Promise<Array<{ course: CourseInfo, dayOfWeek: string, startTime: string, participants: { firstName: string, lastName: string, id: string }[] }>> {
        // return Promise.resolve([{
        //     course: {
        //         id: "c.id",
        //         name: "c.name",
        //         description: "c.description",
        //         capacity: 43,
        //         trainer: "c.trainer",
        //     },
        //     startTime: "s.startTime",
        //     dayOfWeek: "s.dayOfWeek",
        //     participants: [{
        //         firstName: "string", lastName: "string", id: "string"
        //     }]
        // }])

        return this.apiRequest("GET", `/trainers/${userId}/courses`)
            .then(r => r.json())
            .then(r =>
                r.flatMap((c: { schedule: any[]; id: string; name: string; description: string; capacity: string; trainer: string; }) =>
                    c.schedule.map((s: { startTime: string; dayOfWeek: string; participants: any[]; }) =>
                    ({
                        course: {
                            id: c.id,
                            name: c.name,
                            description: c.description,
                            capacity: c.capacity,
                            trainer: c.trainer,
                        },
                        startTime: s.startTime,
                        dayOfWeek: s.dayOfWeek,
                        participants: s.participants
                    })
                    )
                )
            );
    }
    public getCustomerSessions(userId: string): Promise<Array<{ info: SessionInfo, trainer: Trainer }>> {
        // return Promise.resolve([])

        return this.apiRequest("GET", `/customers/${userId}/sessions`)
            .then(r => r.json())
            .then(r => r.map((s: { id: string, dayOfWeek: string; startTime: string; trainer: { id: string, username: string; firstName: string; lastName: string; email: string; phoneNumber: string; }; }) => ({
                info: {
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime,
                    id: s.id,
                },
                trainer: {
                    id: s.trainer.id,
                    username: s.trainer.username,
                    firstName: s.trainer.firstName,
                    lastName: s.trainer.lastName,
                    email: s.trainer.email,
                    phoneNumber: s.trainer.phoneNumber,
                }
            })));
    }
    public getTrainerSessions(userId: string): Promise<Array<{ info: SessionInfo, participant: Admin }>> {
        return this.apiRequest("GET", `/trainers/${userId}/sessions`)
            .then(r => r.json())
            .then(r => r.map((s: { id: string, dayOfWeek: string; startTime: string; trainer: { id: string; username: string; firstName: string; lastName: string; }; }) => ({
                info: {
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime,
                    id: s.id,
                },
                participant: {
                    id: s.trainer.id,
                    username: s.trainer.username,
                    firstName: s.trainer.firstName,
                    lastName: s.trainer.lastName,
                }
            })));
    }


    public unsubscribeFromCourse(courseId: string): Promise<string> {
        return Promise.resolve(courseId);
        if (this.getRole != Role.User) {
            return Promise.reject();
        }
        const user = this.userDetails
        // unsubscribe
        // ... TODO
    }

    public cancelSession(sessionId: string): Promise<string> {
        return Promise.resolve(sessionId);
        // cancel one-on-one
        // ... TODO
    }

    public async bookCourse(courseId: string, dayOfWeek: string, startTime: string, clientId?: string): Promise<boolean> {
        //return Promise.resolve(true);

        return this.apiRequest("POST", `/courses/${courseId}/bookings`, { clientId: clientId, dayOfWeek, startTime })
            .then(r => true);
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

    public listTrainers(): Promise<Trainer[]> {
        return this.apiRequest("GET", "/trainers").then(x => x.json());
    }
}
