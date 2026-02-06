import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';
import { Target, Lightbulb, Trophy, Globe, Activity, ArrowDown, MapPin, Phone, Clock, X, ArrowRight } from 'lucide-react';
import Button from './Button';
import Footer from './Footer';
import { useData } from '../contexts/DataContext';

// --- Sub-components for specific sections ---

const Counter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, { duration: 2000, bounce: 0 });
  
  React.useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

const TimelineItem: React.FC<{ year: string; title: string; desc: string; align: 'left' | 'right' }> = ({ year, title, desc, align }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });

    return (
        <div ref={ref} className={`flex items-center justify-between w-full mb-24 md:mb-48 relative ${align === 'right' ? 'flex-row-reverse' : ''}`}>
            {/* Year Parallax Background */}
            <div className={`absolute top-1/2 -translate-y-1/2 ${align === 'left' ? '-left-12 md:-left-24' : '-right-12 md:-right-24'} text-[6rem] md:text-[10rem] font-bold text-white/5 pointer-events-none select-none z-0`}>
                {year}
            </div>

            {/* Content Card */}
            <motion.div 
                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`w-5/12 relative z-10 ${align === 'right' ? 'text-right' : 'text-left'}`}
            >
                 <div className="hidden md:block absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent opacity-0" />
                 <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
                 <p className="text-slate-400 leading-relaxed text-sm md:text-base">{desc}</p>
            </motion.div>
            
            {/* Center Node */}
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500 z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                 <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
            </div>

            {/* Empty space for the other side */}
            <div className="w-5/12" />
        </div>
    );
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

