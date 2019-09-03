import {
    Entity,
    PrimaryGeneratedColumn, 
    Column, 
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable
} from "typeorm";

import { Length, IsNotEmpty} from "class-validator";
import * as bcrypt from "bcryptjs";
import { Task } from "./Task";
import { Request } from "express";

@Entity()
@Unique(["username"])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @Length(4, 20)
    username: string;

    @Column()
    @IsNotEmpty()
    @Length(4, 100)
    password: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        nullable: true
    })
    firstName: string;

    @Column({
        nullable: true
    })
    lastName: string;

    @Column({
        nullable: true
    })
    phone: string;

    @Column({
        nullable: true
    })
    image: string;

    @ManyToMany(type => Task, task => task.users, {
        cascade: true
    })
    @JoinTable({
        name: "user_has_tasks"
    })
    tasks: Task[];

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    updateFromRequest(req: Request){
        const {firstName, lastName, phone, image} = req.body;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.image = image;
    }

}
