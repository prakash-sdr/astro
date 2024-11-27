import React, { useEffect, useState } from 'react';
import { useCartStore } from '../stores/cart-store';
import { FaTrash, FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import ErrorAlert from './ErrorAlert';

const CartComponent: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
    syncCartWithServer
  } = useCartStore();

  useEffect(() => {
    const fetchCart = async () => {
      await syncCartWithServer();
    }
    fetchCart()
  }, [syncCartWithServer]);

  const [error, setError] = useState<string | null>(null);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      setError(null);
      await removeFromCart(productId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      setError(null);
      await updateQuantity(productId, quantity);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleClearCart = async () => {
    try {
      setError(null);
      await clearCart();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (items?.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {error && <ErrorAlert message={error} onClose={handleCloseError} />}
      <div className="grid gap-4">
        {items.map(item => (
          <div
            key={item.productId}
            className="flex items-center justify-between bg-white shadow-md rounded-lg p-4"
          >
            <div className="flex items-center space-x-4">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdateQuantity(item.productId!, Math.max(1, item.quantity - 1))}
                  className="text-gray-600 hover:text-red-500"
                >
                  <FaMinusCircle />
                </button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.productId!, item.quantity + 1)}
                  className="text-gray-600 hover:text-green-500"
                >
                  <FaPlusCircle />
                </button>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.productId!)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleClearCart}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Cart
        </button>
        <div className="text-xl font-bold">
          Total: ₹{getTotalPrice().toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
