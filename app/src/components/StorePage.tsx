import React from 'react';
import ProductListComponent from './ProductListComponent';
import CartComponent from './CartComponent';

const StorePage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to the Store</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">Products</h2>
          <ProductListComponent />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
          <CartComponent />
        </div>
      </div>
    </div>
  );
};

export default StorePage;
