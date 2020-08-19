import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

/* 'trades' table of the finance.db sqlite database, stores stock purchase
    and sale data */
@Entity({name: "trades"})
export class Trades {
    @PrimaryGeneratedColumn()
    trade_id: number;

    /* link to id from users table (one user can have many 
        transactions) */
    @ManyToOne(type => UserEntity, users => users.trades)
    user_id: UserEntity;

    @Column("real")
    transaction_price: number;

    @Column()
    stock_symbol: string;

    @Column()
    stock_name: string;

    @Column("real")
    stock_price: number;

    @Column()
    shares: number;

    @Column()
    date: Date;
}