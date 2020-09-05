import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';

/* schema of 'trades' table of the server's database, stores stock
 * purchase and sale data */
@Entity({ name: 'trades' })
export class Trades {
  @PrimaryGeneratedColumn()
  trade_id: number;

  /* establish many-to-one relationship between trades and users (i.e.
   * one user can have many trades) on user id */
  @ManyToOne(
    type => UserEntity,
    users => users.trades,
  )
  user_id: UserEntity;

  @Column('real')
  transaction_price: number;

  @Column()
  stock_symbol: string;

  @Column()
  stock_name: string;

  @Column('real')
  stock_price: number;

  @Column()
  shares: number;

  @Column()
  date: Date;
}
