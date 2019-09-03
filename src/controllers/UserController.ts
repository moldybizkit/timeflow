import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from "class-validator";

class UserController {
        static getCurrent = async (req: Request, res: Response) => {
        //get Id from jwt
        const id = res.locals.jwtPayload.userId;

        //get user from database 
        const userRepository = getRepository(User);
        try{
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "firstName", "lastName", "phone", "image"]
            });
            res.send(user);
        } catch (error) {
            res.status(404).send("User not found");
        }
        
    };

    static editUser = async (req: Request, res: Response) => {
        //get ID from jwt
        const id = res.locals.jwtPayload.userId;

        //try to find user on database 
        const userRepository = getRepository(User);
        let user: User; 
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error){
            res.status(404).send("User not found");
            return;
        }

        //update user's properties from request
        user.updateFromRequest(req);

        //validate new values on model
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

}

export default UserController;