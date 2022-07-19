import {Router} from "express";
import {createDeployment, deleteAllDeployments, getAllDeployments, getCount} from "../controllers/deploymentController";


const deploymentRouter = Router();

deploymentRouter.post("/deploy/:id", createDeployment);

deploymentRouter.route("/deploy/all")
    .get(getAllDeployments)
    .delete(deleteAllDeployments);

deploymentRouter.get('/count', getCount)

export default deploymentRouter;