import request from 'supertest';
import app from '../../app'; // Import your Express app instance
import { User } from '../../entities/users'; // Import your User entity or model
import { UserService } from '../../services/UserService';
import properties from '../../properties';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../../utils/ErrorResponse';

jest.mock('../../services/UserService');


describe.skip('User Routes Integration Tests', () => {
  const mockUser: User = {
    id: 5,
    firstName: 'Lognath',
    lastName: 'Paramashivam',
    email: 'lognathparamashivam@gmail.com',
    mobileNo: '',
    imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJw0SrJU8rFEKH-2-3EPV9Abeww-z2n2mSy4gNHfwOeOPY=s96-c',
    createdAt: null,
    updatedAt: null,
  };

  const mockUpdatedUser: User = {
    id: 5,
    firstName: 'Loganathan',
    lastName: 'Paramashivam',
    email: 'lognathparamashivam@gmail.com',
    mobileNo: '',
    imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJw0SrJU8rFEKH-2-3EPV9Abeww-z2n2mSy4gNHfwOeOPY=s96-c',
    createdAt: null,
    updatedAt: null,
  };

  const token = jwt.sign({ user_id: mockUser.id, email: mockUser.email, }, properties.secretKey, { expiresIn: '15m' });

  it('POST /users should create a new user', async () => {
      const createUserMock = jest.spyOn(UserService.prototype, 'createUser').mockResolvedValue(mockUser);


      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send(mockUser);

      expect(createUserMock).toHaveBeenCalledWith(mockUser);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockUser });
  });

  it('should handle error while creating user', async () => {
    const mockError = new ErrorResponse(500,'User creation failed');
    const createUserMock = jest.spyOn(UserService.prototype, 'createUser').mockRejectedValue(mockError);

    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(createUserMock).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: {error: true, message: 'User creation failed',path: '/api/v1/users'} });
  });

  it('GET /users should retrieve all users', async () => {
    const mockUsers = [mockUser]
    const getUsersMock = jest.spyOn(UserService.prototype, 'getUsers').mockResolvedValue(mockUsers);

    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(getUsersMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: mockUsers });
  });

  it('GET /users/:id should retrieve a user by ID', async () => {
    const userId = 1;
    const getUserByIdMock = jest.spyOn(UserService.prototype, 'getUserById').mockResolvedValue(mockUser);

    const response = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getUserByIdMock).toHaveBeenCalledWith(userId);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: mockUser });
  });

  it('PATCH /users/:id should update a user successfully', async () => {
    const userId = 5;
    const updateUserMock = jest.spyOn(UserService.prototype, 'updateUser').mockResolvedValue(mockUpdatedUser);

    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(mockUpdatedUser);

    expect(updateUserMock).toHaveBeenCalledWith(userId, mockUpdatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: mockUpdatedUser });
  });

  it('PATCH /users/:id should handle error while updating user', async () => {
    const userId = 5;
    const mockError = new ErrorResponse(500, 'Failed to update user');
    const updateUserMock = jest.spyOn(UserService.prototype, 'updateUser').mockRejectedValue(mockError);

    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(mockUpdatedUser);

    expect(updateUserMock).toHaveBeenCalledWith(userId, mockUpdatedUser);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: { error: true, message: 'Failed to update user', path: `/api/v1/users` } });
  });
});



