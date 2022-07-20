export type Roles = 'user' | 'admin'

const allRoles = {
    user: ['CPUD_Image'],
    admin: ['CPUD_Image', 'Get_All_Images', 'Delete_All_Images']
};

export type Rights = 'CPUD_Image' | 'Get_All_Images' | 'Delete_All_Images'

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));


export default {
    roles,
    roleRights
}