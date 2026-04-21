import puppeteer, { Browser, Page } from 'puppeteer';
import { Product } from '../../utils/types';

export abstract class BaseScraper {
  protected browser: Browser | null = null;
  protected page: Page | null = null;

  abstract platform: string;
  abstract baseUrl: string;

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.page = await this.browser.newPage();
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  abstract search(keyword: string, limit: number): Promise<Product[]>;

  protected abstract extractProducts(): Promise<Product[]>;

  protected generateId(name: string, platform: string): string {
    return `${platform}_${Buffer.from(name).toString('base64').substring(0, 10)}`;
  }

  protected formatPrice(priceStr: string): number {
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }

  protected formatSales(salesStr: string): number {
    const cleaned = salesStr.replace(/[^0-9]/g, '');
    return parseInt(cleaned) || 0;
  }

  protected formatRating(ratingStr: string): number {
    const cleaned = ratingStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }
}
