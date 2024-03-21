import 'reflect-metadata';
import { Request, Response } from 'express';
import { User } from '../../../entities/users';
import { CreateUserDto, UpdateUserDto } from '../../../types/userDto';
import { sendSuccess } from '../../../utils/sendResponse';
import { UserController } from '../../../controllers/users';
import { UserService } from '../../../services/userService';

jest.mock('../../../services/userService');
jest.mock('../../../utils/sendResponse');

describe('UserController', () => {
  let userController: UserController;
  let userServiceMock: jest.Mocked<UserService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  const mockUser: User = {
    id: 5,
    firstName: 'Lognath',
    lastName: 'Paramashivam',
    email: 'lognathparamashivam@gmail.com',
    mobileNo: '',
    imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJw0SrJU8rFEKH-2-3EPV9Abeww-z2n2mSy4gNHfwOeOPY=s96-c',
    events: [],
    invitations: [],
  };

  const mockCreateUserDto: CreateUserDto = {
    firstName: 'Lognath',
    lastName: 'Paramashivam',
    email: 'lognathparamashivam@gmail.com',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    firstName: 'Loganathan',
    mobileNo: '9965861660',
  };

  beforeEach(() => {
    userServiceMock = new UserService() as jest.Mocked<UserService>;
    userController = new UserController(userServiceMock);
    req = {};
    res = {};
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      req.body = mockCreateUserDto;
      userServiceMock.createUser.mockResolvedValue(mockUser);

      await userController.createUser(req as Request, res as Response);

      expect(userServiceMock.createUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockUser);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [mockUser];
      userServiceMock.getUsers.mockResolvedValue(mockUsers);

      await userController.getUsers(req as Request, res as Response);

      expect(userServiceMock.getUsers).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      req.params = { userId: '5' };
      userServiceMock.getUserById.mockResolvedValue(mockUser);

      await userController.getUserById(req as Request, res as Response);

      expect(userServiceMock.getUserById).toHaveBeenCalledWith(5);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      req.params = { userId: '5' };
      req.body = mockUpdateUserDto;
      userServiceMock.updateUser.mockResolvedValue(mockUser);

      await userController.updateUser(req as Request, res as Response);

      expect(userServiceMock.updateUser).toHaveBeenCalledWith(5, mockUpdateUserDto);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      req.params = { userId: '5' };
      userServiceMock.deleteUser.mockResolvedValue(undefined);

      await userController.deleteUser(req as Request, res as Response);

      expect(userServiceMock.deleteUser).toHaveBeenCalledWith(5);
      expect(sendSuccess).toHaveBeenCalledWith(req, res);
    });
  });
});
