import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../database/datasource';
import { Token } from '../entities/tokens';

const tokenRepository = MysqlDataSource.getRepository(Token);
container.register<Repository<Token>>('tokenRepository', { useValue: tokenRepository });

export { tokenRepository };
