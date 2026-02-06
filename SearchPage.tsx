import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, AlertCircle } from 'lucide-react';

interface SearchPageProps {
  onNavigate: (view: any, params?: any) => void;
  onClose: () => void;
}

interface SearchMapping {
  keywords: string[];
  view: string;
  params?: { category: string };
  productMap?: Record<string, string>;
}

// Define search logic mappings
const SEARCH_MAPPINGS: SearchMapping[] = [
  // Office Series
  { 
    keywords: ['office', '办公', 'work', 's1', 'm2', 'l4', 'solo', 'meeting', 'studio', '商务'], 
    view: 'products', 
    params: { category: 'office' },
    productMap: {
        's1': 's1', 'solo': 's1',
        'm2': 'm2', 'meeting': 'm2',
        'l4': 'l4', 'studio': 'l4'
    }
  },
  // Home Series
  { 
    keywords: ['home', '家', 'sleep', 'study', 'music', 'sleep pod', 'music pod', 'study pod', '睡眠', '学习', '音乐', '卧室'], 
    view: 'products', 
    params: { category: 'home' },
    productMap: {
        'sleep': 'h-sleep', '睡眠': 'h-sleep',
        'study': 'h-study', '学习': 'h-study',
        'music': 'h-music', '音乐': 'h-music'
    }
  },
  // Accessories
  { 
    keywords: ['accessory', 'accessories', '配件', 'smart', 'panel', 'filter', 'air', '智能', '新风', 'hepa'], 
    view: 'products', 
    params: { category: 'accessories' },
    productMap: {
        'panel': 'a-panel', '智能': 'a-panel',
        'filter': 'a-filter', '新风': 'a-filter'
    }
  },
  // Pages
  { keywords: ['about', '关于', 'story', 'history', '公司', '介绍'], view: 'about' },
  { keywords: ['contact', '联系', 'support', 'help', '电话', '邮箱', '地址'], view: 'contact' },
  { keywords: ['custom', 'retail', '定制', 'configurator', 'diy', '颜色', '尺寸'], view: 'custom' },
];

const SearchPage: React.FC<SearchPageProps> = ({ onNavigate, onClose }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanQuery = query.trim().toLowerCase();
    
    if (!cleanQuery) return;

    let found = false;

    // Iterate through mappings with Fuzzy Logic
    for (const group of SEARCH_MAPPINGS) {
      // Fuzzy Match: Check if query contains keyword OR keyword contains query
      const isMatch = group.keywords.some(keyword => {
          const k = keyword.toLowerCase();
          return k.includes(cleanQuery) || cleanQuery.includes(k);
      });
      
      if (isMatch) {
        found = true;
        let finalParams: any = { ...group.params };

        // Check for specific product match if available (also fuzzy)
        if (group.productMap) {
            for (const [key, id] of Object.entries(group.productMap)) {
                if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
                    finalParams = { ...finalParams, productId: id };
                    break;
                }
            }
        }

        onNavigate(group.view, finalParams);
        break;
      }
    }

    if (!found) {
      setError('不好意思，您想找的商品不存在，请换一个试一试~');
      // Shake animation trigger could go here
    } else {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl flex flex-col items-center pt-32 px-6">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
      >
        <X size={32} />
      </button>

      <div className="w-full max-w-3xl">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={32} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if(error) setError('');
                    }}
                    placeholder="搜索产品、系列或服务..."
                    className="w-full bg-transparent border-b-2 border-slate-200 py-6 pl-12 pr-16 text-3xl md:text-5xl font-bold text-slate-900 placeholder-slate-300 outline-none focus:border-blue-600 transition-all"
                />
                <button 
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-slate-400 hover:text-blue-600 transition-colors"
                >
                    <ArrowRight size={32} />
                </button>
            </form>
        </motion.div>

        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-8 flex items-center gap-3 text-red-500 bg-red-50 px-6 py-4 rounded-xl"
                >
                    <AlertCircle size={24} />
                    <span className="font-medium">{error}</span>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-16"
        >
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">推荐搜索</p>
            <div className="flex flex-wrap gap-4">
                {['S1 个人舱', '家用静音', '新风系统', '企业定制', '联系我们'].map((tag, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setQuery(tag);
                            // Optional: auto trigger search
                            // handleSearch(); 
                        }}
                        className="px-6 py-3 rounded-full bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 hover:text-slate-900 transition-colors"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;