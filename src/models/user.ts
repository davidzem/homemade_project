export default class User {
    constructor(
        public name: string,
        public email: string,
        public role: string = 'user',
        public id: string,
        public password: string
    ) {
    }

    getAuthData = () => ({
        name: this.name,
        email: this.email,
        role: this.role
    })


}
