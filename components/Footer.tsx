
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { wpService } from '../services/wpService';

interface FooterProps {
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  // New props for dynamic data
  categories?: string[]; 
  onCategoryClick?: (category: string) => void;
  onPageClick?: (pageId: number) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick, categories = [], onCategoryClick, onPageClick }) => {
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');
  
  // Local state for categories if not passed from parent (fallback)
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(categories);

  useEffect(() => {
    // If categories are not passed, fetch them
    if (categories.length === 0) {
        const fetchCats = async () => {
            try {
                const { categories: cats } = await wpService.fetchProducts();
                // Filter out 'All' if it exists, as we add 'All Products' manually
                setDynamicCategories(cats.filter(c => c !== 'All'));
            } catch (err) {
                console.error("Failed to fetch categories for footer", err);
            }
        };
        fetchCats();
    } else {
        setDynamicCategories(categories.filter(c => c !== 'All'));
    }
  }, [categories]);

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribeStatus('loading');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
    }, 1500);
  };

  const handlePageLink = (e: React.MouseEvent, pageId: number) => {
      e.preventDefault();
      if (onPageClick) {
          onPageClick(pageId);
      }
  };

  return (
    <footer className="bg-[#EBE7DE] pt-24 pb-12 px-6 text-[#5D5A53]">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        
        <div className="md:col-span-4">
          <h4 className="text-2xl font-serif text-[#2C2A26] mb-6">Elysoir</h4>
          <p className="max-w-xs font-light leading-relaxed">
            Curating luxury that feels as natural as the world around it.
            Born from vision, built for elegance.
          </p>
        </div>

        {/* 1. SHOP Column */}
        <div className="md:col-span-2">
          <h4 className="font-medium text-[#2C2A26] mb-6 tracking-wide text-sm uppercase">Shop</h4>
          <ul className="space-y-4 font-light">
            {/* Fixed First Item */}
            <li>
                <a 
                    href="#products" 
                    onClick={(e) => {
                        if (onCategoryClick) {
                            e.preventDefault();
                            onCategoryClick('All');
                        } else {
                            onLinkClick(e, 'products');
                        }
                    }} 
                    className="hover:text-[#2C2A26] transition-colors underline-offset-4 hover:underline"
                >
                    All Products
                </a>
            </li>
            
            {/* Dynamic Categories */}
            {dynamicCategories.map(cat => (
                <li key={cat}>
                    <a 
                        href={`#category-${cat}`} 
                        onClick={(e) => {
                            e.preventDefault();
                            if (onCategoryClick) onCategoryClick(cat);
                        }}
                        className="hover:text-[#2C2A26] transition-colors underline-offset-4 hover:underline"
                    >
                        {cat}
                    </a>
                </li>
            ))}
          </ul>
        </div>
        
        {/* 2. ABOUT Column */}
        <div className="md:col-span-2">
          <h4 className="font-medium text-[#2C2A26] mb-6 tracking-wide text-sm uppercase">About</h4>
          <ul className="space-y-4 font-light">
            <li>
                <a href="#" onClick={(e) => handlePageLink(e, 3)} className="hover:text-[#2C2A26] transition-colors underline-offset-4 hover:underline">
                    Privacy Policy
                </a>
            </li>
            <li>
                <a href="#" onClick={(e) => handlePageLink(e, 12)} className="hover:text-[#2C2A26] transition-colors underline-offset-4 hover:underline">
                    Shipping & Returns
                </a>
            </li>
            <li>
                <a href="#" onClick={(e) => handlePageLink(e, 414)} className="hover:text-[#2C2A26] transition-colors underline-offset-4 hover:underline">
                    Contact Us
                </a>
            </li>
            <li>
                <a href="#" onClick={(e) => handlePageLink(e, 4722)} className="hover:text-[#2C2A26] transition-colors underline-offset-4 hover:underline">
                    Terms & Conditions
                </a>
            </li>
             <li>
                <a href="#" onClick={(e) => handlePageLink(e, 4724)} className="hover:text-[#2C2A26] transition-colors underline-offset-4 hover:underline">
                    FAQ
                </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-medium text-[#2C2A26] mb-6 tracking-wide text-sm uppercase">Newsletter</h4>
          <div className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="email@address.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
              className="bg-transparent border-b border-[#A8A29E] py-2 text-lg outline-none focus:border-[#2C2A26] transition-colors placeholder-[#A8A29E]/70 text-[#2C2A26] disabled:opacity-50" 
            />
            <button 
              onClick={handleSubscribe}
              disabled={subscribeStatus !== 'idle' || !email}
              className="self-start text-sm font-medium uppercase tracking-widest mt-2 hover:text-[#2C2A26] disabled:cursor-default disabled:hover:text-[#5D5A53] disabled:opacity-50 transition-opacity"
            >
              {subscribeStatus === 'idle' && 'Subscribe'}
              {subscribeStatus === 'loading' && 'Subscribing...'}
              {subscribeStatus === 'success' && 'Subscribed'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-20 pt-8 border-t border-[#D6D1C7] flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest opacity-60">
        <p>&copy; {new Date().getFullYear()} Elysoir Boutique. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
