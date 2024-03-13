import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../database/datasource';
import { Event } from '../entities/events';

const eventRepository = MysqlDataSource.getRepository(Event);
container.register<Repository<Event>>('EventRepository', { useValue: eventRepository });

export { eventRepository };
