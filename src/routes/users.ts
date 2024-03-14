import express from 'express';
import { UserController } from '../controllers/users';
import { checkAuthorization } from '../middleware/authenticateToken';
import { container } from 'tsyringe';

const router = express.Router();
const userController: UserController = container.resolve(UserController);


router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', checkAuthorization, userController.updateUser);
router.delete('/:id', checkAuthorization, userController.deleteUser);


export default router;
