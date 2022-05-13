import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Scheme {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    parent: number;
}