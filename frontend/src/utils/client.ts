import { Admin, BookCourseRequest, Course, CourseInfo, CourseScheduleEntry, CreateAdminRequest, CreateCourseRequest, CreateSessionRequest, CreateTrainerRequest, CreateUserRequest, LoginRequest, parseRole, Role, Session, SessionInfo, Trainer, User } from "@gym-manager/models";
import { TrainerAvailabilities } from "@gym-manager/models/trainer";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface UserJwt extends JwtPayload {
    profile: Admin,
    role: string,
}

export class Client {
    private token_storage_name: string = 'gym-token';
    private jwt?: string = localStorage.getItem(this.token_storage_name) || undefined;

    private impersonating: boolean = false;
    private impersonatedInfo: { role: Role, user: User | Trainer | undefined } = { role: Role.Admin, user: undefined };

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
    
    public get authToken(): string | undefined {
        return this.jwt;
    }

    public get isImpersonating(): boolean {
        return this.impersonating;
    }

    public startImpersonating(user: User | Trainer, role: Role) {
        this.impersonatedInfo.role = role;
        this.impersonatedInfo.user = user;
        this.impersonating = true;
    }
    public stopImpersonating() {
        this.impersonating = false;
        this.impersonatedInfo.user = undefined;
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
        this.impersonating = false;
        const ret = this.isLoggedIn;
        this.jwt = undefined;
        localStorage.removeItem(this.token_storage_name);
        return ret;
    }

    public get userDetails(): undefined | User | Trainer | Admin {
        if (this.isImpersonating) {
            return this.impersonatedInfo.user;
        } else if (this.jwt !== undefined) {
            return jwtDecode<UserJwt>(this.jwt!).profile;
        } else {
            return undefined;
        }
    }
    public get getRole(): undefined | Role {
        if (this.isImpersonating) {
            return this.impersonatedInfo.role;
        } else if (this.jwt !== undefined) {
            const role = jwtDecode<UserJwt>(this.jwt!).role;
            return parseRole(role);
        } else {
            return undefined;
        }
    }

    public getUserById(id: string): Promise<User | undefined> {
        return this.apiRequest("GET", "/customers/" + id).then(r => r.json());
    }
    public getAdminById(id: string): Promise<Admin | undefined> {
        return this.apiRequest("GET", "/admins/" + id).then(r => r.json());
    }
    public getTrainerById(id: string): Promise<Trainer | undefined> {
        return this.apiRequest("GET", "/trainers/" + id).then(r => r.json());
    }
    public getCourseById(id: string): Promise<Course | undefined> {
        return this.apiRequest("GET", "/courses/" + id).then(r => r.json());
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

    public addUser(user: CreateUserRequest): Promise<boolean> {
        return this.apiRequest("POST", "/customers", user).then(r => r.status == 201);
    }
    public addAdmin(admin: CreateAdminRequest): Promise<boolean> {
        return this.apiRequest("POST", "/admins", admin).then(r => r.status == 201);
    }
    public addTrainer(trainer: CreateTrainerRequest): Promise<boolean> {
        return this.apiRequest("POST", "/trainers", trainer).then(r => r.status == 201);
    }
    public addCourse(course: CreateCourseRequest): Promise<boolean> {
        return this.apiRequest("POST", "/courses", course).then(r => r.status == 201);
    }

    public updateAdmin(id: string, updated: CreateAdminRequest): Promise<boolean> {
        return this.apiRequest("PUT", "/admins", { ...updated, id: id }).then(r => r.status == 200);
    }
    public updateCustomer(id: string, updated: CreateUserRequest): Promise<boolean> {
        return this.apiRequest("PUT", "/customers", { ...updated, id: id }).then(r => r.status == 200);
    }
    public updateTrainer(id: string, updated: CreateTrainerRequest): Promise<boolean> {
        return this.apiRequest("PUT", "/trainers", { ...updated, id: id }).then(r => r.status == 200);
    }
    public updateCourse(id: string, updated: CreateCourseRequest): Promise<boolean> {
        return this.apiRequest("PUT", "/courses", { ...updated, id: id }).then(r => r.status == 200);
    }

    public deleteAdmin(id: string): Promise<boolean> {
        return this.apiRequest("DELETE", "/admins/" + id).then(r => r.status == 200);
    }
    public deleteCustomer(id: string): Promise<boolean> {
        return this.apiRequest("DELETE", "/customers/" + id).then(r => r.status == 200);
    }
    public deleteTrainer(id: string): Promise<boolean> {
        return this.apiRequest("DELETE", "/trainers/" + id).then(r => r.status == 200);
    }
    public deleteCourse(id: string): Promise<boolean> {
        return this.apiRequest("DELETE", "/courses/" + id).then(r => r.status == 200);
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
