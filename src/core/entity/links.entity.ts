import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Links {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    idFrom: number;

    @Column()
    idTo: number;
}