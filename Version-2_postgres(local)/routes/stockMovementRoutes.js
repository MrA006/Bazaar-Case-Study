
import express from 'express'
import {getAllOperations, performOperation} from '../controllers/stockMovementController.js'
import { authMiddleware, RoleCheckMiddleware } from '../middleware/middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllOperations);

router.post('/perform_operation', authMiddleware, RoleCheckMiddleware("admin", "store_manager"), performOperation);




export default router;