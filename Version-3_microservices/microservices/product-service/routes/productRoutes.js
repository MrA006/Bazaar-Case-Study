import express from 'express';
import { addProduct, getFilteredProducts } from '../controllers/productController.js';
import { authMiddleware, RoleCheckMiddleware } from '../middleware/middleware.js';

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get filtered products
 *     security:
 *       - cookieAuth: []
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: searchName
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *         description: Filter by store ID
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["2024-01-01", "2024-12-31"]
 *         description: Filter by creation date range
 *     responses:
 *       200:
 *         description: List of filtered products
 *       400:
 *         description: Invalid request parameters
 */
router.get('/', authMiddleware, getFilteredProducts);

/**
 * @swagger
 * /products/additem:
 *   post:
 *     summary: Add a new product
 *     security:
 *       - cookieAuth: []
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Product"
 *               description:
 *                 type: string
 *                 example: "This is a new product."
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Missing required fields or invalid request
 */
router.post('/additem', authMiddleware, RoleCheckMiddleware("admin", "store_manager"), addProduct);

export default router;
