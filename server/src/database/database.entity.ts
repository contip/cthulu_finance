import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Database {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    hash: string;

    @Column()
    cash: number;
}