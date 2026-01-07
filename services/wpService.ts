
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product, JournalArticle, CartItem } from '../types';

// 从 Vite 环境变量中读取配置，提供默认空字符串以防构建失败
const SITE_URL = import.meta.env.VITE_SITE_URL || '';
const CK = import.meta.env.VITE_WC_CONSUMER_KEY || '';
const CS = import.meta.env.VITE_WC_CONSUMER_SECRET || '';

// 移除顶层的强制检查 throw new Error，改为在控制台输出警告
// 这样可以确保 CI/CD 构建流程不会因为缺少密钥而中断
if (!SITE_URL || !CK || !CS) {
  console.warn("WooCommerce environment variables are missing. Product data will not load correctly.");
}

const WC_BASE_URL = `${SITE_URL}/wp-json/wc/v3`;
const WP_BASE_URL = `${SITE_URL}/wp-json/wp/v2`;

// 只有当密钥存在时才生成 Auth Header，否则为空
const AUTH = (CK && CS) ? btoa(`${CK}:${CS}`) : '';

export const wpService = {
  async fetchProducts(): Promise<{ products: Product[], categories: string[] }> {
    // 运行时检查：如果没有配置，直接返回空数据
    if (!SITE_URL || !AUTH) {
        return { products: [], categories: ['All'] };
    }

    try {
      // 并行请求：同时获取产品和类目
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${WC_BASE_URL}/products?per_page=100&status=publish`, {
          headers: { 'Authorization': `Basic ${AUTH}` }
        }),
        fetch(`${WC_BASE_URL}/products/categories?per_page=100&hide_empty=true&orderby=count&order=desc`, {
          headers: { 'Authorization': `Basic ${AUTH}` }
        })
      ]);

      if (!productsRes.ok) throw new Error(`Products HTTP error! status: ${productsRes.status}`);
      const wcProducts = await productsRes.json();

      // 处理产品数据
      const products: Product[] = wcProducts.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        tagline: p.short_description ? p.short_description.replace(/<[^>]*>?/gm, '').substring(0, 60) + '...' : 'Exclusively for Elysoir',
        description: p.short_description ? p.short_description.replace(/<[^>]*>?/gm, '') : '',
        longDescription: p.description ? p.description.replace(/<[^>]*>?/gm, '') : '',
        price: parseFloat(p.price || '0'),
        category: p.categories[0]?.name || 'Collection',
        categories: p.categories.map((c: any) => c.name),
        imageUrl: p.images[0]?.src || 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=1000',
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
    if (!SITE_URL || !AUTH) return [];
    try {
      const response = await fetch(`${WC_BASE_URL}/products/${productId}/variations?per_page=50`, {
        headers: { 'Authorization': `Basic ${AUTH}` }
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  getCheckoutUrl(cartItems: CartItem[]): string {
    return `${SITE_URL}/cart`;
  },

  async fetchArticles(): Promise<JournalArticle[]> {
    if (!SITE_URL) return [];
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
