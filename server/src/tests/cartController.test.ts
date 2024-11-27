import { Request, Response, NextFunction } from 'express';
import { appendCart, deleteCart, getCart } from '../controllers/cartController';
import { cartService } from '../services/cartService';

jest.mock('../services/cartService');

describe('Cart Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe('appendCart', () => {
        const mockCartData = {
            items: [{ productId: 'prod1', quantity: 2 }],
            userId: 'user1',
        };

        const mockCreatedCart = {
            _id: 'mockCartId',
            ...mockCartData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        beforeEach(() => {
            mockRequest = { body: mockCartData };
        });

        it('should create a cart successfully', async () => {
            (cartService.appendCart as jest.Mock).mockResolvedValueOnce(mockCreatedCart);

            await appendCart(mockRequest as Request, mockResponse as Response, mockNext);

            expect(cartService.appendCart).toHaveBeenCalledWith(mockCartData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Cart created successfully',
                data: mockCreatedCart,
            });
        });

        it('should handle errors and pass them to next middleware', async () => {
            const error = new Error('Service error');
            (cartService.appendCart as jest.Mock).mockRejectedValueOnce(error);

            await appendCart(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteCart', () => {
        const mockCartId = 'mockCartId';

        beforeEach(() => {
            mockRequest = { params: { cartId: mockCartId } };
        });

        it('should delete a cart successfully', async () => {
            (cartService.deleteCart as jest.Mock).mockResolvedValueOnce(true);

            await deleteCart(mockRequest as Request, mockResponse as Response, mockNext);

            expect(cartService.deleteCart).toHaveBeenCalledWith(mockCartId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Cart deleted successfully',
            });
        });

        it('should handle errors and pass them to next middleware', async () => {
            const error = new Error('Service error');
            (cartService.deleteCart as jest.Mock).mockRejectedValueOnce(error);

            await deleteCart(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getCart', () => {
        const mockCartId = 'mockCartId';
        const mockCart = {
            _id: mockCartId,
            items: [{ productId: 'prod1', quantity: 2 }],
            userId: 'user1',
        };

        beforeEach(() => {
            mockRequest = { params: { cartId: mockCartId } };
        });

        it('should retrieve a cart successfully', async () => {
            (cartService.getCart as jest.Mock).mockResolvedValueOnce(mockCart);

            await getCart(mockRequest as Request, mockResponse as Response, mockNext);

            expect(cartService.getCart).toHaveBeenCalledWith(mockCartId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Cart fetched successfully',
                data: mockCart,
            });
        });

        it('should return an empty object if no cart is found', async () => {
            (cartService.getCart as jest.Mock).mockResolvedValueOnce(null);

            await getCart(mockRequest as Request, mockResponse as Response, mockNext);

            expect(cartService.getCart).toHaveBeenCalledWith(mockCartId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Cart fetched successfully',
                data: {},
            });
        });

        it('should handle errors and pass them to next middleware', async () => {
            const error = new Error('Service error');
            (cartService.getCart as jest.Mock).mockRejectedValueOnce(error);

            await getCart(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
