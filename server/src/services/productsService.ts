import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { ProductModel, IProduct } from '../models/productModel';
import { nanoid } from 'nanoid';
import AppError from '../utils/appError.errorHandler';
import { StatusCodes } from 'http-status-codes';
import { handleError } from '../utils/tryCatch.errorHandler';

interface IProductValidator {
    validate(productData: Partial<IProduct>, productIdToExclude?: string): Promise<void>;
}

class ProductValidator implements IProductValidator {
    async validate(productData: Partial<IProduct>, productIdToExclude?: string): Promise<void> {
        if (!productData.name?.trim()) {
            throw new AppError('Product name is required', StatusCodes.BAD_REQUEST);
        }

        if (!productData.price || productData.price <= 0) {
            throw new AppError('Product price must be a positive number', StatusCodes.BAD_REQUEST);
        }

        const existingProduct = await ProductModel.findOne({ 
            name: productData.name.trim(), 
            productId: { $ne: productIdToExclude } 
        });
        if (existingProduct) {
            throw new AppError('A product with the same name already exists', StatusCodes.BAD_REQUEST);
        }
    }
}

class ProductService {
    constructor(
        private productValidator: IProductValidator = new ProductValidator()
    ) {}

    async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        try {
            productData.productId = productData.productId || nanoid();

            await this.productValidator.validate(productData);

            const product = new ProductModel(productData);
            return await product.save();
        } catch (error: unknown) {
            handleError(error, 'Failed to create product', StatusCodes.BAD_REQUEST);
        }
    }

    async updateProduct(productId: string, productData: Partial<IProduct>): Promise<IProduct | null> {
        try {
            if (productData.name || productData.price) {
                await this.productValidator.validate(productData, productId);
            }
            
            return await ProductModel.findOneAndUpdate(
                { productId },
                productData,
                { new: true, runValidators: true },
            );
        } catch (error: unknown) {
            handleError(error, 'Failed to update product', StatusCodes.BAD_REQUEST);
        }
    }

    async deleteProduct(productId: string): Promise<boolean> {
        try {
            const result = await ProductModel.findOneAndDelete({ productId });
            return !!result;
        } catch (error: unknown) {
            handleError(error, 'Failed to delete product', StatusCodes.BAD_REQUEST);
        }
    }

    async getProductById(productId: string): Promise<IProduct | null> {
        try {
            return await ProductModel.findOne({ productId });
        } catch (error: unknown) {
            handleError(error, 'Failed to fetch product', StatusCodes.BAD_REQUEST);
        }
    }

    async getAllProducts(
        filters: FilterQuery<IProduct> = {},
        projections?: ProjectionType<IProduct>,
        options?: QueryOptions<IProduct>,
    ): Promise<IProduct[]> {
        try {
            return await ProductModel.find(filters, projections, options);
        } catch (error: unknown) {
            handleError(error, 'Failed to fetch products', StatusCodes.BAD_REQUEST);
        }
    }
}

export const productService = new ProductService();