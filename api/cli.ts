#!/usr/bin/env node

import { program } from 'commander';
import { ScraperManager } from './services/scrapers/scraperManager';
import { ProductAnalyzer } from './services/analyzers/productAnalyzer';
import { mockProducts } from './utils/mockData';

program
  .version('1.0.0')
  .description('电商商品价格自动化采集与对比工具');

program
  .command('scrape')
  .description('从电商平台采集商品信息')
  .option('-k, --keyword <keyword>', '搜索关键词', '手机')
  .option('-p, --platforms <platforms>', '电商平台，多个平台用逗号分隔', 'jd,taobao,pdd')
  .option('-l, --limit <limit>', '每个平台采集的商品数量', '10')
  .action(async (options) => {
    const { keyword, platforms, limit } = options;
    const platformList = platforms.split(',');
    
    console.log(`开始从以下平台采集商品信息: ${platformList.join(', ')}`);
    console.log(`搜索关键词: ${keyword}`);
    console.log(`每个平台采集数量: ${limit}`);
    
    try {
      let products = [];
      try {
        const scraperManager = new ScraperManager();
        products = await scraperManager.search(keyword, platformList, parseInt(limit));
        await scraperManager.closeAll();
        
        // 如果没有采集到数据，使用模拟数据
        if (products.length === 0) {
          console.log('没有采集到数据，使用模拟数据');
          products = mockProducts;
        }
      } catch (scrapeError) {
        console.error('采集过程中出现错误，使用模拟数据:', scrapeError);
        products = mockProducts;
      }
      
      console.log(`\n采集完成，共获取 ${products.length} 个商品`);
      
      // 分析数据
      const analyzer = new ProductAnalyzer();
      const analysis = analyzer.analyze(products, 'price', 'asc');
      
      console.log('\n=== 价格从低到高排序 ===');
      analysis.sortedProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   价格: ¥${product.price}`);
        console.log(`   销量: ${product.sales}`);
        console.log(`   平台: ${product.platform}`);
        console.log(`   店铺: ${product.shop}`);
        console.log(`   链接: ${product.url}`);
        console.log('---');
      });
      
      console.log('\n=== 价格趋势 ===');
      analysis.priceTrend.forEach(trend => {
        console.log(`${trend.platform}: 平均价格 ¥${trend.averagePrice.toFixed(2)}, 最低价格 ¥${trend.minPrice}, 最高价格 ¥${trend.maxPrice}`);
      });
      
      console.log('\n=== 性价比推荐 ===');
      analysis.recommendations.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   价格: ¥${product.price}`);
        console.log(`   销量: ${product.sales}`);
        console.log(`   平台: ${product.platform}`);
        console.log(`   店铺: ${product.shop}`);
        console.log(`   链接: ${product.url}`);
        console.log('---');
      });
      
    } catch (error) {
      console.error('处理过程中出现错误:', error);
    }
  });

program.parse(process.argv);
