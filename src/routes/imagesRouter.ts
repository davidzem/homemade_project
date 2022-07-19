import {Router} from "express";
import {
    deleteAll,
    deleteImage,
    getAllImages,
    getCombinations,
    getImageViaID,
    postImage,
    updateImage
} from "../controllers/imageController";

export const imageRoutes = {};


const imageRouter = Router();

imageRouter.route("/image/all")
    .get(getAllImages)
    .delete(deleteAll);

imageRouter.route("/image/:id")
    .get(getImageViaID)
    .put(updateImage)
    .delete(deleteImage);

imageRouter.route("/image")
    .get(getCombinations)
    .post(postImage);


export default imageRouter