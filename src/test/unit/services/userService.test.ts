import 'reflect-metadata';
import { User } from "../../../entities/users";
import { userRepository } from "../../../respositories/userRepository";
import { UserService } from "../../../services/userService";
import { CreateUserDto } from "../../../types/userDto";

jest.mock('../../../respositories/userRepository');

describe('UserService', () => {
  let userService: UserService;

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

  const mockUpdatedUser: User = {
    id: 5,
    firstName: 'Loganathan',
    lastName: 'Paramashivam',
    email: 'lognathparamashivam@gmail.com',
    mobileNo: '9965861660',
    imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJw0SrJU8rFEKH-2-3EPV9Abeww-z2n2mSy4gNHfwOeOPY=s96-c',
    events: [],
    invitations: []
  };

  beforeEach(() => {
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userDto: CreateUserDto = mockUser;
 
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser(userDto);

      expect(result).toEqual(mockUser);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      (userRepository.find as jest.Mock).mockResolvedValue([mockUser]);

      const result = await userService.getUsers();

      expect(result).toEqual([mockUser]);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(5);

      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserById(5)).rejects.toThrowError('User not found');
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.findByEmail('lognathparamashivam@gmail.com');

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.save as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUser(5, { firstName: 'Loganathan', mobileNo: '9965861660' });

      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error if user not found', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(userService.updateUser(5, { firstName: 'Loganathan', mobileNo: '9965861660' })).rejects.toThrowError('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      await userService.deleteUser(5);

      expect(userRepository.delete).toHaveBeenCalledWith(5);
    });

    it('should throw error if user not found', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(userService.deleteUser(5)).rejects.toThrowError('User not found');
    });
  });

});
