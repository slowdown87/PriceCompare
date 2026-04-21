import { BaseScraper } from './baseScraper';
import { Product } from '../../utils/types';

export class TaobaoScraper extends BaseScraper {
  platform = 'taobao';
  baseUrl = 'https://www.taobao.com';

  async search(keyword: string, limit: number): Promise<Product[]> {
    if (!this.page) {
      await this.initialize();
    }

    const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(keyword)}`;
    await this.page!.goto(searchUrl, { waitUntil: 'networkidle2' });

    // 等待商品列表加载
    await this.page!.waitForSelector('.grid-item', { timeout: 10000 });

    const products = await this.extractProducts();
    return products.slice(0, limit);
  }

  protected async extractProducts(): Promise<Product[]> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    return this.page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.grid-item'));
      return items.map((item) => {
        const nameElement = item.querySelector('.title');
        const priceElement = item.querySelector('.price');
        const salesElement = item.querySelector('.sales');
        const shopElement = item.querySelector('.shop');
        const imageElement = item.querySelector('.img');
        const urlElement = item.querySelector('.title a');

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
        // 淘宝商品详情页才有评分，这里暂时设为0
        const rating = 0;

        return {
          id: `taobao_${Math.random().toString(36).substr(2, 9)}`,
          name,
          price,
          sales,
          rating,
          url,
          platform: 'taobao',
          image,
          shop,
          timestamp: Date.now()
        };
      });
    });
  }
}
