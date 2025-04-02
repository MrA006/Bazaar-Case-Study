
import express from 'express'
import { addStore, getAllStores } from '../controllers/storeController.js';

const router = express.Router();

router.get('/', getAllStores);

router.get('/addstore', addStore);

export default router;