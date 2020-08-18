import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

/* mirrors the columns in the finance.db sqlite db.  Look for a way to set 
 *  each field as NOT NULL and also set the default cash value to 10000 */
@Entity({name: "trades"})
export class Trades {
    @PrimaryGeneratedColumn()
    trade_id: number;

    /* next column is userID from users table */
    @ManyToOne(type => UserEntity, users => users.id)
    user_id: UserEntity;

    @Column("real")
    transaction_price: number;

    @Column()
    stock: string;

    @Column("real")
    stock_price: number;

    @Column()
    shares: number;

    @Column()
    date: Date;
}