import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users';

@Entity('tokens')
export class Token {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'access_token', type: 'text', nullable: false })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text', nullable: false })
  refreshToken: string;

  @ManyToOne(() => User, user => user.events)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name:'user_id' })
  userId: number;
}
