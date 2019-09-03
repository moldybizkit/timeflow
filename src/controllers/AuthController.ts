import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken";

import { User } from "../entity/User";
import config from "../config/config";
import { validate } from "class-validator";

class AuthController {
    static signin = async (req: Request, res: Response) => {
        //Check if username and password are set 
        let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send();
        }

        //Get user from database 
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { username } });
        } catch (error) {
            res.status(401).send();
        }

        //chec if ecrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send();
            return;
        }

        //Sign JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.jwtSecret,
            { expiresIn: "1h"}
        );

        //Send the jwt in the response
        res.send(token);
    };
    
    static signup = async (req: Request, res: Response) => {
        //get params from body
        let { username, password } = req.body;
        let user = new User();
        user.username = username;
        user.password = password;

        //validate if params are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //hash the password 
        user.hashPassword();

        //try to save
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("username already in use");
            return;
        }

        //if ok send 201
        res.status(201).send("User created");
    }

    static changePassword = async (req: Request, res: Response) => {
        // Get Id from jwt
        const id = res.locals.jwtPayload.userId;

        //get pararmeters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }

        //get user from the database 
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send();
        }

        //check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        //Validate model (password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Hash new password and save 
        user.hashPassword();
        userRepository.save(user);

        res.status(204).send();
    };
}

export default AuthController;