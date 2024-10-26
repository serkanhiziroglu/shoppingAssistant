export const ProductCard = ({ product }) => {
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
          <img
            src={product.image || '/api/placeholder/200/200'}
            alt={product.title}
            className="h-48 w-full object-cover object-center"
          />
        </div>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.title}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">
          ${product.price} {product.currency}
        </p>
        {product.condition && (
          <p className="mt-1 text-sm text-gray-500">
            Condition: {product.condition}
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
    );
  };
  