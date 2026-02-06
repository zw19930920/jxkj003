import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Check, Star, X, ArrowRight as ArrowRightIcon } from 'lucide-react';
import Button from './Button';
import { useData, getIconByName } from '../contexts/DataContext';

interface ProductListingProps {
    initialCategory?: string;
    initialProductId?: string;
    onNavigate?: (view: 'custom') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] as [number, number, number, number] } }
};

// Simple Input Field Component for Modal
const InputField = ({ label, type = "text", placeholder = "", value, onChange, required = false }: any) => (
    <div className="relative group">
        <input 
            type={type} 
            className="w-full bg-transparent border-b border-slate-300 py-3 text-lg text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 transition-colors"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
        />
        <label className="absolute -top-3 left-0 text-xs text-slate-500 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 group-focus-within:w-full transition-all duration-500" />
    </div>
);

const ProductListing: React.FC<ProductListingProps> = ({ initialCategory, initialProductId, onNavigate }) => {
  const { productCategories, addLead } = useData();
  const [activeCategory, setActiveCategory] = useState(productCategories[0]?.id || 'office');
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  
  // Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', email: '' });

  // Sync with initialCategory and initialProductId props
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
    if (initialProductId) {
        setActiveProductId(initialProductId);
    } else {
        setActiveProductId(null);
    }
  }, [initialCategory, initialProductId]);

  const currentCategoryData = productCategories.find(c => c.id === activeCategory);
  const activeProduct = currentCategoryData?.items.find((item: any) => item.id === activeProductId);

  const handleBookingSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validation: Phone is required
      if (!bookingForm.phone) {
          alert("请填写联系电话");
          return;
      }

      const productName = activeProduct ? activeProduct.model : 'General Product Inquiry';
      const message = `预约产品体验。感兴趣的产品：${productName}`;

      addLead({
          name: bookingForm.name || 'Anonymous',
          phone: bookingForm.phone,
          email: bookingForm.email || '',
          message: message,
          source: 'ProductPage'
      });

      alert("体验预约已提交！我们会尽快联系您。");
      setIsBookingOpen(false);
      setBookingForm({ name: '', phone: '', email: '' });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-24 md:pt-0 flex flex-col md:flex-row overflow-hidden">
      
      {/* 1. Left Sidebar (Sticky & Glassmorphism) */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 pt-32 pb-12 px-6 border-r border-slate-200/60 bg-white/70 backdrop-blur-xl z-10 shrink-0 overflow-y-auto scrollbar-hide">
        <div className="mb-10 px-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">产品中心</h2>
          <p className="text-sm text-slate-400 mt-2">探索静谧的无限可能</p>
        </div>

        <nav className="flex-1 space-y-1">
          {productCategories.map((cat) => (
            <div key={cat.id} className="flex flex-col">
                {/* Main Category Button */}
                <button
                onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveProductId(null); // Clicking main category shows grid
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium relative group ${
                    activeCategory === cat.id && !activeProductId
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
                >
                    <span className={`transition-transform duration-300 ${activeCategory === cat.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {getIconByName(cat.iconType, 18)}
                    </span>
                    <span>{cat.title}</span>
                    
                    {/* Active Indicator (Only if grid is showing) */}
                    {activeCategory === cat.id && !activeProductId && (
                        <motion.div 
                            layoutId="active-pill"
                            className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </button>

                {/* Sub-menu Items (Expanded if category is active) */}
                <AnimatePresence>
                    {activeCategory === cat.id && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4 pl-4 border-l border-slate-200 mt-1 mb-2 space-y-1"
                        >
                            {cat.items.map((item: any) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveProductId(item.id)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                        activeProductId === item.id
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{item.model}</span>
                                        {activeProductId === item.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                    </div>
                                    <span className="block text-[10px] text-slate-400 mt-0.5 truncate">{item.name}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="mt-auto px-2">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <p className="text-xs text-blue-600 font-semibold mb-1">企业定制</p>
                <p className="text-xs text-slate-500 leading-relaxed">需要为您的办公空间量身定制方案？</p>
                <button 
                    onClick={() => onNavigate && onNavigate('custom')}
                    className="mt-3 text-xs font-medium text-slate-900 flex items-center gap-1 hover:gap-2 transition-all"
                >
                    预约定制 <ChevronRight size={12} />
                </button>
            </div>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden fixed top-[72px] left-0 right-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 overflow-x-auto">
        <div className="flex px-6 py-3 space-x-4 min-w-max">
            {productCategories.map((cat) => (
                <button
                key={cat.id}
                onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveProductId(null);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
                >
                {cat.title}
                </button>
            ))}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-[#F5F5F7] scroll-smooth">
        {/* Subtle Ambient Background */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] opacity-60 animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-32 relative z-10 h-full">
          
            <AnimatePresence mode="wait">
                {activeProductId && activeProduct ? (
                    // ------------------ SINGLE PRODUCT DETAIL VIEW ------------------
                    <motion.div
                        key="product-detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="h-full flex flex-col"
                    >
                        <div className="mb-8">
                            <button 
                                onClick={() => setActiveProductId(null)}
                                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium mb-6 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 group-hover:border-slate-300">
                                    <ArrowLeft size={16} />
                                </div>
                                返回 {currentCategoryData?.title} 列表
                            </button>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-12 xl:gap-24">
                            {/* Product Image Section */}
                            <div className="flex-1 relative">
                                <div className="aspect-square rounded-[3rem] bg-white border border-slate-100 p-12 flex items-center justify-center relative overflow-hidden shadow-sm">
                                    <div className="absolute inset-0 bg-gradient-radial from-slate-50 to-transparent opacity-50" />
                                    <motion.img 
                                        src={activeProduct.image} 
                                        alt={activeProduct.name}
                                        className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                    />
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-400 text-center mt-4">图片为样式展示，仅供参考实际尺寸与具体样式请联系我们</p>
                            </div>

                            {/* Product Info Section */}
                            <div className="flex-1 flex flex-col justify-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wider uppercase">
                                            {activeProduct.model}
                                        </span>
                                        <div className="flex gap-1">
                                            {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                                        </div>
                                    </div>
                                    
                                    <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-4">{activeProduct.name}</h1>
                                    {(activeProduct.showPrice !== false) && (
                                        <p className="text-2xl font-medium text-slate-900 mb-6">{activeProduct.price}</p>
                                    )}
                                    
                                    <p className="text-slate-500 leading-relaxed text-lg mb-8 max-w-lg">
                                        {activeProduct.desc}
                                    </p>

                                    {/* Core Specs */}
                                    <div className="grid grid-cols-3 gap-4 mb-10">
                                        {activeProduct.specs.map((spec: any, idx: number) => (
                                            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                                                <div className="flex justify-center mb-2 text-slate-400">
                                                    {/* We try to guess the icon or just render text if it's dynamic */}
                                                    {getIconByName('Activity')} 
                                                </div>
                                                <div className="font-bold text-slate-900 text-lg">{spec.label}</div>
                                                <div className="text-xs text-slate-400 mt-1">{spec.text}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Feature List */}
                                    <div className="mb-10 space-y-3">
                                        {activeProduct.features?.map((feature: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 text-slate-700">
                                                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                                    <Check size={12} />
                                                </div>
                                                <span className="text-sm font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button className="px-12 w-full sm:w-auto" onClick={() => setIsBookingOpen(true)}>立即购买 / 咨询</Button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // ------------------ GRID VIEW (Default) ------------------
                    <motion.div
                        key="grid-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Header Section */}
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-16"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-4">
                            {currentCategoryData?.title}
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl">
                            结合极简美学与声学科技，重新定义空间的边界。
                            </p>
                        </motion.div>

                        {/* Product Grid */}
                        <motion.div
                        key={activeCategory + "-grid"}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                        >
                        {currentCategoryData?.items.map((item: any) => (
                            <motion.div
                            key={item.id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            onClick={() => setActiveProductId(item.id)}
                            className="group relative bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer overflow-hidden border border-slate-100/50"
                            >
                            {/* Card Content */}
                            <div className="relative z-20 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">New</p>
                                        <h3 className="text-2xl font-bold text-[#1D1D1F]">{item.model}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{item.name}</p>
                                    </div>
                                    {/* More Button */}
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>

                                {/* Image Area */}
                                <div className="flex-1 relative min-h-[240px] flex items-center justify-center mb-8">
                                    <div className="absolute inset-0 bg-gradient-radial from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-150" />
                                    <motion.img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-contain relative z-10 transition-transform duration-700 ease-out group-hover:scale-110"
                                        layoutId={`product-image-${item.id}`} // Magic Move
                                    />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-xl rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 translate-y-4 group-hover:translate-y-6" />
                                </div>

                                <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-2">
                                    {item.desc}
                                </p>

                                {/* Quick Specs */}
                                <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100">
                                    {item.specs.map((spec: any, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center justify-center text-center gap-1 text-slate-400 group-hover:text-slate-600 transition-colors">
                                            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                 {getIconByName('Activity')}
                                            </div>
                                            <span className="text-[10px] font-medium tracking-wide">{spec.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </motion.div>
                        ))}
                        </motion.div>
                        
                        <div className="mt-20 text-center">
                            <p className="text-slate-400 text-sm mb-6">不确定哪款适合您？</p>
                            <Button variant="secondary" className="px-12" onClick={() => setIsBookingOpen(true)}>
                                预约线下体验
                            </Button>
                        </div>

                        <footer className="mt-24 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between text-xs text-slate-400">
                            <p>Copyright © 2024 QE.SPACE Inc.</p>
                            <div className="flex gap-4 mt-2 md:mt-0">
                                <a href="#" className="hover:text-slate-600">Privacy</a>
                                <a href="#" className="hover:text-slate-600">Terms</a>
                                <a href="#" className="hover:text-slate-600">Sales Policy</a>
                            </div>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
            
        </div> {/* Closing div for container */}
      </main>
    </div>
  );
};

export default ProductListing;