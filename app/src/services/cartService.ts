import axios from 'axios';
import { Cart } from '../types/cart';

const API_BASE_URL = 'http://localhost:3000/api/products-server/carts';

export class CartService {

    static async getCartById(cartId: string): Promise<Cart | null> {
        try {
            const response = await axios.get(`${API_BASE_URL}/${cartId}`);
            const apiResponse = response.data.data;
            return apiResponse.data;
        } catch (error: any) {
            throw new Error(`${error?.response?.data?.message}`)
        }
    }

    static async appendCart(cart: Cart): Promise<Cart | null> {
        try {
            const response = await axios.put(API_BASE_URL, cart);
            const apiResponse = response.data.data;
            return apiResponse.data;
        } catch (error: any) {
            throw new Error(`${error?.response?.data?.message}`)
        }
    }

    static async deleteCart(cartId: string): Promise<boolean> {
        try {
            await axios.delete(`${API_BASE_URL}/${cartId}`);
            return true;
        } catch (error: any) {
            throw new Error(`${error?.response?.data?.message}`)
        }
    }
}