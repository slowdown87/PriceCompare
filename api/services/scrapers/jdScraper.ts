import { BaseScraper } from './baseScraper';
import { Product } from '../../utils/types';

export class JDScraper extends BaseScraper {
  platform = 'jd';
  baseUrl = 'https://www.jd.com';

  async search(keyword: string, limit: number): Promise<Product[]> {
    if (!this.page) {
      await this.initialize();
    }

    const searchUrl = `${this.baseUrl}/search?keyword=${encodeURIComponent(keyword)}`;
    await this.page!.goto(searchUrl, { waitUntil: 'networkidle2' });

    // 等待商品列表加载
    await this.page!.waitForSelector('.gl-item', { timeout: 10000 });

    const products = await this.extractProducts();
    return products.slice(0, limit);
  }

  protected async extractProducts(): Promise<Product[]> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    return this.page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.gl-item'));
      return items.map((item) => {
        const nameElement = item.querySelector('.p-name em');
        const priceElement = item.querySelector('.p-price .J_price');
        const salesElement = item.querySelector('.p-commit');
        const shopElement = item.querySelector('.p-shop a');
        const imageElement = item.querySelector('.p-img img');
        const urlElement = item.querySelector('.p-name a');

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
        // 京东商品详情页才有评分，这里暂时设为0
        const rating = 0;

        return {
          id: `jd_${url.split('/').pop()?.split('.')[0] || Math.random().toString(36).substr(2, 9)}`,
          name,
          price,
          sales,
          rating,
          url,
          platform: 'jd',
          image,
          shop,
          timestamp: Date.now()
        };
      });
    });
  }
}
