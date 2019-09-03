import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { User } from "./User";
import { Request, Response } from "express";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(0,100)
    name: string;

    @Column()
    description: string;

    @Column()
    file: string;

    @Column()
    startsAt: Date;

    @Column()
    endsAt: Date;

    @Column()
    type: string;

    @Column()
    location: string;

    @ManyToMany(type => User, user => user.tasks)
    users: User[];

    makeFromRequestAndResponse(req: Request, res: Response){
        const user = new User();
        user.id = res.locals.jwtPayload.userId;
        const users: User[] = [user];

        this.updateFromRequest(req);
        this.users = users;
    }

    updateFromRequest(req: Request){
        const {name, description, file, startsAt, endsAt, type, location } = req.body;
        this.name = name;
        this.description = description;
        this.file = file;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.type = type;
        this.location = location;
    }
}