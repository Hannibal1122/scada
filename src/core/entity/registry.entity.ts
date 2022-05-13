import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Registry {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    value: string;

    @Column({ type: 'timestamp' })
    dateCreated: Date;

    @Column({ default: true })
    isDeleted: boolean;
}