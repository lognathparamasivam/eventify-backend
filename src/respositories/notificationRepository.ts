import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../database/datasource';
import { Notification } from '../entities/notifications';

const notificationRepository = MysqlDataSource.getRepository(Notification);
container.register<Repository<Notification>>('NotificationRepository', { useValue: notificationRepository });

export { notificationRepository };
