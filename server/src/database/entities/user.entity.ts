import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { Trades } from "./trades.entity";

/* 'users' table from the finance.db sqlite database */
@Entity({name: "users"})
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    /* TODO: implement hashing of plaintext passwords */
    @Column()
    hash: string;

    @Column("real", {default: 10000.00})
    cash: number;

    /* set one : many relationship for user id : transactions */
    @OneToMany(type => Trades, trades => trades.user_id)
    trades: Trades[];
     
}