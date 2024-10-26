export async function processProductsWithLlama(query: string, products: any[]) {
  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
        input: {
          prompt: `Given the user query "${query}", analyze these products and recommend the best options:
          ${JSON.stringify(products, null, 2)}
          
          Provide a natural response explaining the recommendations and why they're good matches for the query.
          Format your response in a conversational way.`,
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
        },
      }),
    });

    const prediction = await response.json();
    return {
      message: prediction.output || "I've analyzed the products and here are my recommendations...",
      products: products
    };
  } catch (error) {
    console.error('Error processing with Llama:', error);
    return {
      message: "I've found some products that match your search. Here are the options...",
      products: products
    };
  }
}
