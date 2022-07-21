import {Router} from "express";
import imageRouter from "./imagesRouter";
import deploymentRouter from "./deploymentRouter";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import docsRouter from "./docsRouter";


const api = Router();

api.use("/i", imageRouter);
api.use("/d", deploymentRouter);
api.use('/a', authRouter);
if (process.env.NODE_ENV === 'dev') {
    api.use('/u', userRouter);
    api.use('/docs', docsRouter)
}


export default api