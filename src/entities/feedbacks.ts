import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users';
import { BaseEntity } from './base';
import { Event } from './events';

@Entity('feedbacks')
export class Feedback extends BaseEntity {

  @Column({ nullable: false })
  comment: string;

  @ManyToOne(() => User, user => user.events)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name:'user_id' })
  userId: number;

  @ManyToOne(() => Event, event => event.feedbacks)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name:'event_id' })
  eventId: number;
}
