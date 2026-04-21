import { BaseScraper } from './baseScraper';
import { Product } from '../../utils/types';

export class PDScraper extends BaseScraper {
  platform = 'pdd';
  baseUrl = 'https://www.pinduoduo.com';

  async search(keyword: string, limit: number): Promise<Product[]> {
    if (!this.page) {
      await this.initialize();
    }

    const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(keyword)}`;
    await this.page!.goto(searchUrl, { waitUntil: 'networkidle2' });

    // 等待商品列表加载
    await this.page!.waitForSelector('.goods-list .goods-item', { timeout: 10000 });

    const products = await this.extractProducts();
    return products.slice(0, limit);
  }

  protected async extractProducts(): Promise<Product[]> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    return this.page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.goods-list .goods-item'));
      return items.map((item) => {
        const nameElement = item.querySelector('.goods-title');
        const priceElement = item.querySelector('.goods-price');
        const salesElement = item.querySelector('.goods-sales');
        const shopElement = item.querySelector('.goods-shop');
        const imageElement = item.querySelector('.goods-img img');
        const urlElement = item.querySelector('.goods-item a');

        const name = nameElement ? nameElement.textContent?.trim() || '' : '';
        const priceStr = priceElement ? priceElement.textContent?.trim() || '' : '';
        const salesStr = salesElement ? salesElement.textContent?.trim() || '' : '';
        const shop = shopElement ? shopElement.textContent?.trim() || '' : '';
        const image = imageElement ? (imageElement as HTMLImageElement).src || '' : '';
        const url = urlElement ? (urlElement as HTMLAnchorElement).href || '' : '';

        // 提取价格
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
        // 提取销量
        const sales = parseInt(salesStr.replace(/[^0-9]/g, '')) || 0;
        // 拼多多商品详情页才有评分，这里暂时设为0
        const rating = 0;

        return {
          id: `pdd_${Math.random().toString(36).substr(2, 9)}`,
          name,
          price,
          sales,
          rating,
          url,
          platform: 'pdd',
          image,
          shop,
          timestamp: Date.now()
        };
      });
    });
  }
}
