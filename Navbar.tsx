import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Building2, MapPin, Search, Briefcase, Home, Cpu } from 'lucide-react';
import { NAV_LINKS, PRODUCTS } from '../constants';
import { MenuCategory } from '../types';
import { useData } from '../contexts/DataContext';

interface NavbarProps {
  onNavigate?: (page: 'landing' | 'products' | 'about' | 'custom' | 'contact' | 'search', params?: any) => void;
  currentView?: 'landing' | 'products' | 'about' | 'custom' | 'contact' | 'search';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const { siteConfig } = useData();
  const [activeMenu, setActiveMenu] = useState<MenuCategory>(MenuCategory.NONE);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (key: string) => {
    // Enable hover menu for Products and About
    if (key === 'products') {
      setActiveMenu(MenuCategory.PRODUCTS);
    } else if (key === 'about') {
      setActiveMenu(MenuCategory.ABOUT);
    } else {
      setActiveMenu(MenuCategory.NONE);
    }
  };

  const handleMouseLeave = () => {
    setActiveMenu(MenuCategory.NONE);
  };

  const handleLinkClick = (e: React.MouseEvent, key: string) => {
    // Handle specific page navigation for main links
    if (key === 'products') {
      e.preventDefault();
      if (onNavigate) onNavigate('products');
      setMobileMenuOpen(false);
      window.scrollTo(0, 0);
    } else if (key === 'about') {
        e.preventDefault();
        if (onNavigate) onNavigate('about');
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    } else if (key === 'custom') {
        e.preventDefault();
        if (onNavigate) onNavigate('custom');
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    } else if (key === 'contact') {
        e.preventDefault();
        if (onNavigate) onNavigate('contact');
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    } else {
      // For other links, if we are on internal pages, go back home first
      if ((currentView === 'products' || currentView === 'about' || currentView === 'custom' || currentView === 'contact') && onNavigate) {
         e.preventDefault();
         onNavigate('landing');
         // Small timeout to allow render before scrolling
         setTimeout(() => {
            const element = document.getElementById(key);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
         }, 100);
      }
      setMobileMenuOpen(false);
    }
    setActiveMenu(MenuCategory.NONE);
  };

  const handleSubMenuCategoryClick = (category: string) => {
      if (onNavigate) onNavigate('products', { category });
      setMobileMenuOpen(false);
      setActiveMenu(MenuCategory.NONE);
  };

