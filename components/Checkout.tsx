
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState } from 'react';
import { CartItem } from '../types';
import { wpService } from '../services/wpService';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onBack }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal;

  const handleFinalCheckout = () => {
    setIsRedirecting(true);
    const url = wpService.getCheckoutUrl(items);
    
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-serif text-[#2C2A26] mb-6">Secure Checkout</h1>
            <p className="text-[#5D5A53] font-light text-lg mb-12 leading-relaxed">
              You are about to be redirected to our secure payment gateway to complete your purchase. 
              All your items and selections will be synchronized automatically.
            </p>
            
            <button 
                onClick={handleFinalCheckout}
                disabled={isRedirecting || items.length === 0}
                className="w-full py-5 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-sm font-medium hover:bg-[#433E38] transition-all flex items-center justify-center gap-4"
            >
                {isRedirecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Syncing with Elysoir...
                  </>
                ) : (
                  `Proceed to Payment — $${total}`
                )}
            </button>
            
            <div className="mt-8 flex items-center gap-6 opacity-40 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
            </div>
          </div>

          <div className="lg:pl-12 lg:border-l border-[#D6D1C7]">
            <h2 className="text-xl font-serif text-[#2C2A26] mb-8">Your Selections</h2>
            
            <div className="space-y-6 mb-8">
               {items.map((item) => (
                 <div key={item.cartId} className="flex gap-4">
                    <div className="w-20 h-24 bg-[#EBE7DE] relative">
                       <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                       <h3 className="font-serif text-[#2C2A26] text-base">{item.name}</h3>
                       {item.selectedOptions && (
                          <div className="flex gap-2 mt-1">
                            {Object.entries(item.selectedOptions).map(([k, v]) => (
                               <span key={k} className="text-[10px] uppercase text-[#A8A29E]">{k}: {v}</span>
                            ))}
                          </div>
                       )}
                       <p className="text-xs text-[#A8A29E] mt-1">{item.category}</p>
                    </div>
                    <span className="text-sm text-[#5D5A53]">${item.price}</span>
                 </div>
               ))}
            </div>

            <div className="border-t border-[#D6D1C7] pt-6">
               <div className="flex justify-between items-center">
                 <span className="font-serif text-xl text-[#2C2A26]">Estimated Total</span>
                 <span className="font-serif text-2xl text-[#2C2A26]">${total}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
