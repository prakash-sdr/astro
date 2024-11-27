import { StatusCodes } from "http-status-codes";
import { CartModel, ICart, ICartItem } from "../models/cartModel";
import { IProduct, ProductModel } from "../models/productModel";
import AppError from "../utils/appError.errorHandler";

interface ICartValidator {
    validate(products: Array<ICartItem>): Promise<{
        validatedProducts: Array<ICartItem>;
        errors: string[];
    }>;
}

class StockBasedCartValidator implements ICartValidator {
    async validate(products: Array<ICartItem>) {
        const validatedProducts: Array<ICartItem> = [];
        const errors: string[] = [];

        for (const product of products) {
            const productDetail: IProduct | null = await ProductModel.findOne({ productId: product.productId }, { stock: 1 });

            if (!productDetail) {
                throw new AppError('Product not found', StatusCodes.BAD_REQUEST);
            }

            const availableStock = productDetail.stock || 0;

            if (product.quantity as number > availableStock) {
                if (availableStock > 0) {
                    validatedProducts.push({ 
                        ...product, 
                        quantity: availableStock 
                    });
                }
                errors.push(`${product.name} has only ${availableStock} stocks`);
            } else {
                validatedProducts.push(product);
            }
        }

        return { validatedProducts, errors };
    }
}

class CartService {
    constructor(
        private cartValidator: ICartValidator = new StockBasedCartValidator()
    ) {}

    async appendCart(cartDto: ICart) {
        if (!cartDto || !cartDto.products?.length) {
            throw new AppError('Products cannot be empty', StatusCodes.BAD_REQUEST);
        }

        const existingCart = await CartModel.findOne({ cartId: cartDto.cartId });

        const { validatedProducts, errors } = await this.cartValidator.validate(cartDto.products);

        const cartDetail: ICart = {
            cartId: cartDto.cartId,
            products: validatedProducts
        };

        if (cartDetail.products.length) {
            if (existingCart) {
                await CartModel.findOneAndUpdate({ cartId: cartDetail.cartId }, cartDetail, { new: true });
            } else {
                await CartModel.create(cartDetail);
            }
        } else {
            if (existingCart) {
                await CartModel.findOneAndDelete({ cartId: cartDetail.cartId });
            }
            throw new AppError('Products cannot be empty', StatusCodes.BAD_REQUEST);
        }

        if (errors.length) {
            throw new AppError(errors.join(''), StatusCodes.BAD_REQUEST);
        }

        return cartDetail;
    }

    async deleteCart(cartId: string) {
        return await CartModel.findOneAndDelete({ cartId });
    }

    async getCart(cartId: string) {
        return await CartModel.findOne({ cartId });
    }
}

export const cartService = new CartService();