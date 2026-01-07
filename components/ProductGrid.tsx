
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  onProductClick: (product: Product) => void;
  hideHeader?: boolean; // 新增：是否隐藏默认的标题和筛选栏
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  categories, 
  activeCategory, 
  onCategorySelect, 
  onProductClick,
  hideHeader = false // 默认为 false，即显示
}) => {
  
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => 
        p.categories?.includes(activeCategory) || p.category === activeCategory
    );
  }, [activeCategory, products]);

  return (
    <section id="products" className={`${hideHeader ? 'py-0' : 'py-32'} px-6 md:px-12 bg-[#F5F2EB]`}>
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header Area - 只有在非隐藏模式下才显示 */}
        {!hideHeader && (
          <div className="flex flex-col items-center text-center mb-24 space-y-8">
            <h2 className="text-4xl md:text-6xl font-serif text-[#2C2A26]">The Collection</h2>
            
            {/* Minimal Filter */}
            <div className="flex flex-wrap justify-center gap-8 pt-4 border-t border-[#D6D1C7]/50 w-full max-w-2xl">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  className={`text-sm uppercase tracking-widest pb-1 border-b transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'border-[#2C2A26] text-[#2C2A26]' 
                      : 'border-transparent text-[#A8A29E] hover:text-[#2C2A26]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Large Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={onProductClick} />
          ))}
          
          {/* Empty State for Categories */}
          {filteredProducts.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#A8A29E]">
                <p className="font-serif text-xl italic">No pieces currently available in this collection.</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
