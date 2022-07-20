import {Router} from "express";
import {createDeployment, deleteAllDeployments, getAllDeployments, getCount} from "../controllers/deploymentController";
import {auth} from "../middleware/auth";


const deploymentRouter = Router();

deploymentRouter.post("/deploy/:id", auth(['CPUD_Image']), createDeployment);

deploymentRouter.route("/deploy/all")
    .get(auth(['Get_All_Images']), getAllDeployments)
    .delete(auth(['Delete_All_Images']), deleteAllDeployments);

deploymentRouter.get('/count',auth(['CPUD_Image']), getCount);

export default deploymentRouter;