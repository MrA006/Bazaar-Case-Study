import express from 'express';
import { getAllOperations, performOperation } from '../controllers/stockMovementController.js';
import { authMiddleware, RoleCheckMiddleware } from '../middleware/middleware.js';

const router = express.Router();

/**
 * @swagger
 * /operations:
 *   get:
 *     summary: Get all stock movements
 *     security:
 *       - cookieAuth: []
 *     tags: [Stock Movement]
 *     responses:
 *       200:
 *         description: List of all stock movements.
 */
router.get('/', authMiddleware, getAllOperations);

/**
 * @swagger
 * /operations/perform_operation:
 *   post:
 *     summary: Perform a stock movement operation
 *     security:
 *       - cookieAuth: []
 *     tags: [Stock Movement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 5
 *               type:
 *                 type: string
 *                 enum: [stock_in, sold, removed, returned]
 *                 example: stock_in
 *               store_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Operation performed successfully.
 *       400:
 *         description: Invalid request parameters.
 */
router.post('/perform_operation', authMiddleware, RoleCheckMiddleware("admin", "store_manager"), performOperation);

export default router;
