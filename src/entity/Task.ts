import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { User } from "./User";
import { Request } from "express";

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
    @IsNotEmpty()
    type: string;

    @Column()
    location: string;

    @ManyToMany(type => User, user => user.tasks)
    users: User[];

    makeFromRequest(req: Request){
        let {name, description, file, startsAt, endsAt, type, location } = req.body;
        this.name = name;
        this.description = description;
        this.file = file;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.type = type;
        this.location = location;
        let users: User[] = [];
        this.users = users;
    }
}