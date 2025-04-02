
import express from 'express'
import { addProduct, getFilteredProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getFilteredProducts);

router.get('/additem', addProduct);



export default router;