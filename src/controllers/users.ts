import { Request, Response } from 'express';
import { User } from '../entities/users';
import { UserService } from '../services/UserService';
import { sendError, sendSuccess } from '../utils/sendResponse';
import { container } from 'tsyringe';
export class UserController {

  private readonly userService: UserService;

  constructor() {
    this.userService = container.resolve(UserService);
  }
  async createUser(req: Request, res: Response): Promise<void> {
    const user: User = req.body;
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
    const id: number = parseInt(req.params.id);
    await this.userService.getUserById(id).then((result: User | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    const updatedUser: User = req.body;
    await this.userService.updateUser(id, updatedUser).then((result: User | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    await this.userService.deleteUser(id).then(() => {
      sendSuccess(req, res);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }
}
