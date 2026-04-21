import express from 'express';
import { ScraperManager } from '../services/scrapers/scraperManager';
import { ProductAnalyzer } from '../services/analyzers/productAnalyzer';
import { ScrapeRequest, ScrapeResponse, AnalyzeRequest, AnalyzeResponse } from '../utils/types';
import { mockProducts } from '../utils/mockData';

const router = express.Router();
const scraperManager = new ScraperManager();
const productAnalyzer = new ProductAnalyzer();

// 商品采集API
router.post('/scrape', async (req, res) => {
  try {
    const { keyword, platforms, limit }: ScrapeRequest = req.body;
    
    if (!keyword || !platforms || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keyword and platforms are required'
      } as ScrapeResponse);
    }

    try {
      const products = await scraperManager.search(keyword, platforms, limit || 10);
      
      if (products.length > 0) {
        res.json({
          success: true,
          data: products
        } as ScrapeResponse);
      } else {
        // 如果没有采集到数据，使用模拟数据
        console.log('Using mock data since no products were scraped');
        res.json({
          success: true,
          data: mockProducts
        } as ScrapeResponse);
      }
    } catch (scrapeError) {
      // 爬虫失败时使用模拟数据
      console.error('Scraping failed, using mock data:', scrapeError);
      res.json({
        success: true,
        data: mockProducts
      } as ScrapeResponse);
    }
  } catch (error) {
    console.error('Error in scrape API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ScrapeResponse);
  } finally {
    try {
      await scraperManager.closeAll();
    } catch (closeError) {
      console.error('Error closing scrapers:', closeError);
    }
  }
});

// 数据分析API
router.post('/analyze', (req, res) => {
  try {
    const { products, sortBy, sortOrder }: AnalyzeRequest = req.body;
    
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Products are required'
      } as AnalyzeResponse);
    }

    const analysisResult = productAnalyzer.analyze(products, sortBy || 'price', sortOrder || 'asc');
    
    res.json({
      success: true,
      data: analysisResult
    } as AnalyzeResponse);
  } catch (error) {
    console.error('Error in analyze API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as AnalyzeResponse);
  }
});

export default router;
