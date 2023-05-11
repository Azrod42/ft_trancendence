import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    avatar: string

    @Column()
    is2FOn: boolean

	@Column()
    secret2F: string
}

export default User;