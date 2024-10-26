// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { Product, SearchResponse } from '@/types';

const SERPAPI_KEY = "3ffe0b6708373ccc4961cadfccb9b7b9b38c7284b666ebefbeeb323374d196a3";

async function searchGoogleShopping(query: string): Promise<Product[]> {
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { message: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const products = await searchGoogleShopping(query);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
      total: products.length,
      page,
      limit,
      hasMore: endIndex < products.length
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { message: 'Error searching products' },
      { status: 500 }
    );
  }
}