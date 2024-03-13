import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users';
import { InvitationStatus } from '../types/invitationStatus';
import { Event } from './events';
import { BaseEntity } from './base';
import { RSVPQuestion, RSVPResponse } from '../types/invitationDto';

@Entity('invitations')
export class Invitation extends BaseEntity {

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @ManyToOne(() => User, user => user.invitations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name:'user_id' })
  userId: number;

  @ManyToOne(() => Event, event => event.invitations)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name:'event_id' })
  eventId: number;

  @Column({ type: 'json', nullable: true })
  rsvp: RSVPQuestion;

  @Column({ name: 'rsvp_response', type: 'json', nullable: true })
  rsvpResponse: RSVPResponse;

  @Column({ type: 'tinyint', default: 0 })
  checkin: number;

  @Column({ name: 'checkin_time', type: 'datetime', nullable: true })
  checkinTime: Date | null;

}
