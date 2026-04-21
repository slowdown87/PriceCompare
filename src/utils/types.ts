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

export interface AnalysisResult {
  sortedProducts: Product[];
  priceTrend: PriceTrend[];
  recommendations: Product[];
}
