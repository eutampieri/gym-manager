import { JWTPayload } from "jose";

export declare function verifyJWT(jwt: string): Promise<JWTPayload>;