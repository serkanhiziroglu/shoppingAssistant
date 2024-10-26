// lib/shopping-api.ts
import { Product } from '@/types';

const SERPAPI_KEY = "3ffe0b6708373ccc4961cadfccb9b7b9b38c7284b666ebefbeeb323374d196a3";

export async function searchGoogleShopping(query: string): Promise<Product[]> {
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.shopping_results) {
    return [];
  }

  return data.shopping_results.map((item: any) => ({
    id: item.position.toString(),
    title: item.title,
    price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
    currency: 'USD',
    condition: 'New',
    url: item.link,
    image: item.thumbnail,
    description: item.snippet || '',
    source: item.source || 'Google Shopping',
    rating: item.rating || null,
    reviews: item.reviews || 0,
    shipping: item.shipping || 'Check website',
    merchantName: item.merchant || ''
  }));
}

export async function processProductsWithLlama(query: string, products: Product[]) {
  const LLAMA_API_KEY = 'LA-6fde914b0d7d4e0a901bbbc5c4b1049d87556847a5704030865ef58b7bc0c145';

  try {
    const response = await fetch('https://api.llama-api.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLAMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-2-70b-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful shopping assistant. Analyze the products and provide natural, conversational recommendations based on the user\'s query.'
          },
          {
            role: 'user',
            content: `User Query: "${query}"
            
Available Products:
${products.map(p => `- ${p.title} (${p.price} ${p.currency}): ${p.description}`).join('\n')}

Please recommend the best products for this query and explain why they're good matches. Keep your response natural and conversational.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get Llama response');
    }

    const data = await response.json();
    
    return {
      message: data.choices[0]?.message?.content || "I've analyzed the products and here are my recommendations...",
      products: products.slice(0, 3) // Return top 3 products
    };
  } catch (error) {
    console.error('Error processing with Llama:', error);
    return {
      message: "I've found some products that match your search. Here are the top options...",
      products: products.slice(0, 3)
    };
  }
}