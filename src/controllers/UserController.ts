import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from "class-validator";

class UserController {
    static listAll = async (req: Request, res: Response) => {
        // get useres from database 
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "username"]
        });

        //send users
        res.send(users);
    };

    static getOneById = async (req: Request, res: Response) => {
        //get Id from url
        const id = req.params.id;

        //get user from database 
        const userRepository = getRepository(User);
        try{
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username"]
            });
            res.send(user);
        } catch (error) {
            res.status(404).send("User not found");
        }
        
    };

    static editUser = async (req: Request, res: Response) => {
        //get ID from url
        const id = req.params.id;

        //get values from the body
        const { username, role } = req.body;

        //try to find user on database 
        const userRepository = getRepository(User);
        let user: User; 
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error){
            res.status(404).send("User not found");
            return;
        }

        //validate new values on model
        user.username = username; 
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //try to save 
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("username alreasy in use");
            return;
        }

        //send 204 if ok
        res.status(204).send();
    };

    static deleteUser = async (req: Request, res: Response) => {
        // get id from url
        const id = req.params.id;

        //try to find user on db
        const userRepository = getRepository(User);
        let user: User;
        try{ 
            user = await userRepository.findOneOrFail(id);
        } catch (error){
            res.status(404).send("User not found");
            return;
        }
        userRepository.delete(id);

        //send 204 if ok
        res.status(204).send();
    };
}

export default UserController;