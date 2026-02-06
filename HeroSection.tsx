import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    zIndex: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0
  })
};

const Hero: React.FC = () => {
  const { heroSlides } = useData();
  const [[page, direction], setPage] = useState([0, 0]);

  // We loop the index to get the current slide
  const slideIndex = ((page % heroSlides.length) + heroSlides.length) % heroSlides.length;
  const currentSlide = heroSlides[slideIndex];

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [page, heroSlides.length]);

  if (!currentSlide) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-midnight">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Media */}
          <div className="absolute inset-0">
            <img
              src={currentSlide.image}
              alt="Silent Space Background"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-black/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-center items-center text-center">
            
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8"
              dangerouslySetInnerHTML={{ 
                  // Allow basic HTML in titles for coloring/breaking lines as per original design
                  __html: typeof currentSlide.title === 'string' 
                    ? currentSlide.title.replace(/<span/g, '<span class="text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500"') 
                    : currentSlide.title 
              }} 
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 font-light leading-relaxed"
            >
              {currentSlide.desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="outline" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                探索产品
              </Button>
              <Button variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                预约体验
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute top-0 bottom-0 left-0 w-24 flex items-center justify-center z-20 group">
         <button 
            className="p-3 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md text-white transition-all transform hover:scale-110 -translate-x-full group-hover:translate-x-0 duration-300 opacity-0 group-hover:opacity-100"
            onClick={() => paginate(-1)}
            aria-label="Previous Slide"
         >
            <ChevronLeft size={32} />
         </button>
      </div>

      <div className="absolute top-0 bottom-0 right-0 w-24 flex items-center justify-center z-20 group">
         <button 
            className="p-3 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md text-white transition-all transform hover:scale-110 translate-x-full group-hover:translate-x-0 duration-300 opacity-0 group-hover:opacity-100"
            onClick={() => paginate(1)}
            aria-label="Next Slide"
         >
            <ChevronRight size={32} />
         </button>
      </div>
      
      {/* Mobile visible arrows (always visible on touch) */}
      <button 
         className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm"
         onClick={() => paginate(-1)}
      >
        <ChevronLeft size={24} />
      </button>
      <button 
         className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm"
         onClick={() => paginate(1)}
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
         {heroSlides.map((_, idx) => (
             <button
               key={idx}
               onClick={() => {
                   const direction = idx > slideIndex ? 1 : -1;
                   setPage([page + (idx - slideIndex), direction]);
               }}
               className={`h-1.5 rounded-full transition-all duration-300 ${idx === slideIndex ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/60 w-4'}`}
             />
         ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 z-20 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;