export interface Product {
  id: string;
  name: string;
  price: number;
  sales: number;
  rating: number;
  url: string;
  platform: string;
  image: string;
  shop: string;
  timestamp: number;
}

export interface PriceTrend {
  platform: string;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface ScrapeRequest {
  keyword: string;
  platforms: string[];
  limit: number;
}

export interface ScrapeResponse {
  success: boolean;
  data: Product[];
  error?: string;
}

export interface AnalyzeRequest {
  products: Product[];
  sortBy: string;
  sortOrder: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data: {
    sortedProducts: Product[];
    priceTrend: PriceTrend[];
    recommendations: Product[];
  };
  error?: string;
}
