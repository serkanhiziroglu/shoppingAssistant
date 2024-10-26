import { ProductCard } from './product-card';

export const MessageContent = ({ message }) => {
  if (message.type === 'products') {
    return (
      <div className="w-full space-y-4">
        <p className="text-gray-800 mb-4">{message.textContent}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {message.products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    );
  }

  return <div>{message.content}</div>;
};