// components/ProductCard.tsx
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="h-48 w-full object-cover object-center"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/api/placeholder/200/200';
          }}
        />
      </div>
      <div className="px-2">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm text-gray-500">{product.merchantName || product.source}</p>
          <p className="text-lg font-medium text-gray-900">
            ${product.price.toFixed(2)} {product.currency}
          </p>
        </div>
        
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
          {product.title}
        </h3>
        
        {product.rating !== null && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  className={`${
                    star <= product.rating! ? 'text-yellow-400' : 'text-gray-200'
                  } text-lg`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({product.reviews.toLocaleString()} reviews)
            </span>
          </div>
        )}
        
        {product.shipping && (
          <p className="text-sm text-gray-500 mb-2">
            Shipping: {product.shipping}
          </p>
        )}

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
        >
          View Details
        </a>
      </div>
    </div>
  );
};