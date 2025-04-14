import express from 'express';
import { disableUser, enableUser, getAllUsers, loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import { authMiddleware, RoleCheckMiddleware } from '../middleware/middleware.js';

const router = express.Router();

/**
 * @swagger
 * /auth/allusers:
 *   get:
 *     summary: Get all users
 *     security:
 *       - cookieAuth: []
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of all users.
 */
router.get('/allusers', authMiddleware, RoleCheckMiddleware("admin"), getAllUsers);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Logout successful.
 */
router.post('/logout', logoutUser);

/**
 * @swagger
 * /auth/disableuser:
 *   post:
 *     summary: Disable a user. id OR username is needed but not both.
 *     security:
 *       - cookieAuth: []
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the user to disable.
 *               username:
 *                 type: string
 *                 description: Username of the user to disable.
 *     responses:
 *       200:
 *         description: User disabled successfully.
 */
router.post('/disableuser', authMiddleware, RoleCheckMiddleware("admin"), disableUser);

/**
 * @swagger
 * /auth/enableuser:
 *   post:
 *     summary: Enable a user. id OR username is needed but not both.
 *     security:
 *       - cookieAuth: []
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the user to disable.
 *               username:
 *                 type: string
 *                 description: Username of the user to disable.
 *     responses:
 *       200:
 *         description: User enabled successfully.
 */
router.post('/enableuser', authMiddleware, RoleCheckMiddleware("admin"), enableUser);

/**
 * @swagger
 * /auth/registeruser:
 *   post:
 *     summary: Register a new user. Role IN (viewer, store_manager, admin). NOTE= only admin can change store Manager or add another admin. 
 *     security:
 *       - cookieAuth: []
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               store_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully.
 */
router.post('/registeruser', authMiddleware, RoleCheckMiddleware("admin", "store_manager"), registerUser);

export default router;
