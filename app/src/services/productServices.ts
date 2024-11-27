import axios from 'axios';
import { Product, ProductSchema } from '../types/product';

const API_BASE_URL = 'http://localhost:3000/api/products-server/products';

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/fetch`);
      const apiResponse = response.data.data;
      return apiResponse.data.map((product: Product) => ProductSchema.parse(product));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      const apiResponse = response.data.data;
      return ProductSchema.parse(apiResponse.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }

  static async createProduct(product: Product): Promise<Product | null> {
    try {
      const validatedProduct = ProductSchema.parse(product);
      const response = await axios.post(API_BASE_URL, validatedProduct);
      const apiResponse = response.data.data;
      return ProductSchema.parse(apiResponse.data);
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  static async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, product);
      const apiResponse = response.data.data;
      return ProductSchema.parse(apiResponse.data);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      return null;
    }
  }

  static async deleteProduct(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return false;
    }
  }
}