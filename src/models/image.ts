export default class Image {
    constructor(
        private name: string,
        repository: string,
        version: string,
        metadata?: object,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {
    }

    public getName = () => this.name;

    public getCreationDate = () => this.createdAt;

    public getUpdatedDate = () => {
        if (this.updatedAt) {
            return this.updatedAt
        } else return null
    }
}
