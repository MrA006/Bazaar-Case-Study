
import express from 'express'
import {getAllOperations, performOperation} from '../controllers/stockMovementController.js'

const router = express.Router();

router.get('/', getAllOperations);

router.get('/perform_operation', performOperation);




export default router;