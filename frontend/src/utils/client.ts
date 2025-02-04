import { Admin, Course, CourseInfo, CourseScheduleEntry, CreateAdminRequest, CreateCourseRequest, CreateTrainerRequest, CreateUserRequest, LoginRequest, Role, Session, SessionInfo, Trainer, User } from "@gym-manager/models";

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

    public get userDetails(): undefined | User | Trainer | Admin {
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

    public getUserById(id: string): undefined | User | Trainer | Admin {
        // TODO
        return this.userDetails;
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
        /*const x = await this.apiRequest("GET", "/courses");
        return await x.json();*/
        return [
            {
                id: "1",
                name: "Zumba",
                description: "Sad course description, nothing to see here...",
                capacity: 20,
                trainer: "trainerID",
                schedule: [{
                    dayOfWeek: "Wednesday",
                    startTime: "10:00",
                    participants: [],
                    availableSpots: 0,
                },
                {
                    dayOfWeek: "Tuesday",
                    startTime: "15:00",
                    participants: [],
                    availableSpots: 3,
                }]
            }
        ];
    }
    public getTrainer(trainerId: string): Promise<Trainer> {
        return Promise.resolve({
            username: 'fsdigbohfigpdsb',
            firstName: 'fsdigbohfigpdsb',
            lastName: 'fsdigbohfigpdsb',
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

    public bookCourse(courseId: string, dayOfWeek: string, startTime: string): Promise<boolean> {
        return Promise.resolve(true);

        return this.apiRequest("POST", `/courses/${courseId}/bookings`, { clientId: this.userDetails?.id, dayOfWeek, startTime })
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
