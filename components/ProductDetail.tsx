
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Product, ProductOption } from '../types';
import { wpService } from '../services/wpService';
import DOMPurify from 'dompurify';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, options?: Record<string, string>) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isVariationsLoading, setIsVariationsLoading] = useState(false);
  const [richOptions, setRichOptions] = useState<ProductOption[]>(product.options || []);
  
  // 预先清洗描述内容
  const sanitizedDescription = DOMPurify.sanitize(product.longDescription || product.description);
  
  // 轮播图状态
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 合并主图和相册，确保去重且主图在第一位
  const productImages = React.useMemo(() => {
    const imgs = product.gallery && product.gallery.length > 0 
      ? product.gallery 
      : [product.imageUrl];
    return Array.from(new Set(imgs)); // 简单去重
  }, [product]);

  // 当切换产品时，重置图片索引
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  // 加载变体数据以获取具体的 SKU 图片
  useEffect(() => {
    const loadVariations = async () => {
      if (product.hasVariations) {
        setIsVariationsLoading(true);
        try {
          const vars = await wpService.fetchProductVariations(product.id);
          
          if (product.options) {
            const updatedOptions = product.options.map(opt => ({
              ...opt,
              values: opt.values.map(val => {
                const matchedVar = vars.find((v: any) => 
                  v.attributes.some((attr: any) => 
                    (attr.name.toLowerCase() === opt.name.toLowerCase() || attr.name.toLowerCase() === `pa_${opt.name.toLowerCase()}`) && 
                    attr.option.toLowerCase() === val.name.toLowerCase()
                  )
                );
                
                return {
                  ...val,
                  image: matchedVar?.image?.src || val.image
                };
              })
            }));
            setRichOptions(updatedOptions);
          }
        } catch (err) {
          console.error("Failed to fetch variation details", err);
        } finally {
          setIsVariationsLoading(false);
        }
      }
    };
    loadVariations();
  }, [product]);

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
    setError(null);
  };

  const handleAddToCart = () => {
    if (richOptions.length > 0) {
      const allSelected = richOptions.every(opt => selectedOptions[opt.name]);
      if (!allSelected) {
        setError("Please select all options to proceed");
        return;
      }
    }
    onAddToCart(product, selectedOptions);
  };

  return (
    <div className="pt-24 min-h-screen bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-24">
        
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* 左侧：图片展示区 (Carousel) */}
          <div className="flex flex-col gap-6">
            {/* 主图 */}
            <div className="w-full aspect-[4/5] bg-[#EBE7DE] overflow-hidden shadow-sm relative group">
              <img 
                src={productImages[currentImageIndex]} 
                alt={`${product.name} - View ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-700"
              />
              
              {/* 左右切换箭头 (仅当有多张图时显示) */}
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#2C2A26] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#2C2A26] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* 缩略图导航 (仅当有多张图时显示) */}
            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`shrink-0 w-20 h-20 bg-[#EBE7DE] overflow-hidden transition-all duration-300 ${
                      currentImageIndex === idx 
                        ? 'opacity-100 ring-1 ring-[#2C2A26]' 
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-start max-w-xl">
             <span className="text-sm font-medium text-[#A8A29E] uppercase tracking-widest mb-2">{product.category}</span>
             <h1 className="text-4xl md:text-5xl font-serif text-[#2C2A26] mb-4 tracking-tight">{product.name}</h1>
             <span className="text-2xl font-light text-[#2C2A26] mb-8">${product.price}</span>
             
             <div className="space-y-10 mb-12">
               {richOptions.map((option) => (
                  <div key={option.name}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C2A26]">
                        {option.name}: <span className="font-light text-[#A8A29E] ml-2">{selectedOptions[option.name] || 'Select'}</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      {option.values.map(val => (
                        <button 
                          key={val.name}
                          onClick={() => handleOptionSelect(option.name, val.name)}
                          className={`group relative transition-all duration-300 ${
                            selectedOptions[option.name] === val.name ? 'scale-105' : 'hover:scale-105'
                          }`}
                        >
                          <div className={`w-14 h-14 md:w-16 md:h-16 overflow-hidden border transition-all duration-500 ${
                            selectedOptions[option.name] === val.name 
                              ? 'border-[#2C2A26] shadow-lg scale-100' 
                              : 'border-[#D6D1C7] bg-white opacity-60 hover:opacity-100'
                          }`}>
                            {val.image ? (
                              <img src={val.image} alt={val.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-center p-1 leading-tight uppercase tracking-tighter bg-[#EBE7DE]">
                                  {val.name}
                              </div>
                            )}
                          </div>
                          
                          {selectedOptions[option.name] === val.name && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2C2A26] rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
               ))}
               
               {isVariationsLoading && (
                  <div className="flex items-center gap-2 text-[#A8A29E] text-[10px] uppercase tracking-widest italic">
                    <div className="w-2 h-2 border-t border-[#2C2A26] rounded-full animate-spin"></div>
                    Syncing attributes...
                  </div>
               )}
             </div>

             <div className="flex flex-col gap-4">
               {error && <p className="text-red-800 text-[10px] font-bold uppercase tracking-widest mb-2 animate-bounce">{error}</p>}
               <button 
                 onClick={handleAddToCart}
                 className="w-full py-5 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-sm font-medium hover:bg-[#433E38] transition-all duration-500 shadow-lg active:scale-[0.98]"
               >
                 Add to Cart — ${product.price}
               </button>
               
               <div className="mt-12 pt-10 border-t border-[#D6D1C7]/50">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A8A29E] mb-6">Details</h4>
                  {/* 使用清洗后的安全 HTML */}
                  <div 
                    className="prose prose-stone prose-sm max-w-none text-[#5D5A53] font-serif leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
               </div>

               <div className="mt-8 space-y-4 pt-8 border-t border-[#D6D1C7]/30">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A8A29E]">Specifications</h4>
                  <ul className="grid grid-cols-1 gap-2 text-[11px] text-[#5D5A53] uppercase tracking-widest font-light">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-[#D6D1C7] rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
