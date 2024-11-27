import mongoose, { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IProduct {
    productId: string;
    name: string;
    price: number;
    description?: string;
    category?: string;
    stock?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const ProductSchema: Schema = new Schema(
    {
        productId: { type: String, required: true, default: nanoid() },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        category: { type: String },
        stock: { type: Number, default: 0 },
    },
    {
        timestamps: true
    }
);

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
