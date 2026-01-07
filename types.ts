
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export interface OptionValue {
  name: string;
  image?: string; // 对应 WooCommerce 属性或变体的小图
}

export interface ProductOption {
  name: string;
  values: OptionValue[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string; // 用于显示的分类（主分类）
  categories?: string[]; // 用于筛选的所有分类列表
  imageUrl: string;
  gallery?: string[];
  features: string[];
  options?: ProductOption[];
  hasVariations?: boolean; // 标记是否需要加载变体
}

export interface CartItem extends Product {
  selectedOptions?: Record<string, string>;
  cartId: string;
}

export interface JournalArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: React.ReactNode; 
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'product', product: Product }
  | { type: 'category', category: string } // 新增：独立分类页面状态
  | { type: 'journal', article: JournalArticle }
  | { type: 'checkout' };
