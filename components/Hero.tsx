/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';

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
    <section className="relative w-full h-screen min-h-[800px] overflow-hidden bg-[#2C2A26]">
      <div className="absolute inset-0 w-full h-full">
        <img 
            src="https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&q=80&w=2000" 
            alt="Elegant fashion model with jewelry" 
            className="w-full h-full object-cover grayscale-[0.3] brightness-[0.7] transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A26] via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <div className="animate-fade-in-up">
          <span className="block text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-white/80 mb-6 px-4 py-2 border border-white/20 rounded-full inline-block">
            Curated For Her
          </span>
          <h1 className="text-6xl md:text-9xl font-serif font-normal text-white tracking-tight mb-8">
            Elysoir <span className="italic text-[#EBE7DE]">Select.</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-white/70 font-light leading-relaxed mb-12">
            Independent boutique for boutique jewelry, designer art toys, <br className="hidden md:block"/> and sophisticated timepieces.
          </p>
          
          <a 
            href="#products" 
            onClick={(e) => handleNavClick(e, 'products')}
            className="group relative px-12 py-5 bg-white text-[#2C2A26] rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-[#EBE7DE] transition-all duration-500 shadow-2xl"
          >
            Explore Collection
          </a>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
