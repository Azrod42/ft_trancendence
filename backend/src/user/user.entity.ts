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
    msgHist: string;

    @Column()
    idWebSocket: string;

    @Column()
    gameNumber: number;

    @Column()
    gameWin: number;

    @Column()
    gameLose:number;

    @Column()
    winLoseRate: string;

    @Column()
    totalPointGet: number;

    @Column()
    totalPointTake: number;

    @Column()
    pointGetTakeRate: string;

    @Column()
    winStreak: number;

    @Column()
    gameHist: string;

    @Column()
    xp: number;

    @Column()
    totalGame: number;

    @Column()
    socketID: string;

    @Column()
    slot: number;

    @Column()
    inGame: boolean;
}

export default User;