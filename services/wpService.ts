
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product, JournalArticle, CartItem } from '../types';

const SITE_URL = 'https://elysoir.top'; 
const CK = 'ck_c9022a6e59fc7b495b6fb9943b3a91a88365c086'; 
const CS = 'cs_c987098b48414275a80ee406d7ad3b64c9f3bd85'; 

const WC_BASE_URL = `${SITE_URL}/wp-json/wc/v3`;
const WP_BASE_URL = `${SITE_URL}/wp-json/wp/v2`;
const AUTH = btoa(`${CK}:${CS}`);

export const wpService = {
  async fetchProducts(): Promise<{ products: Product[], categories: string[] }> {
    try {
      // 并行请求：同时获取产品和类目，确保类目列表完整（解决您提到的类目缺失问题）
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
        // 获取主分类用于展示，如果没有则显示 Collection
        category: p.categories[0]?.name || 'Collection',
        // 获取所有分类用于筛选逻辑
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

      // 处理类目列表：优先使用 API 返回的完整列表
      let categories = ['All'];
      if (categoriesRes.ok) {
        const wcCategories = await categoriesRes.json();
        const categoryNames = wcCategories
            .map((c: any) => c.name)
            .filter((name: string) => name !== 'Uncategorized'); // 过滤掉“未分类”
        categories = ['All', ...categoryNames];
      } else {
        // 如果类目接口失败，回退到从产品中提取
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
    // 强制跳转到 WordPress 原生购物车，触发 Nginx 规则交给 PHP 处理
    return `${SITE_URL}/cart`;
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
