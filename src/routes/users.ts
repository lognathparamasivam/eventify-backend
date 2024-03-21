import express from 'express';
import { UserController } from '../controllers/users';
import { checkAuthorization } from '../middleware/authenticateToken';
import { container } from 'tsyringe';

const router = express.Router();
const userController = container.resolve(UserController);

router.post('/', userController.createUser.bind(userController));

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', userController.getUsers.bind(userController));
/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     description: Retrieve a user by their ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to retrieve
 *     responses:
 *       200:
 *         description: A object of user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:userId', userController.getUserById.bind(userController));
/**
 * @swagger
 * /api/v1/users/{userId}:
 *   patch:
 *     summary: Update a user by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     description: Update a user's information by their ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/updateRequest'
 *     responses:
 *       200:
 *         description: A object of user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.patch('/:userId', checkAuthorization, userController.updateUser.bind(userController));
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     description: Endpoint to delete a user by ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/successResponse'
 *       404:
 *         description: User not found
 */
router.delete('/:userId', checkAuthorization, userController.deleteUser.bind(userController));


export default router;
