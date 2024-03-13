import express from 'express';
import { UserController } from '../controllers/users';
import { checkAuthorization } from '../middleware/authenticateToken';
import { container } from 'tsyringe';

const router = express.Router();
const userController = container.resolve(UserController);


router.post('/', userController.createUser.bind(userController));
router.get('/', userController.getUsers.bind(userController));
router.get('/:userId', userController.getUserById.bind(userController));
router.patch('/:userId', checkAuthorization, userController.updateUser.bind(userController));
router.delete('/:userId', checkAuthorization, userController.deleteUser.bind(userController));


export default router;
