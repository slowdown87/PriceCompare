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

// 本地数据分析工具
export class LocalProductAnalyzer {
  // 去重商品数据
  deduplicate(products: Product[]): Product[] {
    const uniqueProducts = new Map<string, Product>();
    
    for (const product of products) {
      // 基于商品名称和平台去重
      const key = `${product.platform}_${product.name}`;
      if (!uniqueProducts.has(key)) {
        uniqueProducts.set(key, product);
      }
    }
    
    return Array.from(uniqueProducts.values());
  }

  // 排序商品数据
  sort(products: Product[], sortBy: string, sortOrder: string): Product[] {
    return [...products].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'sales':
          comparison = a.sales - b.sales;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        default:
          comparison = a.price - b.price;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // 计算价格趋势
  calculatePriceTrend(products: Product[]): PriceTrend[] {
    const platformMap = new Map<string, Product[]>();
    
    // 按平台分组
    for (const product of products) {
      if (!platformMap.has(product.platform)) {
        platformMap.set(product.platform, []);
      }
      platformMap.get(product.platform)!.push(product);
    }
    
    // 计算每个平台的价格趋势
    const trends: PriceTrend[] = [];
    for (const [platform, platformProducts] of platformMap) {
      const prices = platformProducts.map(p => p.price);
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      trends.push({
        platform,
        averagePrice,
        minPrice,
        maxPrice
      });
    }
    
    return trends;
  }

  // 计算性价比并推荐商品
  recommendProducts(products: Product[]): Product[] {
    // 计算每个商品的性价比分数
    const productsWithScore = products.map(product => {
      // 简单的性价比计算：销量 * 评分 / 价格
      // 为了避免除以零，价格加1
      const score = (product.sales * (product.rating || 1)) / (product.price + 1);
      return { ...product, score };
    });
    
    // 按性价比分数排序，取前10个
    return productsWithScore
      .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
      .slice(0, 10);
  }

  // 分析商品数据
  analyze(products: Product[], sortBy: string, sortOrder: string) {
    // 去重
    const uniqueProducts = this.deduplicate(products);
    
    // 排序
    const sortedProducts = this.sort(uniqueProducts, sortBy, sortOrder);
    
    // 计算价格趋势
    const priceTrend = this.calculatePriceTrend(uniqueProducts);
    
    // 推荐商品
    const recommendations = this.recommendProducts(uniqueProducts);
    
    return {
      sortedProducts,
      priceTrend,
      recommendations
    };
  }
}
