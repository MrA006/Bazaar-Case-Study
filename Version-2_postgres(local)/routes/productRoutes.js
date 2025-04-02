
import express from 'express'
import { addProduct, getFilteredProducts } from '../controllers/productController.js';
import { authMiddleware, RoleCheckMiddleware } from '../middleware/middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getFilteredProducts);

router.post('/additem', authMiddleware, RoleCheckMiddleware("admin","store_manager"), addProduct);



export default router;