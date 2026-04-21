import { JDScraper } from './jdScraper';
import { TaobaoScraper } from './taobaoScraper';
import { PDScraper } from './pddScraper';
import { Product } from '../../utils/types';

export class ScraperManager {
  private scrapers: Map<string, any> = new Map();

  constructor() {
    this.scrapers.set('jd', new JDScraper());
    this.scrapers.set('taobao', new TaobaoScraper());
    this.scrapers.set('pdd', new PDScraper());
  }

  async search(keyword: string, platforms: string[], limit: number): Promise<Product[]> {
    const allProducts: Product[] = [];

    for (const platform of platforms) {
      const scraper = this.scrapers.get(platform);
      if (scraper) {
        try {
          await scraper.initialize();
          const products = await scraper.search(keyword, limit);
          allProducts.push(...products);
          await scraper.close();
        } catch (error) {
          console.error(`Error scraping ${platform}:`, error);
          // 继续处理其他平台
        }
      }
    }

    return allProducts;
  }

  async closeAll(): Promise<void> {
    for (const scraper of this.scrapers.values()) {
      try {
        await scraper.close();
      } catch (error) {
        console.error('Error closing scraper:', error);
      }
    }
  }
}
