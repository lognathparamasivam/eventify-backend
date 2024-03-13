import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { User } from '../entities/users';
import { MysqlDataSource } from '../database/datasource';

const userRepository = MysqlDataSource.getRepository(User);
container.register<Repository<User>>('UserRepository', { useValue: userRepository });

export { userRepository };
