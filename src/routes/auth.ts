import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/signin", AuthController.signin);

router.post("/signup", AuthController.signup);

router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;