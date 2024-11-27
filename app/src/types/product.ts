import { z } from 'zod';

export const ProductSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  category: z.string().optional(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0, "Stock cannot be negative")
});

export type Product = z.infer<typeof ProductSchema>;
