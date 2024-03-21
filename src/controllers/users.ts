import { Request, Response } from 'express';
import { User } from '../entities/users';
import { UserService } from '../services/userService';
import { sendError, sendSuccess } from '../utils/sendResponse';
import { CreateUserDto, UpdateUserDto } from '../types/userDto';
import { injectable } from 'tsyringe';
@injectable()
export class UserController {

  constructor(private readonly userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    const user: CreateUserDto = req.body;
   await this.userService.createUser(user).then((result: User | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async getUsers(req: Request, res: Response): Promise<void> {
     await this.userService.getUsers().then((results: User[] | null) => {
      sendSuccess(req, res, results);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.userId);
    await this.userService.getUserById(userId).then((result: User | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.userId);
    const updatedUser: UpdateUserDto = req.body;
    await this.userService.updateUser(userId, updatedUser).then((result: User | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.userId);
    await this.userService.deleteUser(userId).then(() => {
      sendSuccess(req, res);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }
}
