import { Product } from "./product";

export interface CartItem extends Product {
    quantity: number;
}

export interface Cart {
    cartId: string;
    products: CartItem[]
}