import {Router} from "express";
import imageRouter from "./imagesRouter";
import deploymentRouter from "./deploymentRouter";


const api = Router();

api.use("/i", imageRouter);
api.use("/d", deploymentRouter);

export default api