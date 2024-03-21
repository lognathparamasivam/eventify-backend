import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users';
import { BaseEntity } from './base';

@Entity('notifications')
export class Notification extends BaseEntity {

  @Column({ nullable: false })
  message: string;

  @ManyToOne(() => User, user => user.events)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name:'user_id' })
  userId: number;

  @Column({ type: 'tinyint', default: 0 })
  read: number;
}
