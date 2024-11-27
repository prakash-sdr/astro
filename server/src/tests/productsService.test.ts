import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { ProductModel, IProduct } from '../models/productModel';
import { productService } from '../services/productsService';
import AppError from '../utils/appError.errorHandler';
import { StatusCodes } from 'http-status-codes';

jest.mock('../models/productModel');

describe('ProductService', () => {
    const mockProduct: IProduct = {
        productId: 'testId',
        name: 'Test Product',
        price: 100,
        description: 'Test Description'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        it('should create a product successfully', async () => {
            const saveMock = jest.fn().mockResolvedValueOnce(mockProduct);
            (ProductModel as unknown as jest.Mock).mockImplementation(() => ({
                save: saveMock
            }));
            (ProductModel.findOne as jest.Mock).mockResolvedValueOnce(null);

            const result = await productService.createProduct(mockProduct);

            expect(ProductModel.findOne).toHaveBeenCalledWith({
                name: mockProduct.name,
                productId: { $ne: undefined }
            });
            expect(result).toEqual(mockProduct);
        });

        it('should throw error if product name already exists', async () => {
            (ProductModel.findOne as jest.Mock).mockResolvedValueOnce(mockProduct);

            await expect(productService.createProduct(mockProduct)).rejects.toThrow(
                new AppError('Failed to create product: A product with the same name already exists', StatusCodes.BAD_REQUEST)
            );
        });

        it('should throw error if product name is empty', async () => {
            const invalidProduct = { ...mockProduct, name: '' };

            await expect(productService.createProduct(invalidProduct)).rejects.toThrow(
                new AppError('Failed to create product: Product name is required', StatusCodes.BAD_REQUEST)
            );
        });

        it('should throw error if price is invalid', async () => {
            const invalidProduct = { ...mockProduct, price: -1 };

            await expect(productService.createProduct(invalidProduct)).rejects.toThrow(
                new AppError('Failed to create product: Product price must be a positive number', StatusCodes.BAD_REQUEST)
            );
        });
    });

    describe('updateProduct', () => {
        it('should update a product successfully', async () => {
            const updatedProduct = { ...mockProduct, name: 'Updated Name' };
            const updateData = { name: 'Updated Name', price: 150 };

            (ProductModel.findOne as jest.Mock).mockResolvedValueOnce(null);
            (ProductModel.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(updatedProduct);

            const result = await productService.updateProduct(mockProduct.productId, updateData);

            expect(ProductModel.findOneAndUpdate).toHaveBeenCalledWith(
                { productId: mockProduct.productId },
                updateData,
                { new: true, runValidators: true }
            );
            expect(result).toEqual(updatedProduct);
        });

        it('should throw error if updating to existing product name', async () => {
            (ProductModel.findOne as jest.Mock).mockResolvedValueOnce(mockProduct);

            await expect(
                productService.updateProduct('differentId', {
                    name: 'Existing Name',
                    price: 200
                })
            ).rejects.toThrow(
                new AppError('Failed to update product: A product with the same name already exists', StatusCodes.BAD_REQUEST)
            );
        });

        it('should update without validation if only updating description', async () => {
            const updateData = { description: 'New description' };
            const updatedProduct = { ...mockProduct, ...updateData };

            (ProductModel.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(updatedProduct);

            const result = await productService.updateProduct(mockProduct.productId, updateData);

            expect(ProductModel.findOneAndUpdate).toHaveBeenCalledWith(
                { productId: mockProduct.productId },
                updateData,
                { new: true, runValidators: true }
            );
            expect(result).toEqual(updatedProduct);
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product successfully', async () => {
            (ProductModel.findOneAndDelete as jest.Mock).mockResolvedValueOnce(mockProduct);

            const result = await productService.deleteProduct(mockProduct.productId);

            expect(ProductModel.findOneAndDelete).toHaveBeenCalledWith({
                productId: mockProduct.productId
            });
            expect(result).toBe(true);
        });

        it('should return false when product not found', async () => {
            (ProductModel.findOneAndDelete as jest.Mock).mockResolvedValueOnce(null);

            const result = await productService.deleteProduct('nonexistentId');

            expect(result).toBe(false);
        });
    });

    describe('getProductById', () => {
        it('should get a product by id successfully', async () => {
            (ProductModel.findOne as jest.Mock).mockResolvedValueOnce(mockProduct);

            const result = await productService.getProductById(mockProduct.productId);

            expect(ProductModel.findOne).toHaveBeenCalledWith({
                productId: mockProduct.productId
            });
            expect(result).toEqual(mockProduct);
        });

        it('should return null when product not found', async () => {
            (ProductModel.findOne as jest.Mock).mockResolvedValueOnce(null);

            const result = await productService.getProductById('nonexistentId');

            expect(result).toBeNull();
        });
    });

    describe('getAllProducts', () => {
        it('should get all products with default parameters', async () => {
            const mockProducts = [mockProduct];
            (ProductModel.find as jest.Mock).mockResolvedValueOnce(mockProducts);

            const result = await productService.getAllProducts();

            expect(ProductModel.find).toHaveBeenCalledWith({}, undefined, undefined);
            expect(result).toEqual(mockProducts);
        });

        it('should get products with filters, projections and options', async () => {
            const mockProducts = [mockProduct];
            const filters: FilterQuery<IProduct> = { price: { $gt: 50 } };
            const projections: ProjectionType<IProduct> = { name: 1, price: 1 };
            const options: QueryOptions<IProduct> = { sort: { price: 1 } };

            (ProductModel.find as jest.Mock).mockResolvedValueOnce(mockProducts);

            const result = await productService.getAllProducts(filters, projections, options);

            expect(ProductModel.find).toHaveBeenCalledWith(filters, projections, options);
            expect(result).toEqual(mockProducts);
        });
    });
});