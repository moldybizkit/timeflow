import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

//Get information about current user
router.get("/me", [checkJwt], UserController.getCurrent);

//Edit current user
router.patch(
    "/me",
    [checkJwt],
    UserController.editUser
);

export default router;