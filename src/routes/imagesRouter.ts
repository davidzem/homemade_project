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
import {auth} from "../middleware/auth";

export const imageRoutes = {};


const imageRouter = Router();

imageRouter.route("/image/all")
    .get(auth(["Get_All_Images"]), getAllImages)
    .delete(auth(['Delete_All_Images']), deleteAll);

imageRouter.route("/image/:id")
    .get(auth(['CPUD_Image']), getImageViaID)
    .put(auth(['CPUD_Image']), updateImage)
    .delete(auth(['CPUD_Image']), deleteImage);

imageRouter.route("/image")
    .get(auth(['Get_All_Images']), getCombinations)
    .post(auth(['CPUD_Image']), postImage);


export default imageRouter