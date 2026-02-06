import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TECH_LAYERS } from '../constants';

const TechExplodedView: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // Reduced height from 200vh to 130vh for a tighter presentation
  return (
    <section ref={targetRef} className="relative h-[130vh] bg-slate-900 overflow-hidden text-white">
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden">
        
        {/* Background Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[100px]" />

        <div className="relative z-10 text-center mb-12">
            <motion.h2 
                style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }}
                className="text-4xl md:text-5xl font-bold mb-4"
            >
                精密声学架构
            </motion.h2>
            <motion.p 
                style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }}
                className="text-slate-400"
            >
                向下滚动，拆解静谧背后的秘密
            </motion.p>
        </div>

        {/* The Exploded Stack */}
        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] perspective-1000">
          {TECH_LAYERS.map((layer, index) => {
            // Adjusted transform ranges for the shorter scroll distance
            const yRange = [-50 * index, 100 * (index - 1.5)]; 
            // Also rotate them slightly to give 3D feel
            const rotateX = 60;
            const rotateZ = -15;

            // Faster transitions due to reduced height
            const y = useTransform(scrollYProgress, [0.1, 0.9], yRange);
            const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.8, 1], [0, 1, 1, 0]);
            const scale = useTransform(scrollYProgress, [0.1, 0.9], [0.9 + (index * 0.05), 1]);

            return (
              <motion.div
                key={layer.id}
                style={{ 
                    y, 
                    opacity,
                    scale,
                    rotateX: `${rotateX}deg`,
                    rotateZ: `${rotateZ}deg`,
                    zIndex: TECH_LAYERS.length - index 
                }}
                className={`absolute inset-0 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center justify-center transition-colors duration-500 ${layer.color}`}
              >
                {/* Visual Representation of Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                
                {/* Hotspot Label */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="absolute -right-64 md:-right-80 top-1/2 -translate-y-1/2 w-60 text-left"
                >
                   <div className="flex items-center gap-4">
                       <div className="w-12 h-[1px] bg-blue-500" />
                       <div>
                           <h4 className="text-xl font-bold text-white">{layer.title}</h4>
                           <p className="text-sm text-slate-400 mt-2">{layer.description}</p>
                       </div>
                   </div>
                </motion.div>

                {/* Layer Center Label (for clarity in abstraction) */}
                <span className="text-xs font-mono uppercase tracking-widest text-white/50 transform -rotate-90">
                    Layer 0{layer.id}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechExplodedView;