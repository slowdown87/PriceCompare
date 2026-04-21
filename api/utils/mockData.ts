import { Product, PriceTrend } from './types';

export const mockProducts: Product[] = [
  {
    id: 'jd_1',
    name: 'Apple iPhone 15 Pro Max 256GB 钛金属色',
    price: 9999,
    sales: 12500,
    rating: 4.9,
    url: 'https://item.jd.com/100060565126.html',
    platform: 'jd',
    image: 'https://img14.360buyimg.com/n0/jfs/t1/223623/33/43702/248426/658a0a70F8d8c4b3c/3c9c4c9f6c3a8f4c.jpg',
    shop: 'Apple京东自营旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'jd_2',
    name: '华为 Mate 60 Pro 512GB 玄黑',
    price: 8999,
    sales: 15800,
    rating: 4.8,
    url: 'https://item.jd.com/100063270890.html',
    platform: 'jd',
    image: 'https://img13.360buyimg.com/n0/jfs/t1/227829/16/43049/192159/658a0a70F5c9b0b3c/3c9c4c9f6c3a8f4c.jpg',
    shop: '华为京东自营旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'taobao_1',
    name: 'Apple iPhone 15 Pro Max 256GB 钛金属色',
    price: 9899,
    sales: 8900,
    rating: 4.9,
    url: 'https://item.taobao.com/item.htm?id=747684321986',
    platform: 'taobao',
    image: 'https://img.alicdn.com/imgextra/i4/2206852664600/O1CN011W5X7r1y4y9w8w8w8_!!2206852664600.jpg',
    shop: 'Apple官方旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'taobao_2',
    name: '华为 Mate 60 Pro 512GB 玄黑',
    price: 8899,
    sales: 12300,
    rating: 4.8,
    url: 'https://item.taobao.com/item.htm?id=747684321987',
    platform: 'taobao',
    image: 'https://img.alicdn.com/imgextra/i4/2206852664600/O1CN011W5X7r1y4y9w8w8w9_!!2206852664600.jpg',
    shop: '华为官方旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'pdd_1',
    name: 'Apple iPhone 15 Pro Max 256GB 钛金属色',
    price: 9799,
    sales: 6500,
    rating: 4.7,
    url: 'https://mobile.yangkeduo.com/goods.html?goods_id=123456789',
    platform: 'pdd',
    image: 'https://p26-piu.byteimg.com/img/pgc-image/1537888888888888888~tplv-49obo7mizy-3:0:0.image',
    shop: 'Apple官方旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'pdd_2',
    name: '华为 Mate 60 Pro 512GB 玄黑',
    price: 8799,
    sales: 9800,
    rating: 4.6,
    url: 'https://mobile.yangkeduo.com/goods.html?goods_id=987654321',
    platform: 'pdd',
    image: 'https://p26-piu.byteimg.com/img/pgc-image/1537888888888888889~tplv-49obo7mizy-3:0:0.image',
    shop: '华为官方旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'jd_3',
    name: '小米 14 Pro 512GB 钛合金',
    price: 4999,
    sales: 21000,
    rating: 4.7,
    url: 'https://item.jd.com/100063270891.html',
    platform: 'jd',
    image: 'https://img13.360buyimg.com/n0/jfs/t1/227829/16/43049/192159/658a0a70F5c9b0b3d/3c9c4c9f6c3a8f4d.jpg',
    shop: '小米京东自营旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'taobao_3',
    name: '小米 14 Pro 512GB 钛合金',
    price: 4899,
    sales: 18500,
    rating: 4.7,
    url: 'https://item.taobao.com/item.htm?id=747684321988',
    platform: 'taobao',
    image: 'https://img.alicdn.com/imgextra/i4/2206852664600/O1CN011W5X7r1y4y9w8w8wa_!!2206852664600.jpg',
    shop: '小米官方旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'pdd_3',
    name: '小米 14 Pro 512GB 钛合金',
    price: 4799,
    sales: 15200,
    rating: 4.6,
    url: 'https://mobile.yangkeduo.com/goods.html?goods_id=123456780',
    platform: 'pdd',
    image: 'https://p26-piu.byteimg.com/img/pgc-image/1537888888888888890~tplv-49obo7mizy-3:0:0.image',
    shop: '小米官方旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'jd_4',
    name: 'OPPO Find X7 Pro 512GB 玄黑',
    price: 5999,
    sales: 9800,
    rating: 4.6,
    url: 'https://item.jd.com/100063270892.html',
    platform: 'jd',
    image: 'https://img13.360buyimg.com/n0/jfs/t1/227829/16/43049/192159/658a0a70F5c9b0b3e/3c9c4c9f6c3a8f4e.jpg',
    shop: 'OPPO京东自营旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'taobao_4',
    name: 'OPPO Find X7 Pro 512GB 玄黑',
    price: 5899,
    sales: 8500,
    rating: 4.6,
    url: 'https://item.taobao.com/item.htm?id=747684321989',
    platform: 'taobao',
    image: 'https://img.alicdn.com/imgextra/i4/2206852664600/O1CN011W5X7r1y4y9w8w8wb_!!2206852664600.jpg',
    shop: 'OPPO官方旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'pdd_4',
    name: 'OPPO Find X7 Pro 512GB 玄黑',
    price: 5799,
    sales: 7200,
    rating: 4.5,
    url: 'https://mobile.yangkeduo.com/goods.html?goods_id=123456781',
    platform: 'pdd',
    image: 'https://p26-piu.byteimg.com/img/pgc-image/1537888888888888891~tplv-49obo7mizy-3:0:0.image',
    shop: 'OPPO官方旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'jd_5',
    name: 'vivo X100 Pro 512GB 玄黑',
    price: 5499,
    sales: 10500,
    rating: 4.6,
    url: 'https://item.jd.com/100063270893.html',
    platform: 'jd',
    image: 'https://img13.360buyimg.com/n0/jfs/t1/227829/16/43049/192159/658a0a70F5c9b0b3f/3c9c4c9f6c3a8f4f.jpg',
    shop: 'vivo京东自营旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'taobao_5',
    name: 'vivo X100 Pro 512GB 玄黑',
    price: 5399,
    sales: 9200,
    rating: 4.6,
    url: 'https://item.taobao.com/item.htm?id=747684321990',
    platform: 'taobao',
    image: 'https://img.alicdn.com/imgextra/i4/2206852664600/O1CN011W5X7r1y4y9w8w8wc_!!2206852664600.jpg',
    shop: 'vivo官方旗舰店',
    timestamp: Date.now()
  },
  {
    id: 'pdd_5',
    name: 'vivo X100 Pro 512GB 玄黑',
    price: 5299,
    sales: 7800,
    rating: 4.5,
    url: 'https://mobile.yangkeduo.com/goods.html?goods_id=123456782',
    platform: 'pdd',
    image: 'https://p26-piu.byteimg.com/img/pgc-image/1537888888888888892~tplv-49obo7mizy-3:0:0.image',
    shop: 'vivo官方旗舰店',
    timestamp: Date.now()
  }
];

export const mockPriceTrend: PriceTrend[] = [
  {
    platform: 'jd',
    averagePrice: 7099,
    minPrice: 4999,
    maxPrice: 9999
  },
  {
    platform: 'taobao',
    averagePrice: 6999,
    minPrice: 4899,
    maxPrice: 9899
  },
  {
    platform: 'pdd',
    averagePrice: 6899,
    minPrice: 4799,
    maxPrice: 9799
  }
];
