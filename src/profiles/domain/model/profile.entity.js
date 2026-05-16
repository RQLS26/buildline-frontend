/**
 * Profile Entity
 * @description Represents a company profile in the Profiles context.
 * @author RQLS TEAM
 */
export class Profile {
    constructor({ id = null, companyName = '', ruc = '', address = '', phone = '', email = '' } = {}) {
        this.id = id;
        this.companyName = companyName;
        this.ruc = ruc;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }
}
