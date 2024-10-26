export async function searchProducts(query: string) {
  try {
    // Replace this with your actual product API implementation
    const response = await fetch(`https://api.fake-products.com/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    // Return mock data for demonstration
    return [
      {
        title: "Example Product 1",
        price: 99.99,
        currency: "USD",
        condition: "New",
        url: "https://example.com/product1",
        image: "/api/placeholder/200/200"
      },
      {
        title: "Example Product 2",
        price: 79.99,
        currency: "USD",
        condition: "Used",
        url: "https://example.com/product2",
        image: "/api/placeholder/200/200"
      }
    ];
  }
}
