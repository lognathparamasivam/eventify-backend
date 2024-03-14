import 'reflect-metadata';
import { Request, Response } from 'express';
import { UserController } from '../../../controllers/users';
import { User } from '../../../entities/users';
import { UserService } from '../../../services/UserService';
import { sendError, sendSuccess } from '../../../utils/sendResponse';
jest.mock('../../../utils/sendResponse');

jest.mock('../../../services/UserService')

describe('UserController Unit Test', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockUser: User = {
    id: 5,
    firstName: 'Lognath',
    lastName: 'Paramashivam',
    email: 'lognathparamashivam@gmails.com',
    mobileNo: '',
    imageUrl: 'dummyUrl',
    createdAt: new Date('2024-03-10T04:44:13.000Z'),
    updatedAt: null,
  };
  const mockUpdatedUser: User = {
    id: 5,
    firstName: 'Loganathan',
    lastName: 'Paramashivam',
    email: 'lognathparamashivam@gmails.com',
    mobileNo: '',
    imageUrl: 'dummyUrl',
    createdAt: new Date('2024-03-10T04:44:13.000Z'),
    updatedAt: new Date('2024-03-12T04:44:13.000Z'),
  };

  beforeEach(() => {
    userController = new UserController();
    mockRequest = {} as Partial<Request>;
    mockResponse = {
      status: jest.fn(() => mockResponse), 
      send: jest.fn(),
    } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createUser', () => {
  it('should create a user', async () => {
   
    const createUserMock = jest.spyOn(UserService.prototype, 'createUser').mockResolvedValue(mockUser);

    mockRequest.body = { id: 5,
      firstName: 'Lognath',
      lastName: 'Paramashivam', };

    await userController.createUser(mockRequest as Request, mockResponse as Response);

    expect(createUserMock).toHaveBeenCalledWith(mockRequest.body);
    expect(sendSuccess).toHaveBeenCalledWith(mockRequest as Request, mockResponse as Response, mockUser);
  });

  it('should handle error while creating user', async () => {
    const mockError = new Error('User creation failed');
    const createUserMock = jest.spyOn(UserService.prototype, 'createUser').mockRejectedValue(mockError);

    mockRequest.body = { id: 5,
      firstName: 'Lognath',
      lastName: 'Paramashivam', };

    await userController.createUser(mockRequest as Request, mockResponse as Response);

    expect(createUserMock).toHaveBeenCalledWith(mockRequest.body);
    expect(sendError).toHaveBeenCalledWith(mockRequest as Request, mockResponse as Response, mockError);
  });
});
  describe('getUsers', () => {
    it('should get users', async () => {
      const mockUsers = [mockUser];
        const getUsersMock = jest.spyOn(UserService.prototype, 'getUsers').mockResolvedValue(mockUsers);
  
        await userController.getUsers(mockRequest as Request, mockResponse as Response);
  
        expect(getUsersMock).toHaveBeenCalled();
        expect(sendSuccess).toHaveBeenCalledWith(mockRequest as Request, mockResponse as Response, mockUsers);
    });
    
    it('should handle error while getting users', async () => {
      const mockError = new Error('Failed to get users');
      const getUsersMock = jest.spyOn(UserService.prototype, 'getUsers').mockRejectedValue(mockError);

      await userController.getUsers(mockRequest as Request, mockResponse as Response);

      expect(getUsersMock).toHaveBeenCalled();
      expect(sendError).toHaveBeenCalledWith(mockRequest as Request, mockResponse as Response, mockError);

    });
  });

  

  describe('getUserBy Id', () => {
  it('should get a user by ID successfully', async () => {
    const userId = 1;
    const getUserByIdMock = jest.spyOn(UserService.prototype, 'getUserById').mockResolvedValue(mockUser);

    mockRequest.params = { id: userId.toString() };

    await userController.getUserById(mockRequest as Request, mockResponse as Response);

    expect(getUserByIdMock).toHaveBeenCalledWith(userId);
    expect(sendSuccess).toHaveBeenCalledWith(mockRequest as Request, mockResponse as Response, mockUser);
  });

  it('should handle error while getting user by ID', async () => {
    const userId = 1;
    const mockError = new Error('Failed to get user by ID');
    const getUserByIdMock = jest.spyOn(UserService.prototype, 'getUserById').mockRejectedValue(mockError);

    mockRequest.params = { id: userId.toString() };

    await userController.getUserById(mockRequest as Request, mockResponse as Response);

    expect(getUserByIdMock).toHaveBeenCalledWith(userId);
    expect(sendError).toHaveBeenCalledWith(mockRequest as Request, mockResponse as Response, mockError);
  });
});

  describe('updateUser', () => {
  it('should update a user successfully', async () => {
    const userId = 1;
    const updateUserMock = jest.spyOn(UserService.prototype, 'updateUser').mockResolvedValue(mockUpdatedUser);

    mockRequest.params = { id: userId.toString() };
    mockRequest.body = { firstName: 'Loganathan' };

    await userController.updateUser(mockRequest as Request, mockResponse as Response);

    expect(updateUserMock).toHaveBeenCalledWith(userId, mockRequest.body);
    expect(sendSuccess).toHaveBeenCalledWith(mockRequest as Request, mockResponse as Response, mockUpdatedUser);
  });

  it('should handle error while updating user', async () => {
    const userId = 1;
    const mockError = new Error('Failed to update user');
    const updateUserMock = jest.spyOn(UserService.prototype, 'updateUser').mockRejectedValue(mockError);

    mockRequest.params = { id: userId.toString() };
    mockRequest.body = { firstName: 'Loganathan' };

    await userController.updateUser(mockRequest as Request, mockResponse as Response);

    expect(updateUserMock).toHaveBeenCalledWith(userId, mockRequest.body);
    expect(sendError).toHaveBeenCalledWith(mockRequest as Request, mockResponse as Response, mockError);
  });

  });
});
