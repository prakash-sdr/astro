import { Router } from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getProductById } from '../controllers/productController';
import { validateProduct } from '../middlewares/validateProduct';

const productRouter = Router();

productRouter.post('/', validateProduct, createProduct);
productRouter.get('/:productId', getProductById)
productRouter.post('/fetch', getAllProducts);
productRouter.put('/:productId', validateProduct, updateProduct);
productRouter.delete('/:productId', deleteProduct);

export default productRouter;
