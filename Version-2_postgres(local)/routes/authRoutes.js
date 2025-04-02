import express from 'express'
import { disableUser, enableUser, getAllUsers, loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import { authMiddleware, RoleCheckMiddleware } from '../middleware/middleware.js';

const router = express.Router();


router.get('/allusers', authMiddleware, RoleCheckMiddleware("admin"), getAllUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/disableuser',authMiddleware, RoleCheckMiddleware("admin"), disableUser);
router.post('/enableuser',authMiddleware, RoleCheckMiddleware("admin"), enableUser);
router.post('/registeruser', authMiddleware, RoleCheckMiddleware("admin", "store_manager"), registerUser);


export default router;