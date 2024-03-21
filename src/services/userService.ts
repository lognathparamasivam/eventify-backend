import { injectable } from 'tsyringe';
import { User } from '../entities/users';
import { throwError } from '../utils/ErrorResponse';
import { CreateUserDto, UpdateUserDto } from '../types/userDto';
import { userRepository } from '../respositories/userRepository';

@injectable()
export class UserService {
  
  async createUser(user: CreateUserDto): Promise<User> {
    return await userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return await userRepository.find();
  }

  async getUserById(userId: number): Promise<User | null> {
    const user = await userRepository.findOneBy({id: userId})
    if(!user){
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'User not found'
      })
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await userRepository.findOne({where : {email: email}});
  }

  async updateUser(userId: number, updateUserData: UpdateUserDto): Promise<User> {
    const user = await userRepository.findOneBy({id: userId})
    if(!user){
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'User not found'
      })
    }
    Object.assign(user!, updateUserData);
    return await userRepository.save(user!);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await userRepository.findOneBy({id: userId})
    if(!user){
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'User not found'
      })
    }
    await userRepository.delete(userId);
  }
  
}
