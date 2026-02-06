import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/HeroSection';
import ProductShowcase from './components/ProductShowcase';
import TechExplodedView from './components/TechExplodedView';
import Scenarios from './components/Scenarios';
import Footer from './components/Footer';
import ProductListing from './components/ProductListing';
import AboutUs from './components/AboutUs';
import RetailCustom from './components/RetailCustom';
import ContactUs from './components/ContactUs';
import SearchPage from './components/SearchPage';
import AdminPanel from './components/AdminPanel';
import { DataProvider } from './contexts/DataContext';
import { AnimatePresence, motion } from 'framer-motion';

const AppContent: React.FC = () => {
  // Routing state: 'landing' | 'products' | 'about' | 'custom' | 'contact' | 'search' | 'admin'
  const [currentView, setCurrentView] = useState<'landing' | 'products' | 'about' | 'custom' | 'contact' | 'search' | 'admin'>('landing');
  
  // State to hold parameters passed from search or navigation (e.g., target category, target product ID)
  const [searchParams, setSearchParams] = useState<{ category?: string, productId?: string } | undefined>(undefined);

  // Wrapper for navigation to handle params
  const handleNavigate = (view: 'landing' | 'products' | 'about' | 'custom' | 'contact' | 'search' | 'admin', params?: { category?: string, productId?: string }) => {
    if (params) {
        setSearchParams(params);
    } else {
        setSearchParams(undefined); 
    }
    setCurrentView(view);
  };

  return (
    <div className="antialiased selection:bg-blue-200 selection:text-blue-900">
      {currentView !== 'search' && currentView !== 'admin' && (
         <Navbar onNavigate={handleNavigate} currentView={currentView} />
      )}
      
      {currentView === 'admin' && (
          <AdminPanel onClose={() => setCurrentView('landing')} />
      )}

      <main>
        <AnimatePresence mode="wait">
          {currentView === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero />
              <ProductShowcase onNavigate={handleNavigate} />
              <TechExplodedView />
              <Scenarios />
              <Footer onAdminClick={() => setCurrentView('admin')} />
            </motion.div>
          ) : currentView === 'products' ? (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductListing 
                 initialCategory={searchParams?.category} 
                 initialProductId={searchParams?.productId} 
                 onNavigate={handleNavigate}
              />
            </motion.div>
          ) : currentView === 'about' ? (
             <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AboutUs />
            </motion.div>
          ) : currentView === 'custom' ? (
            <motion.div
              key="custom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RetailCustom />
            </motion.div>
          ) : currentView === 'contact' ? (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ContactUs />
            </motion.div>
          ) : currentView === 'search' ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchPage 
                onNavigate={handleNavigate} 
                onClose={() => setCurrentView('landing')} 
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <DataProvider>
            <AppContent />
        </DataProvider>
    );
};

export default App;