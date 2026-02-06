import React from 'react';
import { motion } from 'framer-motion';
import { useData, getIconByName } from '../contexts/DataContext';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface ProductShowcaseProps {
    onNavigate?: (view: 'products', params: { category: string, productId?: string }) => void;
}

const CategoryCard: React.FC<{ category: any; index: number; onClick: () => void; onProductClick: (id: string) => void }> = ({ category, index, onClick, onProductClick }) => {
  // Use explicit coverImage if available, otherwise fall back to first item image
  const coverImage = category.coverImage || category.items?.[0]?.image || 'https://picsum.photos/800/800?grayscale';
  
  // Filter products that are marked to show on home
  const featuredProducts = category.items?.filter((item: any) => item.showOnHome) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      onClick={onClick}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full cursor-pointer"
    >
      {/* Visual Area */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
         <motion.div 
            className="w-full h-full relative"
         >
            <img
              src={coverImage}
              alt={category.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            
            {/* Icon Badge */}
            <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg">
                 {getIconByName(category.iconType, 20)}
            </div>
         </motion.div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-blue-600 font-bold text-xs tracking-wider uppercase mb-2 block">Series Collection</span>
            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{category.title}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-rotate-45">
             <ArrowRight size={20} />
          </div>
        </div>
        
        {/* Dynamic Product List instead of Static Description */}
        <div className="flex-1">
             {featuredProducts.length > 0 ? (
                 <div className="flex flex-col gap-3">
                     {featuredProducts.map((prod: any) => (
                         <button
                            key={prod.id}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                onProductClick(prod.id);
                            }}
                            className="text-left flex items-center justify-between group/item p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                         >
                             <div className="flex flex-col">
                                 <span className="text-sm font-bold text-slate-700 group-hover/item:text-blue-600 transition-colors">
                                     {prod.model}
                                 </span>
                                 <span className="text-xs text-slate-400">{prod.name}</span>
                             </div>
                             <ArrowUpRight size={14} className="text-slate-300 group-hover/item:text-blue-600 opacity-0 group-hover/item:opacity-100 transition-all transform translate-y-2 group-hover/item:translate-y-0" />
                         </button>
                     ))}
                 </div>
             ) : (
                 <p className="text-slate-400 text-sm italic">暂无推荐产品</p>
             )}
        </div>
      </div>
    </motion.div>
  );
};

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onNavigate }) => {
  const { productCategories } = useData();
  
  // We strictly show the 3 main categories: Office, Home, Accessories
  // Filter ensures we have data, but usually productCategories is populated.
  const categoriesToShow = productCategories.slice(0, 3);

  const handleCategoryClick = (categoryId: string) => {
      if (onNavigate) {
          onNavigate('products', { category: categoryId });
      }
  };

  const handleProductClick = (categoryId: string, productId: string) => {
      if (onNavigate) {
          onNavigate('products', { category: categoryId, productId });
      }
  };

  return (
    <section id="products" className="py-24 bg-pearl">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            QE-SPACE 矩阵
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500"
          >
            从商用到居家，全场景声学空间解决方案。
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoriesToShow.map((category: any, index: number) => (
            <CategoryCard 
                key={category.id} 
                category={category} 
                index={index} 
                onClick={() => handleCategoryClick(category.id)}
                onProductClick={(productId) => handleProductClick(category.id, productId)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;