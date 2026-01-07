
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CategoryPage from './components/CategoryPage'; // 新增导入
import About from './components/About';
import Journal from './components/Journal';
import Assistant from './components/Assistant';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import JournalDetail from './components/JournalDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import { Product, CartItem, ViewState, JournalArticle } from './types';
import { wpService } from './services/wpService';
import { PRODUCTS as FALLBACK_PRODUCTS, JOURNAL_ARTICLES as FALLBACK_ARTICLES } from './constants';

function App() {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  // 全局管理当前选中的分类（用于首页）
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('');

  const refreshData = useCallback(async () => {
    const { products: wpProducts, categories: wpCategories } = await wpService.fetchProducts();
    const wpArticles = await wpService.fetchArticles();
    
    setProducts(wpProducts.length > 0 ? wpProducts : FALLBACK_PRODUCTS);
    setCategories(wpCategories);
    setArticles(wpArticles.length > 0 ? wpArticles : FALLBACK_ARTICLES);
    setLastSync(new Date().toLocaleTimeString());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (view.type !== 'home') {
      setView({ type: 'home' });
      // 如果点击的是 Logo 或 Home，重置首页分类为 All
      if (targetId === '' || targetId === 'products') {
        setActiveCategory('All');
      }
      setTimeout(() => scrollToSection(targetId), 0);
    } else {
      scrollToSection(targetId);
    }
  };

  const handleProductClick = (p: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView({ type: 'product', product: p });
  };

  // 修改：处理分类点击
  // 如果是 'All'，回到首页并滚动。
  // 如果是具体分类，进入独立的分类页面。
  const handleCategorySelect = (category: string) => {
    if (category === 'All') {
        setActiveCategory('All');
        setView({ type: 'home' });
        setTimeout(() => scrollToSection('products'), 0);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setView({ type: 'category', category: category });
    }
  };

  const scrollToSection = (targetId: string) => {
    if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const addToCart = (product: Product, options?: Record<string, string>) => {
    const cartItem: CartItem = {
      ...product,
      selectedOptions: options,
      cartId: `${product.id}-${Date.now()}`
    };
    setCartItems([...cartItems, cartItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#D6D1C7] border-t-[#2C2A26] rounded-full animate-spin"></div>
          <span className="font-serif italic text-[#A8A29E]">Elysoir is connecting to the boutique...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-[#2C2A26] selection:bg-[#D6D1C7] selection:text-[#2C2A26]">
      {view.type !== 'checkout' && (
        <Navbar 
            onNavClick={handleNavClick} 
            cartCount={cartItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            categories={categories}
            products={products} // 传递产品列表给导航栏
            activeCategory={view.type === 'category' ? view.category : activeCategory}
            onCategorySelect={handleCategorySelect}
            onProductSelect={handleProductClick} // 传递产品点击处理函数
        />
      )}
      
      <main>
        {view.type === 'home' && (
          <>
            <Hero />
            <ProductGrid 
              products={products}
              categories={categories}
              activeCategory={activeCategory}
              onCategorySelect={(cat) => {
                  setActiveCategory(cat);
              }}
              onProductClick={handleProductClick} 
            />
            <About />
            <Journal 
              articles={articles}
              onArticleClick={(a) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'journal', article: a });
              }} 
            />
          </>
        )}

        {/* 新增：独立分类页面渲染 */}
        {view.type === 'category' && (
            <CategoryPage 
                category={view.category}
                products={products} // CategoryPage 内部会根据 category 进行过滤
                categories={categories}
                onProductClick={handleProductClick}
                onBack={() => {
                    setView({ type: 'home' });
                    setActiveCategory('All');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />
        )}

        {view.type === 'product' && (
          <ProductDetail 
            product={view.product} 
            onBack={() => {
              // 智能返回：如果之前是在分类页，理想情况是返回分类页，这里简化为返回首页或分类页逻辑
              setView({ type: 'home' });
              setTimeout(() => scrollToSection('products'), 50);
            }}
            onAddToCart={addToCart}
          />
        )}

        {view.type === 'journal' && (
          <JournalDetail 
            article={view.article} 
            onBack={() => setView({ type: 'home' })}
          />
        )}

        {view.type === 'checkout' && (
            <Checkout 
                items={cartItems}
                onBack={() => setView({ type: 'home' })}
            />
        )}
      </main>

      {view.type !== 'checkout' && <Footer onLinkClick={handleNavClick} />}
      
      {/* <Assistant 
        products={products} 
        onSync={refreshData}
        lastSync={lastSync}
      /> */}
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
            setIsCartOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setView({ type: 'checkout' });
        }}
      />
    </div>
  );
}

export default App;