  const handleSubMenuClick = (target: 'intro' | 'offline') => {
      if (onNavigate) onNavigate('about');
      setMobileMenuOpen(false);
      setActiveMenu(MenuCategory.NONE);

      setTimeout(() => {
          if (target === 'intro') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (target === 'offline') {
              const element = document.getElementById('offline-experience');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
          }
      }, 100);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (onNavigate) onNavigate('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
      if (onNavigate) onNavigate('search');
  };

  // Logic to determine text color. 
  let isDarkText = isScrolled;
  if (!isScrolled) {
      if (currentView === 'products' || currentView === 'custom' || currentView === 'contact') isDarkText = true;
      else if (currentView === 'landing' || currentView === 'about') isDarkText = false;
  }

  // Define product categories for the dropdown - Updated to Lucide Icons to match About style
  const PRODUCT_CATEGORIES = [
      { id: 'office', name: 'QE.SPACE 办公系列', icon: <Briefcase size={24} />, desc: '专注与协作的完美平衡' },
      { id: 'home', name: 'QE.SPACE 家用系列', icon: <Home size={24} />, desc: '家庭中的静谧港湾' },
      { id: 'accessories', name: 'QE.SPACE 精选配件', icon: <Cpu size={24} />, desc: '智能升级您的空间' },
  ];

  // Define About Us items for the dropdown
  const ABOUT_ITEMS = [
    { 
        id: 'intro', 
        name: '公司介绍', 
        icon: <Building2 size={24} />, 
        desc: '了解极静空间的品牌故事与愿景', 
        target: 'intro' 
    },
    { 
        id: 'offline', 
        name: '线下体验', 
        icon: <MapPin size={24} />, 
        desc: '亲临全国体验店感受静谧', 
        target: 'offline' 
    }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || currentView === 'products' || currentView === 'custom' || currentView === 'contact' ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" onClick={handleLogoClick} className="relative z-50 flex items-center gap-3 group">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
                 <img 
                    src={siteConfig.logoUrl || "https://cdn-icons-png.flaticon.com/512/2919/2919601.png"} 
                    alt={siteConfig.siteName} 
                    className="h-full w-full object-contain" 
                 />
            </div>

            <div className={`flex items-center gap-2 transition-colors duration-300 ${isDarkText ? 'text-slate-900' : 'text-white'}`}>
                <span className="text-sm font-bold tracking-widest">静享空间</span>
                <span className="text-sm font-light tracking-widest opacity-80">QE.SPACE</span>
            </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {NAV_LINKS.map((link) => (
            <div
              key={link.key}
              onMouseEnter={() => handleMouseEnter(link.key)}
              className="relative py-2"
            >
              <a
                href={`#${link.key}`}
                onClick={(e) => handleLinkClick(e, link.key)}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isDarkText || activeMenu !== MenuCategory.NONE ? 'text-slate-600 hover:text-midnight' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </a>
              {/* Active Indicator */}
              {activeMenu === link.key && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-midnight"
                />
              )}
            </div>
          ))}
          
          {/* Search Icon */}
          <button 
            onClick={handleSearchClick}
            className={`transition-colors ${isDarkText || activeMenu !== MenuCategory.NONE ? 'text-slate-600 hover:text-midnight' : 'text-white/90 hover:text-white'}`}
          >
            <Search size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden z-50 ${isDarkText ? 'text-midnight' : 'text-white'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mega Menu (Products - Updated Categories to match About Us style) */}
      <AnimatePresence>
        {activeMenu === MenuCategory.PRODUCTS && currentView !== 'products' && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="hidden md:block absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-2xl overflow-hidden"
          >
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-3 gap-8">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleSubMenuCategoryClick(cat.id)}
                    className="group flex flex-col items-start text-left p-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {cat.icon}
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {cat.name}
                        </h3>
                        <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" size={20}/>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mega Menu (About Us - Unified Style) */}
      <AnimatePresence>
        {activeMenu === MenuCategory.ABOUT && (
            <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3, ease: 'circOut' }}
                className="hidden md:block absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-2xl overflow-hidden"
            >
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-3 gap-8">
                        {ABOUT_ITEMS.map((item) => (
                             <button 
                                key={item.id} 
                                onClick={() => handleSubMenuClick(item.target as 'intro' | 'offline')}
                                className="group flex flex-col items-start text-left p-4 rounded-xl hover:bg-slate-50 transition-colors"
                              >
                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" size={20}/>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
                              </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-40 md:hidden pt-24 px-6 flex flex-col overflow-y-auto"
          >
            <div className="flex flex-col space-y-6">
                {NAV_LINKS.map(link => (
                    <div key={link.key}>
                        <a 
                            href={`#${link.key}`} 
                            className="text-2xl font-light text-slate-900 block" 
                            onClick={(e) => handleLinkClick(e, link.key)}
                        >
                            {link.label}
                        </a>
                        {/* Mobile Submenu for About */}
                        {link.key === 'about' && (
                            <div className="mt-4 ml-4 pl-4 border-l border-slate-100 flex flex-col space-y-3">
                                <button onClick={() => handleSubMenuClick('intro')} className="text-left text-slate-500 hover:text-blue-600">公司介绍</button>
                                <button onClick={() => handleSubMenuClick('offline')} className="text-left text-slate-500 hover:text-blue-600">线下体验</button>
                            </div>
                        )}
                         {/* Mobile Submenu for Products */}
                         {link.key === 'products' && (
                            <div className="mt-4 ml-4 pl-4 border-l border-slate-100 flex flex-col space-y-3">
                                {PRODUCT_CATEGORIES.map(cat => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => handleSubMenuCategoryClick(cat.id)} 
                                        className="text-left text-slate-500 hover:text-blue-600"
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                
                {/* Mobile Search Button */}
                <button 
                    onClick={() => {
                        handleSearchClick();
                        setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-xl font-light text-slate-900 mt-4"
                >
                    <Search size={24} /> 搜索
                </button>
            </div>
            <div className="mt-auto mb-12">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Contact</p>
                <p className="text-lg text-slate-800">{siteConfig.contactEmail || "hello@qespace.com"}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;