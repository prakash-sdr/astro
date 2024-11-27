import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { productService } from '../services/productsService';
import { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts } from '../controllers/productController';
import AppError from '../utils/appError.errorHandler';

jest.mock('../services/productsService');

describe('Product Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        mockNext = jest.fn();
    });

    describe('createProduct', () => {
        const mockProductData = {
            name: 'Test Product',
            price: 99.99,
            description: 'Test Description'
        };

        const mockCreatedProduct = {
            _id: 'mockId',
            ...mockProductData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        beforeEach(() => {
            mockRequest = {
                body: mockProductData
            };
        });

        it('should create a product successfully', async () => {
            (productService.createProduct as jest.Mock).mockResolvedValueOnce(mockCreatedProduct);

            await createProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(productService.createProduct).toHaveBeenCalledWith(mockProductData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Product created successfully',
                data: mockCreatedProduct
            });
        });

        it('should handle errors and pass to next middleware', async () => {
            const error = new Error('Database error');
            (productService.createProduct as jest.Mock).mockRejectedValueOnce(error);

            await createProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('updateProduct', () => {
        const mockProductId = 'mockId';
        const mockUpdateData = {
            name: 'Updated Product',
            price: 199.99
        };

        const mockUpdatedProduct = {
            _id: mockProductId,
            ...mockUpdateData,
            description: 'Original description',
            updatedAt: new Date()
        };

        beforeEach(() => {
            mockRequest = {
                params: { productId: mockProductId },
                body: mockUpdateData
            };
        });

        it('should update a product successfully', async () => {
            (productService.updateProduct as jest.Mock).mockResolvedValueOnce(mockUpdatedProduct);

            await updateProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(productService.updateProduct).toHaveBeenCalledWith(mockProductId, mockUpdateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Product updated successfully',
                data: mockUpdatedProduct
            });
        });

        it('should handle not found product', async () => {
            (productService.updateProduct as jest.Mock).mockResolvedValueOnce(null);

            await updateProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(AppError)
            );
            const error = mockNext.mock.calls[0][0];
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
            expect(error.message).toBe('Product not found');
        });
    });

    describe('deleteProduct', () => {
        const mockProductId = 'mockId';

        beforeEach(() => {
            mockRequest = {
                params: { productId: mockProductId }
            };
        });

        it('should delete a product successfully', async () => {
            (productService.deleteProduct as jest.Mock).mockResolvedValueOnce(true);

            await deleteProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(productService.deleteProduct).toHaveBeenCalledWith(mockProductId);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('should handle not found product during deletion', async () => {
            (productService.deleteProduct as jest.Mock).mockResolvedValueOnce(false);

            await deleteProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(AppError)
            );
            const error = mockNext.mock.calls[0][0];
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

    describe('getProductById', () => {
        const mockProductId = 'mockId';
        const mockProduct = {
            _id: mockProductId,
            name: 'Test Product',
            price: 99.99
        };

        beforeEach(() => {
            mockRequest = {
                params: { productId: mockProductId }
            };
        });

        it('should retrieve a product successfully', async () => {
            (productService.getProductById as jest.Mock).mockResolvedValueOnce(mockProduct);

            await getProductById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(productService.getProductById).toHaveBeenCalledWith(mockProductId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ data: mockProduct });
        });

        it('should handle not found product', async () => {
            (productService.getProductById as jest.Mock).mockResolvedValueOnce(null);

            await getProductById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(AppError)
            );
            const error = mockNext.mock.calls[0][0];
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

    describe('getAllProducts', () => {
        const mockFilters = { price: { $gt: 50 } };
        const mockProjections = { name: 1, price: 1 };
        const mockOptions = { sort: { price: -1 } };
        const mockProducts = [
            { _id: '1', name: 'Product 1', price: 99.99 },
            { _id: '2', name: 'Product 2', price: 149.99 }
        ];

        beforeEach(() => {
            mockRequest = {
                body: {
                    filters: mockFilters,
                    projections: mockProjections,
                    options: mockOptions
                }
            };
        });

        it('should retrieve all products successfully', async () => {
            (productService.getAllProducts as jest.Mock).mockResolvedValueOnce(mockProducts);

            await getAllProducts(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(productService.getAllProducts).toHaveBeenCalledWith(
                mockFilters,
                mockProjections,
                mockOptions
            );
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ data: mockProducts });
        });

        it('should handle errors in getAllProducts', async () => {
            const error = new Error('Database error');
            (productService.getAllProducts as jest.Mock).mockRejectedValueOnce(error);

            await getAllProducts(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});