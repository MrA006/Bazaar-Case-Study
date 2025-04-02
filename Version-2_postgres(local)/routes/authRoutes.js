import express from 'express'
import { disableUser, enableUser, getAllUsers, loginUser, logoutUser, registerUser } from '../controllers/authController.js';

const router = express.Router();


router.get('/allusers', getAllUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/disableuser', disableUser);
router.post('/enableuser', enableUser);
router.post('/registeruser', registerUser);


export default router;