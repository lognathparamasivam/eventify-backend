import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import { UserService } from '../../services/userService';
import { UserController } from '../../controllers/users';
import { User } from '../../entities/users';
import express from 'express';
import userRoutes from '../../routes/users';

const app = express();


describe.skip('UserController Integration Test', () => {
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


  beforeAll(() => {
app.use('/api/v1/users', userRoutes)
app.listen(3000)
    container.register<UserService>('UserService', { useClass: UserService });
    container.register<UserController>('UserController', { useClass: UserController });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe.skip('GET /users', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [mockUser];

      jest.spyOn(UserService.prototype, 'getUsers').mockResolvedValue(mockUsers);

      await request(app).get('/').then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUsers);

      })
    });
  });

});
