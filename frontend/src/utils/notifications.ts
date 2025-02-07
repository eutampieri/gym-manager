import { Action } from "./lists";

export interface Notification {
    title?: string,
    when?: Date,
    body: string,
    background?: string,
    actions?: Action[],
}
