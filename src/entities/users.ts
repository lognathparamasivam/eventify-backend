import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base';

@Entity('users')
export class User extends BaseEntity {

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ name: 'mobile_no', nullable: true, length: 25 })
  mobileNo: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;
}
