import { Product } from "@/types";

const AI_API_BASE = 'http://127.0.0.1:5001/api';

async function handleResponse(response: Response) {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  const data = await response.json();
  console.log('API Response data:', data);
  
  if (!response.ok) {
    throw new Error(data.error || `API request failed with status ${response.status}`);
  }
  return data;
}

export async function getRecommendations(productId: string) {
  console.log('Fetching recommendations for product:', productId);
  const url = `${AI_API_BASE}/recommend?product_id=${encodeURIComponent(productId)}`;
  console.log('Request URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching to ensure fresh data
    });

    const data = await handleResponse(response);
    console.log('Processed API response:', data);

    if (!data || !data.recommendations || !Array.isArray(data.recommendations)) {
      console.error('Invalid API response format:', data);
      return { recommendations: [] };
    }

    return data; // Return the entire response object with { recommendations: [...] }
  } catch (error: unknown) {
    console.error('Failed to fetch recommendations:', error);
    console.error('Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return { recommendations: [] }; // Return empty recommendations on error
  }
}

export async function getFAQAnswer(question: string, language: string = 'en') {
  try {
    const response = await fetch(
      `${AI_API_BASE}/faq?question=${encodeURIComponent(question)}&language=${language}`
    );
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch FAQ answer:', error);
    return null;
  }
}

export async function generateSEO(product: Product, language: string = 'en') {
  try {
    const response = await fetch(`${AI_API_BASE}/generate-seo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, language })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to generate SEO:', error);
    return null;
  }
}

export async function analyzeReviews(reviews: [], language: string = 'en') {
  try {
    const response = await fetch(`${AI_API_BASE}/analyze-reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews, language })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to analyze reviews:', error);
    return null;
  }
}

export async function optimizeImage(imageFile: File) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`${AI_API_BASE}/optimize-image`, {
      method: 'POST',
      body: formData
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to optimize image:', error);
    return null;
  }
} 