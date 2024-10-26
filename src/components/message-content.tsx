// components/MessageContent.tsx
import { Product } from '@/types';
import { ProductCard } from './product-card';

interface MessageContentProps {
  message: {
    type: string;
    content?: string;
    textContent?: string;
    products?: Product[];
  };
}

export const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
  if (message.type === 'products' && message.products) {
    return (
      <div className="w-full space-y-4">
        <p className="text-gray-800 mb-4">{message.textContent}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {message.products.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      </div>
    );
  }

  return <div>{message.content}</div>;
};

