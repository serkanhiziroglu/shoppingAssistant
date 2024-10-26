// app/api/llama/route.ts
import { NextResponse } from 'next/server';
import { Product } from '@/types';

const LLAMA_API_KEY = 'LA-6fde914b0d7d4e0a901bbbc5c4b1049d87556847a5704030865ef58b7bc0c145';
const LLAMA_API_URL = 'https://api.llama-api.com/chat/completions';

export async function POST(request: Request) {
  let requestProducts: Product[] = [];
  let requestQuery = '';

  try {
    const body = await request.json();
    const { query, products } = body;

    if (!query || !products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Query and products array are required' },
        { status: 400 }
      );
    }

    requestProducts = products;
    requestQuery = query;

    // Format products for the prompt
    const productsList = products.map((p: Product) => 
      `Product: ${p.title}
       Price: $${p.price} ${p.currency}
       Rating: ${p.rating ? `${p.rating}/5 with ${p.reviews} reviews` : 'No rating'}
       Description: ${p.description}
       Seller: ${p.merchantName || 'Unknown seller'}
      `
    ).join('\n\n');

    // Make direct API call to Llama
    const llamaResponse = await fetch(LLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3.1-70b",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable shopping assistant who helps users find the best products for their needs. Analyze products and make recommendations based on user requirements, considering price, features, ratings, and value for money. Be concise but informative."
          },
          {
            role: "user",
            content: `Based on the user's request: "${query}", analyze these products and recommend the best options:\n\n${productsList}\n\nProvide recommendations focusing on how well each product matches their needs, price-performance ratio, and user ratings. Keep the response natural and conversational.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        stream: false
      })
    });

    if (!llamaResponse.ok) {
      const errorText = await llamaResponse.text();
      console.error('Llama API Error:', {
        status: llamaResponse.status,
        statusText: llamaResponse.statusText,
        error: errorText
      });
      throw new Error(`Llama API request failed: ${llamaResponse.statusText}`);
    }

    const data = await llamaResponse.json();
    
    // Sort products by relevance score (using rating and reviews as proxy)
    const sortedProducts = [...products].sort((a, b) => {
      const scoreA = (a.rating || 0) * Math.log(a.reviews + 1);
      const scoreB = (b.rating || 0) * Math.log(b.reviews + 1);
      return scoreB - scoreA;
    });

    // Get top 3 products
    const recommendedProducts = sortedProducts.slice(0, 3);

    // Extract the AI response content
    const aiResponse = data.choices?.[0]?.message?.content || data.output || '';

    return NextResponse.json({
      message: aiResponse || `Based on your search for "${query}", here are the best options I found, ranked by user ratings and reviews:`,
      products: recommendedProducts
    });

  } catch (error) {
    console.error('Error in Llama API route:', error);
    
    // Use the products from the request for fallback
    const fallbackProducts = requestProducts.length > 0 ? requestProducts : [];
    const sortedProducts = [...fallbackProducts]
      .sort((a, b) => ((b.rating || 0) - (a.rating || 0)))
      .slice(0, 3);

    const priceRange = sortedProducts.reduce(
      (range, p) => ({
        min: Math.min(range.min, p.price),
        max: Math.max(range.max, p.price)
      }),
      { min: Infinity, max: -Infinity }
    );

    return NextResponse.json({
      message: `Based on your search for "${requestQuery}", I've found some great options ranging from $${priceRange.min.toFixed(2)} to $${priceRange.max.toFixed(2)}. These products were selected based on their ratings, features, and value for money.`,
      products: sortedProducts
    }, { status: 200 });
  }
}