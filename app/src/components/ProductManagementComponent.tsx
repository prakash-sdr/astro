import React, { useState, useEffect } from 'react';
import { ProductService } from '../services/productServices';
import { Product, ProductSchema } from '../types/product';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const fetchedProducts = await ProductService.getAllProducts();
    setProducts(fetchedProducts);
  };

  const handleCreateProduct = async () => {
    try {
      const createdProduct = await ProductService.createProduct(newProduct as Product);
      if (createdProduct) {
        fetchProducts();
        setNewProduct({ name: '', description: '', price: 0, stock: 0 });
      }
    } catch (error) {
      console.error('Failed to create product', error);
    }
  };

  const handleUpdateProduct = async () => {
    if (editProduct?.productId) {
      try {
        await ProductService.updateProduct(editProduct.productId, editProduct);
        fetchProducts();
        setEditProduct(null);
      } catch (error) {
        console.error('Failed to update product', error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      await ProductService.deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Product List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Current Products</h2>
        <div className="space-y-4">
          {products.map(product => (
            <div 
              key={product.productId} 
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setEditProduct(product)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.productId!)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          {editProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form className="space-y-4">
          <input 
            type="text"
            placeholder="Product Name"
            value={editProduct?.name || newProduct.name || ''}
            onChange={(e) => 
              editProduct 
                ? setEditProduct({...editProduct, name: e.target.value})
                : setNewProduct({...newProduct, name: e.target.value})
            }
            className="w-full p-2 border rounded"
          />
          <textarea 
            placeholder="Description"
            value={editProduct?.description || newProduct.description || ''}
            onChange={(e) => 
              editProduct 
                ? setEditProduct({...editProduct, description: e.target.value})
                : setNewProduct({...newProduct, description: e.target.value})
            }
            className="w-full p-2 border rounded"
          />
          <input 
            type="number"
            placeholder="Price"
            value={editProduct?.price || newProduct.price || ''}
            onChange={(e) => 
              editProduct 
                ? setEditProduct({...editProduct, price: parseFloat(e.target.value)})
                : setNewProduct({...newProduct, price: parseFloat(e.target.value)})
            }
            className="w-full p-2 border rounded"
          />
          <input 
            type="number"
            placeholder="Stock"
            value={editProduct?.stock || newProduct.stock || ''}
            onChange={(e) => 
              editProduct 
                ? setEditProduct({...editProduct, stock: parseInt(e.target.value)})
                : setNewProduct({...newProduct, stock: parseInt(e.target.value)})
            }
            className="w-full p-2 border rounded"
          />
          
          {editProduct ? (
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={handleUpdateProduct}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Product
              </button>
              <button 
                type="button"
                onClick={() => setEditProduct(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={handleCreateProduct}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <FaPlus className="inline-block mr-2" />
              Add Product
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;