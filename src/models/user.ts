export default class User {
    constructor(
        private name: string,
        private email: string,
        private password: string,
        private role: string = 'user'
    ) {
    }

    getAuthData = () => ({
        name: this.name,
        email: this.email,
        role: this.role
    })
}
