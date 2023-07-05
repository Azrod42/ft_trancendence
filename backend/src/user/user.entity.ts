import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column("text", {unique: true})
    username: string

	@Column("text", {unique: true})
    displayname: string

    @Column("text", {unique: true})
    email: string

    @Column()
    password: string

    @Column()
    avatar: string

    @Column()
    is2FOn: boolean

	@Column()
    secret2F: string

    @Column()
    elo: number

    @Column()
    friends: string;

    @Column()
    blocked: string;

    @Column()
    chat: string;

    @Column()
    gameLose: number;

}

export default User;