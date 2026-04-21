import React, { useState, useEffect } from 'react';
import { Search, Loader, ChevronDown, TrendingDown, Award } from 'lucide-react';
import * as echarts from 'echarts';
import { Product, AnalysisResult, LocalProductAnalyzer } from '../utils/types';

const Home: React.FC = () => {
  const [keyword, setKeyword] = useState('手机');
  const [platforms, setPlatforms] = useState<string[]>(['jd', 'taobao', 'pdd']);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [activeTab, setActiveTab] = useState('all');
  const analyzer = new LocalProductAnalyzer();

  // 处理平台选择
  const handlePlatformChange = (platform: string) => {
    setPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  // 处理搜索
  const handleSearch = async () => {
    if (!keyword || platforms.length === 0) return;

    setLoading(true);
    try {
      // 从静态JSON文件加载数据
      const response = await fetch('/data/products.json');
      const products = await response.json();
      
      // 过滤数据（模拟平台筛选）
      const filteredProducts = products.filter((product: any) => 
        platforms.includes(product.platform)
      );
      
      setProducts(filteredProducts);

      // 使用本地分析器分析数据
      const analysis = analyzer.analyze(filteredProducts, sortBy, sortOrder);
      setAnalysisResult(analysis);
      
      // 渲染图表
      setTimeout(() => {
        renderPriceTrendChart(analysis.priceTrend);
      }, 100);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理排序
  const handleSort = (newSortBy: string) => {
    let newSortOrder = sortOrder;
    if (newSortBy === sortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      newSortOrder = 'asc';
    }
    
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    
    // 重新分析数据
    if (products.length > 0) {
      const analysis = analyzer.analyze(products, newSortBy, newSortOrder);
      setAnalysisResult(analysis);
      
      // 重新渲染图表
      setTimeout(() => {
        renderPriceTrendChart(analysis.priceTrend);
      }, 100);
    }
  };

  // 渲染价格趋势图表
  const renderPriceTrendChart = (priceTrend: any[]) => {
    const chartDom = document.getElementById('priceTrendChart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '各平台价格趋势',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['平均价格', '最低价格', '最高价格'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: priceTrend.map(item => item.platform),
      },
      yAxis: {
        type: 'value',
        name: '价格 (元)',
      },
      series: [
        {
          name: '平均价格',
          type: 'bar',
          data: priceTrend.map(item => item.averagePrice.toFixed(2)),
          itemStyle: {
            color: '#3498db',
          },
        },
        {
          name: '最低价格',
          type: 'bar',
          data: priceTrend.map(item => item.minPrice),
          itemStyle: {
            color: '#2ecc71',
          },
        },
        {
          name: '最高价格',
          type: 'bar',
          data: priceTrend.map(item => item.maxPrice),
          itemStyle: {
            color: '#e74c3c',
          },
        },
      ],
    };

    myChart.setOption(option);

    // 响应式调整
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 平台名称映射
  const platformNames = {
    jd: '京东',
    taobao: '淘宝',
    pdd: '拼多多',
  };

  // 平台颜色映射
  const platformColors = {
    jd: 'bg-red-500',
    taobao: 'bg-orange-500',
    pdd: 'bg-yellow-500',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">电商商品价格对比工具</h1>
          <p className="text-center mt-2">快速比较多个平台的商品价格，找到性价比最高的选择</p>
        </div>
      </header>

      {/* 搜索区域 */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="输入搜索关键词，例如：手机、电脑"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(['jd', 'taobao', 'pdd'] as const).map((platform) => (
                <button
                  key={platform}
                  onClick={() => handlePlatformChange(platform)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${platforms.includes(platform)
                    ? `${platformColors[platform]} text-white`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {platformNames[platform]}
                </button>
              ))}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              disabled={loading || !keyword || platforms.length === 0}
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
              {loading ? '搜索中...' : '搜索'}
            </button>
          </div>
        </div>
      </div>

      {/* 结果展示区域 */}
      {analysisResult && (
        <div className="container mx-auto px-4 py-8">
          {/* 标签页 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              全部商品
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'recommendations'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              性价比推荐
            </button>
          </div>

          {/* 排序选项 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {activeTab === 'all' ? '全部商品' : '性价比推荐'}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleSort('price')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${sortBy === 'price'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <TrendingDown size={14} />
                价格
                {sortBy === 'price' && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`}
                  />
                )}
              </button>
              <button
                onClick={() => handleSort('sales')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${sortBy === 'sales'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                销量
                {sortBy === 'sales' && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`}
                  />
                )}
              </button>
            </div>
          </div>

          {/* 商品列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'all' ? analysisResult.sortedProducts : analysisResult.recommendations).map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="relative">
                  <img
                    src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white ${platformColors[product.platform as keyof typeof platformColors]}`}>
                    {platformNames[product.platform as keyof typeof platformNames]}
                  </div>
                  {activeTab === 'recommendations' && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white rounded text-xs font-medium flex items-center gap-1">
                      <Award size={12} />
                      高性价比
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-red-600 font-bold text-lg mb-2">¥{product.price}</p>
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>销量: {product.sales}</span>
                    <span>店铺: {product.shop}</span>
                  </div>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    查看详情
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 价格趋势图表 */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">价格趋势分析</h2>
            <div id="priceTrendChart" className="w-full h-80"></div>
          </div>
        </div>
      )}

      {/* 初始状态 */}
      {!analysisResult && !loading && (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Search size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">开始搜索商品</h2>
            <p className="text-gray-500 mb-6">输入关键词，选择电商平台，点击搜索按钮开始采集和分析商品价格</p>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              示例搜索: 手机
            </button>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>电商商品价格自动化采集与对比工具</p>
          <p className="text-gray-400 text-sm mt-2">© 2026 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
