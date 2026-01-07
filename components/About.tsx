/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="bg-[#EBE7DE]">
      
      <div className="py-24 px-6 md:px-12 max-w-[1800px] mx-auto flex flex-col md:flex-row items-start gap-16 md:gap-32">
        <div className="md:w-1/3">
          <h2 className="text-4xl md:text-6xl font-serif text-[#2C2A26] leading-tight">
            Curating Elegance, <br/> Defining Moments.
          </h2>
        </div>
        <div className="md:w-2/3 max-w-2xl">
          <p className="text-lg md:text-xl text-[#5D5A53] font-light leading-relaxed mb-8">
            Elysoir was born from a desire to bridge the gap between timeless high-jewelry and the vibrant energy of contemporary art toys. We believe that modern luxury is a conversation between heritage and play.
          </p>
          <p className="text-lg md:text-xl text-[#5D5A53] font-light leading-relaxed mb-8">
            From the precision of our Swiss-movement watches to the whimsical charm of our limited-edition figurines, every piece in our boutique is chosen for its ability to resonate with the modern woman's multifaceted life.
          </p>
          <img 
            src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80&w=1200" 
            alt="Elysoir Luxury Boutique" 
            className="w-full h-[400px] object-cover contrast-[1.1] brightness-90 mt-12"
          />
          <p className="text-sm font-medium uppercase tracking-widest text-[#A8A29E] mt-4">
            The Elysoir Collective, Flagship Studio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="order-2 lg:order-1 relative h-[500px] lg:h-auto overflow-hidden group">
           <img 
             src="https://images.unsplash.com/photo-1610289121008-b74002fa438d?auto=format&fit=crop&q=80&w=1200" 
             alt="Luxury Jewelry Detail" 
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
           />
        </div>
        <div className="order-1 lg:order-2 flex flex-col justify-center p-12 lg:p-24 bg-[#D6D1C7]">
           <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5D5A53] mb-6">The Craft</span>
           <h3 className="text-4xl md:text-5xl font-serif mb-8 text-[#2C2A26] leading-tight">
             Beyond the Brilliance.
           </h3>
           <p className="text-lg text-[#5D5A53] font-light leading-relaxed mb-12 max-w-md">
             We work exclusively with ethical suppliers and master craftsmen to ensure that your jewelry is as conscientious as it is beautiful.
           </p>
        </div>
      </div>
    </section>
  );
};

export default About;
