/**
 * User Entity
 * @description Represents a user in the Identity & Access Management context.
 * @author RQLS TEAM
 */
export class User {
    constructor({ id = null, name = '', email = '', password = '', role = 'viewer', department = '', isActive = true, avatarColor = '', lastLogin = '' } = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.isActive = isActive;
        this.avatarColor = avatarColor;
        this.lastLogin = lastLogin;
    }
}
