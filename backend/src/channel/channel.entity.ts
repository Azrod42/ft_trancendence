import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column("text")
    owners: string

    @Column("text", {unique: true})
    channelname: string

    @Column("text")
    password: string

    @Column()
    type: number

    @Column()
    msghist: string

    @Column()
    mutedusers: string

    @Column()
    bannedusers: string

    @Column()
    channelusers: string

}

export default Channel