// types/index.ts
export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  condition: string;
  url: string;
  image: string;
  description: string;
  source: string;
  rating: number | null;
  reviews: number;
  shipping: string;
  merchantName: string;
}

export interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface Message {
  id: number;
  type: 'user' | 'bot' | 'products';
  content?: string;
  textContent?: string;
  products?: Product[];
  isTyping?: boolean;
}