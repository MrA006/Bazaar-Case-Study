
import express from 'express'
import { addStore, getAllStores } from '../controllers/storeController.js';
import { authMiddleware, RoleCheckMiddleware } from '../middleware/middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllStores);

router.post('/addstore', authMiddleware, RoleCheckMiddleware("admin"), addStore);

export default router;