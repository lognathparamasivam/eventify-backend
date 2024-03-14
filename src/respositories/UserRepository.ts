import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { User } from '../entities/users';
import { MysqlDataSource } from '../database/datasource';

container.register<Repository<User>>('UserRepository', {
  useValue: MysqlDataSource.getRepository(User),
});
