import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productsService';
import { IProduct } from '../models/productModel';
import AppError from '../utils/appError.errorHandler';
import { StatusCodes } from 'http-status-codes';

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productData: Partial<IProduct> = req.body;
    const newProduct = await productService.createProduct(productData);
    res.status(201).json({ message: 'Product created successfully', data: newProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const productData: Partial<IProduct> = req.body;
    const updatedProduct = await productService.updateProduct(productId, productData);

    if (!updatedProduct) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND)
    }

    res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const deleted = await productService.deleteProduct(productId);

    if (!deleted) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);

    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }

    res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { filters, projections, options } = req.body;
    const products = await productService.getAllProducts(filters, projections, options);
    res.status(200).json({ data: products });
  } catch (error) {
    next(error);
  }
};
