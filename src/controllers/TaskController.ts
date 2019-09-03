import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Task } from "../entity/Task";
import { validate } from "class-validator";
import { User } from "../entity/User";
import { log } from "console";

class TaskController {
    static listAll = async (req: Request, res: Response) => {
        //get user's id from jwt
        const userId = res.locals.jwtPayload.userId;

        //get tasks from db
        const taskRepository = getRepository(Task);
        const tasks = await taskRepository.find({ 
            join: {
                alias: "task",
                innerJoin: {
                    profile: "task.users"
                }
            },
            where: { 
                userid: userId
            }
        })

        res.send(tasks);
    }

    static getOneById = async (req: Request, res: Response) => {
        //get task's id from url
        const taskId = req.params.id;

        //get user's id from jwt
        const userId = res.locals.jwtPayload.userId;

        //get task from db
        const taskRepository = getRepository(Task);
        try{
            const task = await taskRepository.findOneOrFail({ 
                join: {
                    alias: "task",
                    innerJoin: {
                        profile: "task.users"
                    }
                },
                where: { 
                    userid: userId,
                    id: taskId
                }
             })
            res.send(task);
        } catch (error) {
            res.status(404).send("Task not found");
        }
    }

    static newTask = async (req: Request, res: Response) => {
        
        //get params from body
        let task = new Task();
        task.makeFromRequestAndResponse(req, res);

        //validate if params are ok
        const errors = await validate(task);
        if (errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        //try to save
        const taskRepository = getRepository(Task);
        try{
            await taskRepository.save(task);
        } catch (error) {
            res.status(404).send();
            return;
        }

        //if ok send 201
        res.status(201).send("Task created");
    }

    static editTask = async (req: Request, res: Response) => {
        //get task id from url
        const taskId = req.params.id;
        
        //get user's id from jwt
        const userId = res.locals.jwtPayload.userId;

        //try to find task on db
        const taskRepository = getRepository(Task);
        let task: Task;
        try{
            task = await taskRepository.findOneOrFail({ 
                join: {
                    alias: "task",
                    innerJoin: {
                        profile: "task.users"
                    }
                },
                where: { 
                    userid: userId,
                    id: taskId
                }
             })
        } catch (error) {
            res.status(404).send("Task not found");
        }
        
        task.updateFromRequest(req); //TODO: add other users
        

        //validate new values on model
        const errors = await validate(task);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //try to save
        try{
            await taskRepository.save(task);
        } catch (error){
            res.status(400).send(error);
        }

        //send 204 if ok
        res.status(204).send();
    }

    static deleteTask = async (req: Request, res: Response) => {
        //get task's id from url
        const taskId = req.params.id;

        //get user's id from jwt
        const userId = res.locals.jwtPayload.userId;

        //try to find task on db
        const taskRepository = getRepository(Task);
        let task: Task;
        try{
            task = await taskRepository.findOneOrFail(taskId);
        } catch (error){
            res.status(404).send("Task not found");
            return;
        }

        taskRepository.delete(taskId); //TODO: check if it deletes rows from `_user_tasks` table 

        //send 204 if ok
        res.status(204).send();
    }
}

export default TaskController;