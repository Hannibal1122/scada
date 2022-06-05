import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Registry {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    value: string;

    @Column({ type: 'timestamp' })
    dateCreated: number;

    @Column({ default: false })
    isDeleted: boolean;
}