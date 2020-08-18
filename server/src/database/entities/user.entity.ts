import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { Trades } from "./trades.entity";

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

    @OneToMany(type => Trades, trades => trades.user_id)
    trades: Trades[];
}