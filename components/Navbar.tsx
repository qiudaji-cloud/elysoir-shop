
/**
 * @license
 * SPDX1d-License-Identifier: Apache-2.0
*/ 

import React, { useState, useEffect, useMemo } from 'react';
import { BRAND_NAME } from '../constants';
import { Product } from '../types';

interface NavbarProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  categories: string[];
  products?: Product[]; // 用于在菜单中展示
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  onProductSelect?: (product: Product) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNavClick, 
  cartCount, 
  onOpenCart,
  categories = [],
  products = [],
  activeCategory,
  onCategorySelect,
  onProductSelect
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 移动端二级菜单状态：null = 一级菜单; string = 选中的分类名
  const [mobileDrillDownCategory, setMobileDrillDownCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 菜单关闭时重置状态
  useEffect(() => {
    if (!mobileMenuOpen) {
        // 延迟重置，等待动画结束
        const timer = setTimeout(() => setMobileDrillDownCategory(null), 500);
        return () => clearTimeout(timer);
    }
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    onNavClick(e, targetId);
  };

  const handleCartClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setMobileMenuOpen(false);
      onOpenCart();
  }

  // 筛选二级菜单的产品
  const drillDownProducts = useMemo(() => {
    if (!mobileDrillDownCategory || mobileDrillDownCategory === 'All') return [];
    return products.filter(p => 
        p.categories?.includes(mobileDrillDownCategory) || p.category === mobileDrillDownCategory
    );
  }, [mobileDrillDownCategory, products]);

  const isDarkTheme = scrolled || mobileMenuOpen;
  const textColorClass = isDarkTheme ? 'text-[#2C2A26]' : 'text-[#F5F2EB]';
  const iconStrokeColor = isDarkTheme ? '#2C2A26' : '#F5F2EB';

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          isDarkTheme ? 'bg-[#F5F2EB]/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          <button 
            className={`block md:hidden focus:outline-none transition-colors duration-500 ${textColorClass} z-50 relative p-2 -ml-2`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
               {mobileMenuOpen ? (
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               ) : (
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
               )}
             </svg>
          </button>

          <a 
            href="#" 
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavClick(e, ''); 
            }}
            className={`text-2xl md:text-3xl font-serif font-medium tracking-tight z-50 transition-colors duration-500 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 ${textColorClass}`}
          >
            {BRAND_NAME}
          </a>
          
          <div className={`hidden md:flex items-center gap-12 text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${textColorClass}`}>
            <a href="#products" onClick={(e) => handleLinkClick(e, 'products')} className="hover:opacity-50 transition-opacity">The Shop</a>
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:opacity-50 transition-opacity">Our Story</a>
            <a href="#journal" onClick={(e) => handleLinkClick(e, 'journal')} className="hover:opacity-50 transition-opacity">Journal</a>
          </div>

          <div className="flex items-center z-50 relative">
            <button 
              onClick={handleCartClick}
              className="relative p-2 group transition-all duration-300 active:scale-90"
              aria-label="View Cart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:-translate-y-0.5">
                <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11" stroke={iconStrokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 9H20L21 21H3L4 9Z" stroke={iconStrokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2C2A26] text-[#F5F2EB] text-[8px] font-bold flex items-center justify-center rounded-full border border-[#F5F2EB] animate-fade-in-up">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop Layer */}
      <div 
        className={`fixed inset-0 bg-[#2C2A26]/30 backdrop-blur-[2px] z-40 transition-opacity duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer (Partial Width 85%) */}
      <div className={`fixed inset-y-0 left-0 w-[85%] md:w-[400px] bg-[#F5F2EB] z-40 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl border-r border-[#D6D1C7] flex flex-col overflow-hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
          
          {/* Level 1: Main Menu & Categories */}
          <div className={`absolute inset-0 pt-28 pb-8 w-full flex flex-col transition-all duration-500 ease-in-out px-8 overflow-y-auto bg-[#F5F2EB] ${
              mobileDrillDownCategory ? '-translate-x-1/4 opacity-0 pointer-events-none' : 'translate-x-0 opacity-100 z-10'
          }`}>
              <div className="flex flex-col items-start space-y-6 text-2xl font-serif text-[#2C2A26] mt-4">
                <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:italic transition-all flex items-center gap-4 w-full group">
                    <span className="w-6 h-[1px] bg-[#2C2A26] transition-all group-hover:w-10"></span> Heritage
                </a>
                <a href="#journal" onClick={(e) => handleLinkClick(e, 'journal')} className="hover:italic transition-all flex items-center gap-4 w-full group">
                    <span className="w-6 h-[1px] bg-[#2C2A26] transition-all group-hover:w-10"></span> Journal
                </a>
              </div>

              <div className="w-full mt-12 flex flex-col space-y-8">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#A8A29E]">Collections</span>
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => {
                            if (cat === 'All') {
                                onCategorySelect('All');
                                setMobileMenuOpen(false);
                            } else {
                                setMobileDrillDownCategory(cat); // Trigger Level 2
                            }
                        }}
                        className="text-xl font-serif text-[#2C2A26] flex items-center justify-between group w-full text-left"
                    >
                        <span>{cat === 'All' ? 'View All' : cat}</span>
                        {cat !== 'All' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5 text-[#A8A29E] group-hover:text-[#2C2A26] transition-colors translate-x-0 group-hover:translate-x-1 duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        )}
                    </button>
                ))}
              </div>

               <div className="mt-auto pt-12 pb-8 w-full">
                    <button 
                        onClick={handleCartClick} 
                        className="text-xs uppercase tracking-[0.4em] font-sans font-bold flex items-center gap-4 group text-[#2C2A26]"
                    >
                        Cart 
                        <span className="w-6 h-6 rounded-full bg-[#2C2A26] text-white flex items-center justify-center text-[10px] group-hover:scale-110 transition-transform">
                        {cartCount}
                        </span>
                    </button>
               </div>
          </div>

          {/* Level 2: Nested Product List View */}
          <div className={`absolute inset-0 pt-24 w-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-[#F5F2EB] z-20 ${
              mobileDrillDownCategory ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
          }`}>
              {/* Fixed Header inside Drawer */}
              <div className="px-6 py-6 border-b border-[#D6D1C7] flex items-center justify-between shrink-0 bg-[#F5F2EB]">
                  <button 
                    onClick={() => setMobileDrillDownCategory(null)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors py-2"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                     </svg>
                     Back
                  </button>
                  <span className="font-serif text-lg text-[#2C2A26] truncate max-w-[150px]">{mobileDrillDownCategory}</span>
                  <div className="w-12"></div> {/* Spacer for alignment */}
              </div>

              {/* Scrollable Product List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-20">
                  {drillDownProducts.length === 0 ? (
                      <div className="text-center py-10 text-[#A8A29E] italic font-serif">
                          No products found in this collection.
                      </div>
                  ) : (
                      drillDownProducts.map(product => (
                          <div 
                             key={product.id}
                             onClick={() => {
                                 if (onProductSelect) {
                                     onProductSelect(product);
                                     setMobileMenuOpen(false);
                                     setMobileDrillDownCategory(null);
                                 }
                             }}
                             className="flex items-center gap-4 group cursor-pointer animate-fade-in-up"
                          >
                              <div className="w-14 h-14 bg-[#EBE7DE] shrink-0 overflow-hidden rounded-sm border border-transparent group-hover:border-[#D6D1C7] transition-all">
                                  <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                  />
                              </div>
                              <div className="flex flex-col items-start text-left overflow-hidden">
                                  <h4 className="font-serif text-base text-[#2C2A26] leading-tight truncate w-full group-hover:underline underline-offset-4 decoration-[#D6D1C7]">{product.name}</h4>
                                  <span className="text-[10px] uppercase tracking-widest text-[#A8A29E] mt-1">${product.price}</span>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>

      </div>
    </>
  );
};

export default Navbar;
