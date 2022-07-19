export default class Deployments {
    private createdAt: Date;

    constructor(private imageID: string) {
    }

    setCreationDate = (date = new Date()) => {
        this.createdAt = date
    };

    getImageID = () => this.imageID
}