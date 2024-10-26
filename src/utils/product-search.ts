// utils/product-search.ts
import { Product, SearchResponse } from '../types';

const EBAY_APP_ID = process.env.NEXT_PUBLIC_EBAY_APP_ID;
const EBAY_API_URL = 'https://svcs.ebay.com/services/search/FindingService/v1';

export async function searchEbayProducts(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchResponse> {
  try {
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findItemsByKeywords',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': EBAY_APP_ID!,
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': '',
      'keywords': query,
      'paginationInput.pageNumber': page.toString(),
      'paginationInput.entriesPerPage': limit.toString(),
      'outputSelector(0)': 'SellerInfo',
      'outputSelector(1)': 'PictureURLLarge',
      'sortOrder': 'BestMatch'
    });

    const response = await fetch(`${EBAY_API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`eBay API error: ${response.statusText}`);
    }

    const data = await response.json();
    const searchResult = data.findItemsByKeywordsResponse[0].searchResult[0];
    const items = searchResult.item || [];
    const total = parseInt(searchResult.count[0], 10);

    const products: Product[] = items.map((item: any) => ({
      id: item.itemId[0],
      title: item.title[0],
      price: parseFloat(item.sellingStatus[0].currentPrice[0].__value__),
      currency: item.sellingStatus[0].currentPrice[0]['@currencyId'],
      condition: item.condition?.[0].conditionDisplayName?.[0] || 'Not specified',
      url: item.viewItemURL[0],
      image: item.pictureURLLarge?.[0] || item.galleryURL?.[0] || '/api/placeholder/200/200',
      description: item.subtitle?.[0] || '',
      location: item.location?.[0] || '',
      seller: {
        name: item.sellerInfo?.[0].sellerUserName?.[0] || '',
        rating: parseInt(item.sellerInfo?.[0].positiveFeedbackPercent?.[0] || '0', 10),
        feedbackScore: parseInt(item.sellerInfo?.[0].feedbackScore?.[0] || '0', 10)
      }
    }));

    return {
      products,
      total,
      page,
      limit,
      hasMore: total > page * limit
    };
  } catch (error) {
    console.error('Error searching eBay products:', error);
    throw error;
  }
}