const AboutUs: React.FC = () => {
  const { aboutData, addLead } = useData();
  const { vision, mission } = aboutData; // Destructure vision and mission

  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', city: '', date: '' });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.name || !formData.phone) {
          alert('请填写姓名和联系电话');
          return;
      }

      const city = selectedLocation || formData.city || '未指定';
      const message = `预约线下体验。意向城市：${city}，预约日期：${formData.date || '未指定'}`;

      addLead({
          name: formData.name,
          phone: formData.phone,
          email: "", // Email not collected in this specific form
          message: message,
          source: 'AboutPage'
      });

      alert("预约申请已提交！我们会尽快联系您确认。");
      setFormOpen(false);
      setFormData({ name: '', phone: '', city: '', date: '' });
      setSelectedLocation('');
  };

  return (
    <div ref={containerRef} className="bg-[#0F1115] min-h-screen text-white overflow-hidden">
      
      {/* 1. Hero Section: The Depth of Silence - Now with Video */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0">
            {aboutData.heroVideoUrl ? (
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-50"
                    src={aboutData.heroVideoUrl}
                />
            ) : (
                <img 
                    src="https://picsum.photos/1920/1080?grayscale&blur=2&random=99" 
                    alt="Cinematic Silence"
                    className="w-full h-full object-cover opacity-40"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#0F1115]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-[-5vh]">
            <motion.h1 
                initial={{ opacity: 0, y: 100, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
                animate={{ opacity: 1, y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            >
                QE.SPACE<br />
                <span className="text-3xl md:text-5xl font-light text-slate-300 block mt-4">定义静谧的深度</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-lg text-slate-400 font-light tracking-widest uppercase mt-8"
            >
                Technology makes tranquility accessible.
            </motion.p>
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-10 text-slate-500"
        >
            <ArrowDown size={24} />
        </motion.div>
      </section>

      {/* 2. Values: Vision & Mission (Light Theme Transition) */}
      <section className="py-32 bg-[#F5F5F7] text-[#1D1D1F] relative">
          <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                  {/* Introduction */}
                  <div className="md:col-span-2 text-center max-w-3xl mx-auto mb-16">
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
                      >
                          “科技，让宁静触手可及。”
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-500 leading-relaxed"
                      >
                          QE.SPACE 诞生于对“个人专注空间”的极致追求。我们融合了尖端的声学工程与未来主义设计，致力于在喧嚣的世界中，为用户开辟一处物理与精神的双重庇护所。
                      </motion.p>
                  </div>

                  {/* Cards */}
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-shadow duration-500 group overflow-hidden relative"
                  >
                      <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                          <Target size={120} />
                      </div>
                      <div className="relative z-10">
                          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                              <Target size={24} />
                          </div>
                          <h3 className="text-2xl font-bold mb-4">{vision?.title || '我们的愿景'}</h3>
                          <p className="text-slate-500 text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:via-slate-500 group-hover:to-slate-800 group-hover:animate-shimmer bg-[length:200%_100%]">
                              {vision?.description || '让宁静成为一种随处可得的生产力，成为全球声学空间的领导者。'}
                          </p>
                      </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-shadow duration-500 group overflow-hidden relative"
                  >
                      <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                          <Lightbulb size={120} />
                      </div>
                      <div className="relative z-10">
                          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                              <Lightbulb size={24} />
                          </div>
                          <h3 className="text-2xl font-bold mb-4">{mission?.title || '我们的使命'}</h3>
                          <p className="text-slate-500 text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:via-slate-500 group-hover:to-slate-800 group-hover:animate-shimmer bg-[length:200%_100%]">
                              {mission?.description || '为每一颗忙碌的灵魂打造私属的寂静岛屿，守护专注与创造力。'}
                          </p>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* 3. History: Scrollytelling Timeline (Dark Theme Return) */}
      <section className="py-32 bg-[#0F1115] relative overflow-hidden" ref={timelineRef}>
          <div className="container mx-auto px-6 relative">
             <div className="text-center mb-24 relative z-10">
                 <h2 className="text-4xl font-bold text-white mb-4">品牌轨迹</h2>
                 <p className="text-slate-500">一步一个脚印，定义静音科技的未来</p>
             </div>

             {/* The Vertical Glowing Line */}
             <div className="absolute left-1/2 top-48 bottom-0 w-[1px] bg-slate-800 -translate-x-1/2 hidden md:block">
                <motion.div 
                    style={{ height: lineHeight }}
                    className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                />
             </div>

             <div className="max-w-4xl mx-auto">
                 {aboutData.timeline.map((item, index) => (
                    <TimelineItem 
                        key={index}
                        year={item.year} 
                        align={index % 2 === 0 ? 'left' : 'right'}
                        title={item.title} 
                        desc={item.desc}
                    />
                 ))}
             </div>
          </div>
      </section>

      {/* 4. Tech & Stats (Ambient Background) */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
          {/* Abstract Soundwave Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-64 bg-blue-500 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
              <div className="absolute bottom-0 right-0 w-2/3 h-64 bg-purple-500 blur-[150px] rounded-full mix-blend-screen" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div className="p-8 backdrop-blur-sm rounded-2xl border border-white/5">
                      <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 font-mono">
                          <Counter value={45} suffix="dB" />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm tracking-wider uppercase">
                          <Activity size={16} /> 极限消音值
                      </div>
                  </div>
                  <div className="p-8 backdrop-blur-sm rounded-2xl border border-white/5">
                      <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 font-mono">
                          <Counter value={120} suffix="+" />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm tracking-wider uppercase">
                          <Trophy size={16} /> 核心技术专利
                      </div>
                  </div>
                  <div className="p-8 backdrop-blur-sm rounded-2xl border border-white/5">
                      <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 font-mono">
                          <Counter value={50} suffix="" />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm tracking-wider uppercase">
                          <Globe size={16} /> 覆盖国家与地区
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. Offline Experience Centers (New Section) */}
      <section id="offline-experience" className="py-32 bg-[#F5F5F7] text-[#1D1D1F]">
          <div className="container mx-auto px-6">
              <div className="text-center mb-20">
                  <h2 className="text-4xl font-bold mb-4 text-[#1D1D1F]">线下体验中心</h2>
                  <p className="text-slate-500">亲临其境，感受“极静”的魅力</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {aboutData.locations.map((loc, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                      >
                          {/* Image */}
                          <div className="relative h-64 overflow-hidden">
                              <img 
                                src={loc.image} 
                                alt={loc.city} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                              <div className="absolute top-4 left-4">
                                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-widest rounded-full">{loc.name}</span>
                              </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-2xl font-bold">{loc.city}</h3>
                                  <ArrowDown className="transform -rotate-90 text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
                              </div>
                              <div className="space-y-3 text-sm text-slate-500">
                                  <div className="flex items-start gap-3">
                                      <MapPin size={16} className="mt-1 shrink-0" />
                                      <span>{loc.address}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <Clock size={16} />
                                      <span>周一至周日 10:00 - 22:00</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <Phone size={16} />
                                      {/* Display dynamic phone number or fallback */}
                                      <span>{loc.phone || '400-820-8888'}</span>
                                  </div>
                              </div>
                              <Button 
                                variant="secondary" 
                                className="w-full mt-6 text-xs"
                                onClick={() => {
                                    setSelectedLocation(loc.city);
                                    setFormOpen(true);
                                }}
                              >
                                预约体验
                              </Button>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {formOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 text-[#1D1D1F]"
            >
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                    onClick={() => setFormOpen(false)} 
                />
                
                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 overflow-hidden border border-slate-100"
                >
                    <button 
                        onClick={() => setFormOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X size={24} className="text-slate-500" />
                    </button>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">预约线下体验</h3>
                        <p className="text-slate-500 text-sm">填写您的信息，我们的体验顾问将为您安排专属时段。</p>
                        {selectedLocation && (
                            <div className="mt-4 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold inline-block rounded-full">
                                意向城市：{selectedLocation}
                            </div>
                        )}
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <InputField label="姓名" placeholder="如何称呼您" required={true} value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                        <InputField label="联系电话" placeholder="接收预约确认短信" required={true} type="tel" value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} />
                        
                        {!selectedLocation && (
                             <div className="relative group pt-4">
                                <label className="block text-xs text-slate-500 font-medium mb-2">选择城市</label>
                                <select 
                                    className="w-full bg-transparent border-b border-slate-300 py-2 text-lg text-slate-900 outline-none focus:border-blue-600"
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                >
                                    <option value="">请选择</option>
                                    {aboutData.locations.map(l => (
                                        <option key={l.city} value={l.city}>{l.city}</option>
                                    ))}
                                    <option value="Other">其他城市</option>
                                </select>
                            </div>
                        )}

                        <div className="relative group pt-2">
                             <label className="block text-xs text-slate-500 font-medium mb-2">预约时间 (日期)</label>
                             <input 
                                type="date" 
                                className="w-full bg-transparent border-b border-slate-300 py-2 text-slate-900 outline-none focus:border-blue-600" 
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                             />
                        </div>
                        
                        <div className="pt-4">
                            <Button className="w-full text-base py-3">
                                确认预约 <ArrowRight size={18} />
                            </Button>
                        </div>
                    </form>
                    
                    <div className="mt-6 pt-4 border-t border-slate-50 text-center">
                        <p className="text-[10px] text-slate-400">
                            我们会严格保护您的隐私，信息仅用于本次预约服务。
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      
      {/* Universal Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;