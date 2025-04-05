import express from 'express';
import { addStore, getAllStores } from '../controllers/storeController.js';
import { authMiddleware, RoleCheckMiddleware } from '../middleware/middleware.js';

const router = express.Router();

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Get all stores
 *     security:
 *       - cookieAuth: []
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: List of all stores.
 */
router.get('/', authMiddleware, getAllStores);

/**
 * @swagger
 * /stores/addstore:
 *   post:
 *     summary: Add a new store
 *     security:
 *       - cookieAuth: []
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Store added successfully.
 */
router.post('/addstore', authMiddleware, RoleCheckMiddleware("admin"), addStore);

export default router;
