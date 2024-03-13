import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from './users';
import { EventMedia } from './eventMedia';
import { Invitation } from './invitations';
import { BaseEntity } from './base';
import { Feedback } from './feedbacks';
import { EventStatus } from '../types/eventStatus';

@Entity('events')
export class Event extends BaseEntity {

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  location: string;

  @Column({ name: 'start_date', type: 'datetime', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date',type: 'datetime', nullable: true })
  endDate: Date | null;

  @ManyToOne(() => User, user => user.events)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name:'user_id' })
  userId: number;

  @OneToOne(() => EventMedia, eventMedia => eventMedia.event,  { eager: true })
  media: EventMedia;

  @OneToMany(() => Invitation, invitation => invitation.event)
  invitations: Invitation[];

  @OneToMany(() => Feedback, feedback => feedback.event)
  feedbacks: Feedback[];

  @Column({ name:'calendar_id', nullable: true })
  calendarId: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.CONFIRMED,
  })
  status: EventStatus;
}
