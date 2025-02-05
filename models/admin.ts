import { BasicInfo } from "./user"

export interface BaseAdmin extends BasicInfo {
    hasFullPrivileges: boolean
}


export interface CreateAdminRequest extends BaseAdmin {
    password: string
}