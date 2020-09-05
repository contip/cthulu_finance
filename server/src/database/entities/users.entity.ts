import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Trades } from './trades.entity';

/* schema of 'users' table of the server's database, stores user
 * login / account info */
@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /* server does not handle user emails so usernames must be unique */
  @Column({ unique: true })
  username: string;

  /* user hash column not selected by default (bugged for save() method)
   * see https://github.com/typeorm/typeorm/issues/4591 */
  @Column({ select: false })
  hash: string;

  @Column('real', { default: 10000.0 })
  cash: number;

  /* set one : many relationship for users : trades on id == userId */
  @OneToMany(
    type => Trades,
    trades => trades.user_id,
  )
  trades: Trades[];
}
