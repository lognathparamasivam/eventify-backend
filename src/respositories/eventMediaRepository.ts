import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../database/datasource';
import { EventMedia } from '../entities/eventMedia';

const eventMediaRepository = MysqlDataSource.getRepository(EventMedia);
container.register<Repository<EventMedia>>('EventMediaRepository', { useValue: eventMediaRepository });

export { eventMediaRepository };