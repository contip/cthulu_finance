import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

/* mirrors the columns in the finance.db sqlite db.  Look for a way to set 
 *  each field as NOT NULL and also set the default cash value to 10000 */
@Entity({name: "users"})
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    hash: string;

    @Column({default: 10000})
    cash: number;
}