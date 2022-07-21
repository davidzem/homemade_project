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

/**
 * @swagger
 * tags:
 *      name: Images
 *      desription: Registry to manipulate over images.
 * **/

/**
 * @swagger
 * /image/all:
 *  get:
 *      summary: Gets all created images
 *      description: Only admins may retrieve all images.
 *      tags:[Images]
 *      security:
 *          - bearerAuth:[]
 *      parameters:
 *          - in: query
 *          name:name
 *
 * **/