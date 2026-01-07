
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product, JournalArticle } from './types';

export const BRAND_NAME = 'Elysoir';

export const PRODUCTS: Product[] = [
  {
    id: 'e1',
    name: 'Celestial Dawn Necklace',
    tagline: 'Gleam in Every Movement.',
    description: '18K Rose Gold with ethically sourced brilliance. A tribute to modern femininity.',
    longDescription: 'The Celestial Dawn necklace is a masterpiece of Elysoir\'s fine jewelry collection. Hand-crafted by master artisans, it features a fluid design that captures and refracts light from every angle.',
    price: 1850,
    category: 'Jewelry',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=1000',
    features: ['18K Rose Gold', 'Conflict-Free Diamonds', 'Signature Elysoir Box'],
    // Fix: OptionValue requires an object with a 'name' property, not a plain string.
    options: [{ name: 'Length', values: [{ name: '16"' }, { name: '18"' }, { name: '20"' }] }]
  },
  {
    id: 'e2',
    name: 'Elysian Timepiece No. 7',
    tagline: 'Time as an Art Form.',
    description: 'Sapphire crystal and Swiss movement. Minimalist elegance for the discerning woman.',
    longDescription: 'A timepiece that transcends trends. The Elysian Series combines Swiss precision with a sleek, ultra-thin ceramic profile.',
    price: 2400,
    category: 'Watches',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=1000',
    features: ['Swiss Quartz Movement', 'Water Resistant 5ATM', 'Italian Leather Strap'],
    // Fix: OptionValue requires an object with a 'name' property, not a plain string.
    options: [{ name: 'Strap', values: [{ name: 'Nude Leather' }, { name: 'Ivory Silk' }, { name: 'Rose Gold Mesh' }] }]
  },
  {
    id: 'e3',
    name: 'The Muse - Art Toy',
    tagline: 'Playful Sophistication.',
    description: 'Limited edition collectible figurine. A fusion of street culture and luxury aesthetics.',
    longDescription: 'Created in collaboration with renowned contemporary artists, "The Muse" is more than a toy—it\'s a statement piece for your curated space.',
    price: 450,
    category: 'Designer Toys',
    imageUrl: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=1000',
    features: ['Numbered Edition', 'Certificate of Authenticity', 'Premium Vinyl Finish'],
    // Fix: OptionValue requires an object with a 'name' property, not a plain string.
    options: [{ name: 'Edition', values: [{ name: 'Standard' }, { name: 'Chrome Noir (Exclusive)' }] }]
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
    {
        id: 1,
        title: "The Art of Curating Elegance",
        date: "May 15, 2025",
        excerpt: "Exploring why the blend of high-jewelry and art toys is the new standard for the modern collector.",
        image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=1000",
        content: React.createElement(React.Fragment, null,
            React.createElement("p", { className: "mb-6 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-[#5D5A53]" },
                "At Elysoir, we believe that luxury isn't about the price tag, but the emotional resonance of the object. Whether it's a watch passed down through generations or a designer toy that sparks a conversation, curation is key."
            )
        )
    }
];

export const PRIMARY_COLOR = 'stone-900'; 
export const ACCENT_COLOR = 'amber-600'; // 更偏向珠宝的金色调
