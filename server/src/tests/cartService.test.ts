import { CartModel, ICart } from "../models/cartModel";
import { ProductModel } from "../models/productModel";
import { cartService } from "../services/cartService";
import AppError from "../utils/appError.errorHandler";
import { StatusCodes } from "http-status-codes";

jest.mock("../models/cartModel");
jest.mock("../models/productModel");

describe('CartService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('appendCart', () => {
        const mockCartDto: ICart = {
            cartId: "mockCartId",
            products: [
                { productId: "prod1", name: "Product 1", quantity: 3, price: 120 },
                { productId: "prod2", name: "Product 2", quantity: 5, price: 140 }
            ],
        };

        it('should throw an error if products are empty', async () => {
            await expect(cartService.appendCart({ cartId: "mockCartId", products: [] }))
                .rejects.toThrow(new AppError('Products cannot be empty', StatusCodes.BAD_REQUEST));
        });

        it('should throw an error if a product does not exist', async () => {
            (ProductModel.findOne as jest.Mock).mockResolvedValueOnce(null);

            await expect(cartService.appendCart(mockCartDto))
                .rejects.toThrow(new AppError('Product not found', StatusCodes.BAD_REQUEST));
        });

        it('should throw an error if product quantity exceeds stock', async () => {
            const mockCartDto: ICart = {
                cartId: 'mockCartId',
                products: [
                    { productId: 'prod1', name: 'Product 1', quantity: 5, price: 120 },
                ],
            };

            const mockProductDetail = { productId: 'prod1', stock: 2 };

            (ProductModel.findOne as jest.Mock).mockResolvedValueOnce(mockProductDetail);
            (CartModel.findOne as jest.Mock).mockResolvedValueOnce(null); // No existing cart

            await expect(cartService.appendCart(mockCartDto)).rejects.toThrow(
                new AppError('Product 1 has only 2 stocks', StatusCodes.BAD_REQUEST)
            );

            expect(ProductModel.findOne).toHaveBeenCalledWith(
                { productId: 'prod1' },
                { stock: 1 }
            );
        });

        it('should create a new cart if it does not exist', async () => {
            (CartModel.findOne as jest.Mock).mockResolvedValueOnce(null);
            (ProductModel.findOne as jest.Mock)
                .mockResolvedValueOnce({ productId: "prod1", stock: 10 })
                .mockResolvedValueOnce({ productId: "prod2", stock: 10 });

            const result = await cartService.appendCart(mockCartDto);

            expect(CartModel.create).toHaveBeenCalledWith(mockCartDto);
            expect(result).toEqual(mockCartDto);
        });

        it('should delete an empty cart and throw an error', async () => {
            const mockProductDetails = [
                { productId: "prod1", stock: 0 },
                { productId: "prod2", stock: 0 }
            ];
            const mockExistingCart = { cartId: "mockCartId", products: [] };

            (CartModel.findOne as jest.Mock).mockResolvedValueOnce(mockExistingCart);
            (ProductModel.findOne as jest.Mock)
                .mockResolvedValueOnce(mockProductDetails[0])
                .mockResolvedValueOnce(mockProductDetails[1]);

            await expect(cartService.appendCart(mockCartDto))
                .rejects.toThrow(new AppError('Products cannot be empty', StatusCodes.BAD_REQUEST));

            expect(CartModel.findOneAndDelete).toHaveBeenCalledWith({ cartId: mockCartDto.cartId });
        });
    });

    describe('deleteCart', () => {
        it('should delete a cart successfully', async () => {
            (CartModel.findOneAndDelete as jest.Mock).mockResolvedValueOnce(true);

            const result = await cartService.deleteCart('mockCartId');

            expect(CartModel.findOneAndDelete).toHaveBeenCalledWith({ cartId: 'mockCartId' });
            expect(result).toBe(true);
        });

        it('should return null if no cart is found', async () => {
            (CartModel.findOneAndDelete as jest.Mock).mockResolvedValueOnce(null);

            const result = await cartService.deleteCart('nonExistentCartId');

            expect(CartModel.findOneAndDelete).toHaveBeenCalledWith({ cartId: 'nonExistentCartId' });
            expect(result).toBe(null);
        });
    });

    describe('getCart', () => {
        it('should return a cart if found', async () => {
            const mockCart = { cartId: 'mockCartId', products: [] };

            (CartModel.findOne as jest.Mock).mockResolvedValueOnce(mockCart);

            const result = await cartService.getCart('mockCartId');

            expect(CartModel.findOne).toHaveBeenCalledWith({ cartId: 'mockCartId' });
            expect(result).toEqual(mockCart);
        });

        it('should return null if no cart is found', async () => {
            (CartModel.findOne as jest.Mock).mockResolvedValueOnce(null);

            const result = await cartService.getCart('nonExistentCartId');

            expect(CartModel.findOne).toHaveBeenCalledWith({ cartId: 'nonExistentCartId' });
            expect(result).toBe(null);
        });
    });
});
