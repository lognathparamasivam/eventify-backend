import { container } from 'tsyringe';
import { User } from '../entities/users';
import { throwError } from '../utils/ErrorResponse';
import { Repository } from 'typeorm';

export class UserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = container.resolve<Repository<User>>('UserRepository');
  }

  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({id: id})
    if(!user){
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'User not found'
      })
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({where : {email: email}});
  }

  async updateUser(id: number, updateUserData: User): Promise<User> {
    const user = await this.userRepository.findOneBy({id: id})
    if(!user){
      throw new Error("User not found")
    }
    Object.assign(user, updateUserData);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
