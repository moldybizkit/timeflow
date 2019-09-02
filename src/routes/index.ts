import { Router } from "express";
import auth from "./auth";
import user from "./user";
import task from "./task";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/task", task);

export default routes;