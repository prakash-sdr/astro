import { Request, Response, NextFunction } from 'express';
import { ICart } from '../models/cartModel';
import { cartService } from '../services/cartService';

export const appendCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const cartData: ICart = req.body;
        const newCart = await cartService.appendCart(cartData);
        res.status(200).json({ message: 'Cart created successfully', data: newCart });
    } catch (error) {
        next(error);
    }
};

export const deleteCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { cartId } = req.params;
        await cartService.deleteCart(cartId);
        res.status(200).json({ message: 'Cart deleted successfully' })
    } catch (error) {
        next(error)
    }
}

export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { cartId } = req.params;
        const cart = await cartService.getCart(cartId);
        res.status(200).json({ message: 'Cart fetched successfully', data: cart || {} });
    } catch (error) {
        next(error);
    }
};
