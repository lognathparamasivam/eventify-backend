import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Event } from './events';
import { BaseEntity } from './base';

@Entity('event_media')
export class EventMedia extends BaseEntity{

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'json', nullable: true })
  videos: string[];

  @Column({ type: 'json', nullable: true })
  documents: string[];

  @OneToOne(() => Event, event => event.media)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name:'event_id' })
  eventId: number;
}