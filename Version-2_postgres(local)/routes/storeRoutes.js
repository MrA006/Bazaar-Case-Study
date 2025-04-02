
import express from 'express'
import { addStore, getAllStores } from '../controllers/storeController.js';

const router = express.Router();

router.get('/', getAllStores);

router.post('/addstore', addStore);

export default router;