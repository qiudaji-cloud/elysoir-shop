
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product } from '../types';
import ProductGrid from './ProductGrid';

interface CategoryPageProps {
  category: string;
  products: Product[];
  categories: string[]; // 传递给 Grid 用于类型匹配，虽然这里不显示筛选器
  onProductClick: (product: Product) => void;
  onBack: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ 
  category, 
  products, 
  categories,
  onProductClick, 
  onBack 
}) => {
  return (
    <div className="pt-32 min-h-screen bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        
        {/* Navigation / Breadcrumb */}
        <div className="flex items-center justify-between mb-16 border-b border-[#D6D1C7] pb-6">
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Collections
            </button>
            
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A8A29E]">
                Elysoir Archives
            </span>
        </div>

        {/* Page Title */}
        <div className="flex flex-col items-center text-center mb-20">
            <span className="text-sm font-medium text-[#A8A29E] uppercase tracking-widest mb-4">Curated Selection</span>
            <h1 className="text-5xl md:text-7xl font-serif text-[#2C2A26] mb-8">{category}</h1>
            <div className="w-24 h-[1px] bg-[#2C2A26]"></div>
        </div>

        {/* Product Grid (Reused without header) */}
        <ProductGrid 
            products={products}
            categories={categories}
            activeCategory={category} // 强制只显示当前分类
            onCategorySelect={() => {}} // 独立页面不需要切换分类
            onProductClick={onProductClick}
            hideHeader={true}
        />
        
        {/* Footer Area of the page */}
        <div className="py-24 flex justify-center">
            <button 
              onClick={onBack}
              className="text-sm uppercase tracking-widest border-b border-[#2C2A26] pb-1 hover:opacity-50 transition-opacity"
            >
                View All Collections
            </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
