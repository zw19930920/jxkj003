import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Scenarios: React.FC = () => {
  const { scenarios } = useData();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              无处不在的<br />
              <span className="text-slate-400">私密空间解决方案</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                index === 0 ? 'md:col-span-2 md:aspect-[2/1]' : 'aspect-square'
              }`}
            >
              <img
                src={scenario.image}
                alt={scenario.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-medium bg-white/20 backdrop-blur-md text-white rounded-full">
                  {scenario.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{scenario.title}</h3>
                <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                    <p className="text-white/80 text-sm md:text-base pt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300 transform translate-y-4 group-hover:translate-y-0">
                        {scenario.description}
                    </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Scenarios;