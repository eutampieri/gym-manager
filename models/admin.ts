interface BaseAdmin {
    username: string
    firstName: string
    lastName: string
    hasFullPrivileges: boolean
}


export interface CreateAdminRequest extends BaseAdmin {
    password: string
}