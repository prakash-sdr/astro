import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';
import { Cart, CartItem } from '../types/cart';
import { CartService } from '../services/cartService';
import { generateCartId } from '../utils/helpers'

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  syncCartWithServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add to cart
      addToCart: async (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.productId === product.productId);

        const updatedItems = existingItem
          ? currentItems.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
          : [...currentItems, { ...product, quantity: 1 }];

        try {
          const cart: Cart = { cartId: generateCartId(), products: updatedItems }; // Replace `cartId` with actual ID logic
          await CartService.appendCart(cart);
          set({ items: updatedItems }); // Update store only after backend sync succeeds
        } catch (error: any) {
          throw new Error(String(error.message));
        }
      },

      // Remove from cart
      removeFromCart: async (productId) => {
        const currentItems = get().items;
        const updatedItems = currentItems.filter((item) => item.productId !== productId);

        try {
          if (updatedItems?.length) {
            const cart: Cart = { cartId: generateCartId(), products: updatedItems }; // Replace `cartId` with actual ID logic
            await CartService.appendCart(cart);
            set({ items: updatedItems }); // Update store only after backend sync succeeds
          } else {
            const cartId = generateCartId(); // Replace `cartId` with actual ID logic
            await CartService.deleteCart(cartId);
            set({ items: [] })
          }
        } catch (error: any) {
          throw new Error(String(error.message));
        }
      },

      // Update quantity
      updateQuantity: async (productId, quantity) => {
        const currentItems = get().items;
        const updatedItems = currentItems
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, quantity) } // Ensure quantity is at least 1
              : item
          )
          .filter((item) => item.quantity > 0); // Remove items with quantity <= 0

        try {
          if (updatedItems.length) {
            const cart: Cart = { cartId: generateCartId(), products: updatedItems }; // Replace `cartId` with actual ID logic
            await CartService.appendCart(cart);
          } else {
            const cartId = generateCartId(); // Replace `cartId` with actual ID logic
            await CartService.deleteCart(cartId);
            set({ items: [] })
          }
          set({ items: updatedItems }); // Update store only after backend sync succeeds
        } catch (error: any) {
          throw new Error(String(error.message));
        }
      },

      // Clear cart
      clearCart: async () => {
        try {
          const cartId = generateCartId(); // Replace `cartId` with actual ID logic
          await CartService.deleteCart(cartId);
          set({ items: [] }); // Update store only after backend sync succeeds
        } catch (error: any) {
          throw new Error(String(error.message));
        }
      },

      // Get total price
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Sync cart with server on load or periodically
      syncCartWithServer: async () => {
        try {
          const cart = await CartService.getCartById(generateCartId()); // Replace `cartId` with actual ID logic
          if (cart?.products) {
            set({ items: cart.products });
          } else {
            set({ items: [] })
          }
        } catch (error: any) {
          throw new Error(String(error.message));
        }
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
);
