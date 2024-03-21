import 'reflect-metadata';
import { Repository } from "typeorm";
import { User } from "../../../entities/users";
import { UserService } from "../../../services/userService";
import { container } from "tsyringe";

jest.mock('../../../database/datasource', () => ({
  MysqlDataSource: {
    getRepository: jest.fn(),
  },
}));
describe('UserService Unit Test', () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 5,
    firstName: 'Lognath',
    lastName: 'Paramashivam',
    email: 'lognathparamashivam@gmail.com',
    mobileNo: '',
    imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJw0SrJU8rFEKH-2-3EPV9Abeww-z2n2mSy4gNHfwOeOPY=s96-c',
    createdAt: new Date('2024-03-12T04:44:13.000Z'),
    updatedAt: null,
  };

  const mockUpdatedUser: User = {
    id: 5,
    firstName: 'Loganathan',
    lastName: 'Paramashivam',
    email: 'lognathparamashivam@gmail.com',
    mobileNo: '',
    imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJw0SrJU8rFEKH-2-3EPV9Abeww-z2n2mSy4gNHfwOeOPY=s96-c',
    createdAt: new Date('2024-03-12T04:44:13.000Z'),
    updatedAt: null,
  };
  beforeEach(() => {
    userRepositoryMock = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),

    } as unknown as jest.Mocked<Repository<User>>;
    container.register('UserRepository', { useValue: userRepositoryMock });
    userService = container.resolve(UserService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      userRepositoryMock.save.mockResolvedValue(mockUser);

      const result = await userService.createUser(mockUser);

      expect(userRepositoryMock.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);

    });
  });

  describe('getUsers', () => {
    it('should retrieve users successfully', async () => {
      const mockUsers = [mockUser];
      userRepositoryMock.find.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(userRepositoryMock.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

  });

  describe('getUserById', () => {
    it('should retrieve a user by ID successfully', async () => {
      const userId = 1; 
      userRepositoryMock.findOneBy.mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 123;
      userRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(userService.getUserById(userId)).rejects.toThrowError('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userId = 1; 
      userRepositoryMock.findOneBy.mockResolvedValue(mockUser);
      userRepositoryMock.save.mockResolvedValue(mockUser);

      const result = await userService.updateUser(userId, mockUpdatedUser);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(userRepositoryMock.save).toHaveBeenCalledWith({ ...mockUser, ...mockUpdatedUser });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 123; 
      userRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(userService.updateUser(userId, mockUpdatedUser)).rejects.toThrowError('User not found');
    });
  });
});

