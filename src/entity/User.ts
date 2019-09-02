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

import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Task } from "./Task";

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

}
