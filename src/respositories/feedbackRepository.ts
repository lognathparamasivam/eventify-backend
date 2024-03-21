import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { MysqlDataSource } from '../database/datasource';
import { Feedback } from '../entities/feedbacks';

const feedbackRepository = MysqlDataSource.getRepository(Feedback);
container.register<Repository<Feedback>>('FeedbackRepository', { useValue: feedbackRepository });

export { feedbackRepository };
