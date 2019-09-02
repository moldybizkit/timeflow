import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import TaskController from "../controllers/TaskController";

const router = Router();

//get all user's tasks
router.get("/", [checkJwt], TaskController.listAll);

//get one user's task
router.get(
    "/:id([0-9]+)", 
    [checkJwt],
    TaskController.getOneById
);

//create new task
router.post("/",[checkJwt], TaskController.newTask);

//edit one task
router.patch(
    "/:id([0-9]+)",
    [checkJwt],
    TaskController.editTask
);

//delete one task
router.delete(
    "/:id([0-9]+)",
    [checkJwt],
    TaskController.deleteTask
);

export default router;