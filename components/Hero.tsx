/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import heroImage from '@/assets/elg1.webp';

const Hero: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[70svh] min-h-[500px] overflow-hidden bg-[#2C2A26]">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img 
            src={heroImage} 
            alt="Elegant fashion model with jewelry" 
            className="w-full h-full object-cover grayscale-[0.2] brightness-[0.85] transition-all duration-1000"
        />
        {/* Soft linear gradient from bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>

      {/* Main Layout: Flex Column 2:1 split ensures no overlap */}
      <div className="relative z-10 w-full h-full flex flex-col">
        
        {/* Top Section (approx 66%) - Text Content pushed to bottom to avoid face */}
        {/* Changed justify-center to justify-end to lower the text block */}
        <div className="flex-[2] flex flex-col justify-end items-center px-4 w-full pb-2 md:pb-4">
            <div className="text-center animate-fade-in-up max-w-4xl mx-auto w-full">
                <span className="block text-[10px] md:text-sm font-medium uppercase tracking-[0.3em] text-white/90 mb-4 px-3 py-1.5 border border-white/20 rounded-full inline-block backdrop-blur-sm">
                    Curated For Her
                </span>
                
                <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-serif font-normal text-white tracking-tight mb-5 drop-shadow-lg leading-none break-words">
                    Elysoir <span className="italic text-[#EBE7DE]">Select.</span>
                </h1>
                
                {/* Optimized description: Larger text, tight spacing, responsive width */}
                <p className="max-w-xs md:max-w-xl mx-auto text-lg md:text-xl text-white/95 font-light leading-tight drop-shadow-md">
                    Independent boutique for boutique jewelry, <br className="hidden md:block" /> 
                    designer art toys, and sophisticated timepieces.
                </p>
            </div>
        </div>

        {/* Bottom Section (approx 33%) - CTA Button starts here */}
        <div className="flex-1 flex justify-center items-start pt-4 md:pt-6 w-full">
            <a 
                href="#products" 
                onClick={(e) => handleNavClick(e, 'products')}
                className="group relative px-10 py-4 md:px-12 md:py-5 bg-white text-[#2C2A26] rounded-full text-xs md:text-sm font-semibold uppercase tracking-widest hover:bg-[#EBE7DE] transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
            >
                Explore Collection
            </a>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
