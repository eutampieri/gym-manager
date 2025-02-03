interface BaseAdmin {
    username: String
    firstName: String
    lastName: String
    hasFullPrivileges: boolean
}


export interface CreateAdminRequest extends BaseAdmin {
    password: String
}