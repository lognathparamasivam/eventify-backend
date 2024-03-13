import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../database/datasource';
import { Invitation } from '../entities/invitations';


const invitationRepository = MysqlDataSource.getRepository(Invitation);
container.register<Repository<Invitation>>('InvitationRepository', { useValue: invitationRepository });

export { invitationRepository };
