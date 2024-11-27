import React, { useState, useEffect } from 'react';
import { ProductService } from '../services/productServices';
import { useCartStore } from '../stores/cart-store';
import { Product } from '../types/product';
import { FaShoppingCart } from 'react-icons/fa';
import ErrorAlert from './ErrorAlert';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // For error handling
  let { addToCart, syncCartWithServer } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await ProductService.getAllProducts();
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setError('Unable to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  },[syncCartWithServer]);

  const handleAddToCart = async (product: Product) => {
    try {
      setError(null);
      await addToCart(product);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };


  if (loading) {
    return <div className="text-center text-xl">Loading products...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      {error && <ErrorAlert message={error} onClose={handleCloseError} />}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {products.map((product) => (
          <div
            key={product.productId}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            {product.imageUrl && (
              <div className="w-full mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <h3 className="text-lg font-semibold mb-2 truncate">
              {product.name}
            </h3>

            <p className="text-gray-600 text-sm mb-4 flex-grow">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-lg font-bold text-green-600">
                ₹{product.price.toFixed(2)}
              </span>

              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
                aria-label="Add to cart"
              >
                <FaShoppingCart className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
