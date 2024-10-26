export interface Product {
    title: string;
    price: number;
    currency: string;
    condition?: string;
    url: string;
    image?: string;
  }
  
  export interface Message {
    id: number;
    type: 'user' | 'bot' | 'products';
    content?: string;
    textContent?: string;
    products?: Product[];
    isTyping?: boolean;
  }