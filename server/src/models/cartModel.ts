import mongoose, { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface ICartItem {
    productId: string;
    name: string;
    price: number;
    description?: string;
    category?: string;
    quantity?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICart {
    cartId: string;
    products: ICartItem[]
}

const CartSchema: Schema = new Schema(
    {
        products: { type: Array<Object>, required: true },
        //need to add userId for customer based code,
        cartId: { type: String, require: true, default: nanoid() }
    },
    {
        timestamps: true
    }
);

export const CartModel = mongoose.model<ICart>('Cart', CartSchema);
