import { Router } from 'express';
import { appendCart, deleteCart, getCart } from '../controllers/cartController';

const cartRouter = Router();

cartRouter.get('/:cartId', getCart);
cartRouter.put('/', appendCart);
cartRouter.delete('/:cartId', deleteCart);

export default cartRouter;
