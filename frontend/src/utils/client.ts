import { Admin, BookCourseRequest, Course, CourseInfo, CourseScheduleEntry, CreateAdminRequest, CreateCourseRequest, CreateSessionRequest, CreateTrainerRequest, CreateUserRequest, LoginRequest, Role, Session, SessionInfo, Trainer, User } from "@gym-manager/models";
import { TrainerAvailabilities } from "@gym-manager/models/trainer";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface UserJwt extends JwtPayload {
    profile: Admin,
    role: string,
}

export class Client {
    private token_storage_name: string = 'gym-token';
    private jwt?: string = localStorage.getItem(this.token_storage_name) || undefined;

    public get isLoggedIn(): boolean {
        // check if token is defined and valid
        try {
            const now = new Date();
            const expDate = new Date(jwtDecode<UserJwt>(this.jwt!).exp! * 1000);

            return now <= expDate;
        } catch (e) {
            return false;
        }
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
        localStorage.setItem(this.token_storage_name, this.jwt);
        return true;
    }
    public async logout(): Promise<boolean> {
        const ret = this.isLoggedIn;
        this.jwt = undefined;
        localStorage.removeItem(this.token_storage_name);
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
        return this.apiRequest("GET", "/customers/" + id).then(r => r.json());
    }
    public getAdminById(id: string): Promise<Admin | undefined> {
        return this.apiRequest("GET", "/admin/" + id).then(r => r.json());
    }
    public getTrainerById(id: string): Promise<Trainer> {
        return this.apiRequest("GET", "/trainers/" + id).then(r => r.json());
    }

    public adminProfilePath(adminId: string) {
        return '/admin/profile/' + adminId;
    }
    public trainerProfilePath(trainerId: string) {
        return '/trainer/profile/' + trainerId;
    }
    public customerProfilePath(trainerId: string) {
        return '/user/profile/' + trainerId;
    }
    public getProfilePath() {
        const id = this.userDetails?.id || '';
        switch (this.getRole) {
            case Role.User:
                return this.customerProfilePath(id);
            case Role.Trainer:
                return this.trainerProfilePath(id);
            case Role.Admin:
                return this.adminProfilePath(id);
        }
    }

    public addUser(user: CreateUserRequest) {
        return this.apiRequest("POST", "/customers", user);
    }
    public addAdmin(admin: CreateAdminRequest) {
        return this.apiRequest("POST", "/admins", admin);
    }
    public addTrainer(trainer: CreateTrainerRequest) {
        return this.apiRequest("POST", "/trainers", trainer);
    }
    public addCourse(course: CreateCourseRequest) {
        return this.apiRequest("POST", "/courses", course);
    }

    public updateAdmin(id: string, updated: CreateAdminRequest): Promise<boolean> {
        return this.apiRequest("PUT", "/admins/" + id, updated).then(r => r.status == 200);
    }
    public updateCustomer(id: string, updated: CreateUserRequest): Promise<boolean> {
        return this.apiRequest("PUT", "/customers/" + id, updated).then(r => r.status == 200);
    }
    public updateTrainer(id: string, updated: CreateTrainerRequest): Promise<boolean> {
        return this.apiRequest("PUT", "/trainers/" + id, updated).then(r => r.status == 200);
    }
    public updateCourse(id: string, updated: CreateCourseRequest): Promise<boolean> {
        return this.apiRequest("PUT", "/courses/" + id, updated).then(r => r.status == 200);
    }

    public listUsers(): Promise<User[]> {
        return this.apiRequest("GET", "/customers").then(x => x.json());
    }
    public listAdmins(): Promise<Admin[]> {
        return this.apiRequest("GET", "/admins").then(x => x.json());
    }
    public listTrainers(): Promise<Trainer[]> {
        return this.apiRequest("GET", "/trainers").then(x => x.json());
    }
    public listCourses(): Promise<Course[]> {
        return this.apiRequest("GET", "/courses").then(x => x.json());
    }

    public getCustomerCourses(userId: string): Promise<Array<{ course: CourseInfo, dayOfWeek: string, startTime: string }>> {
        return this.apiRequest("GET", `/customers/${userId}/courses`).then(r => r.json());
    }
    public getTrainerCourses(userId: string): Promise<Array<{ course: CourseInfo, dayOfWeek: string, startTime: string, participants: { firstName: string, lastName: string, id: string }[] }>> {
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
    
    public async bookCourse(courseId: string, r: BookCourseRequest): Promise<boolean> {
        return this.apiRequest("POST", `/courses/${courseId}/bookings`, r).then(r => r.status == 201);
    }
    public unsubscribeFromCourse(courseId: string, r: BookCourseRequest): Promise<boolean> {
        return this.apiRequest("DELETE", `/courses/${courseId}/bookings`, r).then(r => r.status == 200);
    }
    
    public createSession(session: CreateSessionRequest): Promise<boolean> {
        return this.apiRequest("POST", "/sessions", session).then(r => r.status == 201);
    }
    public cancelSession(sessionId: string): Promise<boolean> {
        return this.apiRequest("DELETE", "/sessions/" + sessionId).then(r => r.status == 200);
    }

    public async getTrainerAvailabilities(trainer: string): Promise<TrainerAvailabilities> {
        const response = await this.apiRequest("GET", `/trainers/${trainer}/availabilities`).then(x => x.json());
        return response;
    }

}
