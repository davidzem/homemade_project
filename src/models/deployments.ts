export default class Deployments {
    public createdAt: Date;

    constructor(private imageID: string) {
    }

    setCreationDate = (date = new Date()) => {
        this.createdAt = date
    };

    getImageID = () => this.imageID
}