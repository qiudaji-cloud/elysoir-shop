
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product, JournalArticle, CartItem } from '../types';

// 配置
// 在生产环境，这些请求会被 Nginx 拦截并转发到 WordPress 后端
// 在开发环境，vite.config.ts 中的代理会处理这些请求
const WC_BASE_URL = '/api/wc'; 
const WP_BASE_URL = '/api/wp';

export const wpService = {
  async fetchProducts(): Promise<{ products: Product[], categories: string[] }> {
    try {
      // 并行请求：同时获取产品和类目
      // 注意：前端不再发送 Authorization 头，这是由 Nginx 或 Vite 代理层在服务端完成的
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${WC_BASE_URL}/products?per_page=100&status=publish`),
        fetch(`${WC_BASE_URL}/products/categories?per_page=100&hide_empty=true&orderby=count&order=desc`)
      ]);

      if (!productsRes.ok) {
         console.error(`Products HTTP error! status: ${productsRes.status}`);
         return { products: [], categories: ['All'] };
      }
      
      const wcProducts = await productsRes.json();

      // 处理产品数据
      const products: Product[] = wcProducts.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        // Tagline: 清洗HTML用于卡片展示
        tagline: p.short_description ? p.short_description.replace(/<[^>]*>?/gm, '').substring(0, 60) + '...' : 'Exclusively for Elysoir',
        // Description: 保留HTML，详情页会使用 DOMPurify 渲染
        description: p.short_description || '',
        longDescription: p.description || '',
        price: parseFloat(p.price || '0'),
        category: p.categories[0]?.name || 'Collection',
        categories: p.categories.map((c: any) => c.name),
        imageUrl: p.images[0]?.src || 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=1000',
        gallery: p.images?.map((img: any) => img.src) || [],
        features: p.attributes?.find((a: any) => a.name === 'Specifications' || a.name === 'Details')?.options || ['Fine Craftsmanship', 'Limited Edition'],
        hasVariations: p.variations && p.variations.length > 0,
        options: p.attributes
          ?.filter((a: any) => a.variation)
          .map((a: any) => ({
            name: a.name,
            values: a.options.map((opt: string) => ({ name: opt }))
          }))
      }));

      // 处理类目列表
      let categories = ['All'];
      if (categoriesRes.ok) {
        const wcCategories = await categoriesRes.json();
        const categoryNames = wcCategories
            .map((c: any) => c.name)
            .filter((name: string) => name !== 'Uncategorized');
        categories = ['All', ...categoryNames];
      } else {
        const derivedCategories = [...new Set(products.map(p => p.category))];
        categories = ['All', ...derivedCategories];
      }

      return { products, categories };
    } catch (error) {
      console.error('Elysoir Fetch Error:', error);
      return { products: [], categories: ['All'] };
    }
  },

  async fetchProductVariations(productId: string): Promise<any[]> {
    try {
      const response = await fetch(`${WC_BASE_URL}/products/${productId}/variations?per_page=50`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  getCheckoutUrl(cartItems: CartItem[]): string {
    // 简单的重定向到购物车页面，后续由 WordPress 处理
    return `/cart`;
  },

  async fetchArticles(): Promise<JournalArticle[]> {
    try {
      const response = await fetch(`${WP_BASE_URL}/posts?_embed`);
      if (!response.ok) return [];
      const posts = await response.json();
      return posts.map((post: any) => ({
        id: post.id,
        title: post.title.rendered,
        date: new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, ''),
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=1000',
        content: post.content.rendered
      }));
    } catch (error) {
      return [];
    }
  }
};
