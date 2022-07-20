import {Router} from "express";
import {deleteAllUsers, getAllUsers} from "../controllers/userController";

const userRouter = Router();

userRouter.route("/all")
    .get(getAllUsers)
    .delete(deleteAllUsers);


export default userRouter