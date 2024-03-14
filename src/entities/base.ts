import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date | null;

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date | null;

}